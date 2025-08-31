import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// DELETE /api/media/[id] - 删除媒体文件
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // 获取媒体文件信息
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      );
    }

    // 检查是否有文章使用此媒体文件
    const postMediaCount = await prisma.postMedia.count({
      where: { mediaId: id }
    });

    if (postMediaCount > 0) {
      return NextResponse.json(
        { success: false, error: `无法删除文件，还有 ${postMediaCount} 篇文章使用此文件` },
        { status: 400 }
      );
    }

    // 检查是否在生产环境且配置了Cloudinary
    const isProduction = process.env.NODE_ENV === 'production';
    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    // 删除物理文件
    if (isProduction && hasCloudinaryConfig) {
      // 生产环境：从Cloudinary删除
      try {
        // 如果filename是Cloudinary的public_id，直接删除
        // 如果是URL，需要提取public_id
        let publicId = media.filename;
        if (media.url.includes('cloudinary.com')) {
          // 从URL中提取public_id
          const urlParts = media.url.split('/');
          const fileWithExt = urlParts[urlParts.length - 1];
          publicId = fileWithExt.split('.')[0];
          // 如果有文件夹，需要包含文件夹路径
          if (media.url.includes('/vibe-blog/')) {
            publicId = `vibe-blog/${publicId}`;
          }
        }

        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Cloudinary delete error:', error);
        // 即使云存储删除失败，也继续删除数据库记录
      }
    } else {
      // 开发环境：删除本地文件
      try {
        const filePath = join(process.cwd(), 'public', 'uploads', media.filename);
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error('Local file delete error:', error);
        // 即使本地文件删除失败，也继续删除数据库记录
      }
    }

    // 删除数据库记录
    await prisma.media.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { success: false, error: '删除文件失败' },
      { status: 500 }
    );
  }
}

// PUT /api/media/[id] - 更新媒体文件信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
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

    const { id } = await params;
    const { alt } = await request.json();

    const media = await prisma.media.update({
      where: { id },
      data: { alt }
    });

    return NextResponse.json({
      success: true,
      message: '文件信息更新成功',
      media
    });
  } catch (error) {
    console.error('Update media error:', error);
    return NextResponse.json(
      { success: false, error: '更新文件信息失败' },
      { status: 500 }
    );
  }
}
