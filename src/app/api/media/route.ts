import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

    // Vercel无服务器环境不支持文件系统操作
    // 建议使用云存储服务如Cloudinary、AWS S3等
    return NextResponse.json(
      {
        success: false,
        error: '文件上传功能在生产环境中需要配置云存储服务。请联系管理员配置Cloudinary或AWS S3。',
        suggestion: '建议使用外部图片链接或配置云存储服务'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Upload media error:', error);
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    );
  }
}
