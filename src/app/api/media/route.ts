import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import cloudinary from '@/lib/cloudinary';

// GET /api/media - 获取所有媒体文件
export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      media
    });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { success: false, error: '获取媒体文件失败' },
      { status: 500 }
    );
  }
}

// POST /api/media - 上传媒体文件
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '请选择文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: '文件大小不能超过5MB' },
        { status: 400 }
      );
    }

    let fileUrl: string;
    let filename: string;

    // 检查是否在生产环境且配置了Cloudinary
    const isProduction = process.env.NODE_ENV === 'production';
    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (isProduction && hasCloudinaryConfig) {
      // 生产环境：使用Cloudinary
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 上传到Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'vibe-blog',
              public_id: `${Date.now()}-${file.name.split('.')[0]}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        }) as any;

        fileUrl = uploadResult.secure_url;
        filename = uploadResult.public_id;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
          { success: false, error: '云存储上传失败' },
          { status: 500 }
        );
      }
    } else {
      // 开发环境：使用本地文件系统
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      filename = `${timestamp}.${fileExtension}`;

      // 确保uploads目录存在
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // 保存文件
      const filePath = join(uploadsDir, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    }

    // 保存到数据库
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: fileUrl,
        alt: alt || file.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      media,
    });
  } catch (error) {
    console.error('Upload media error:', error);
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    );
  }
}
