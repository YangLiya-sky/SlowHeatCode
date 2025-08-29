import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}.${extension}`;
    const filepath = join(uploadDir, filename);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // 保存到数据库
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${filename}`,
        alt: alt || file.name
      }
    });

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      media
    });
  } catch (error) {
    console.error('Upload media error:', error);
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    );
  }
}
