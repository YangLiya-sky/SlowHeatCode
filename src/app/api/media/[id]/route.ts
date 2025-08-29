import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// DELETE /api/media/[id] - 删除媒体文件
export async function DELETE(
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

    // 在Vercel生产环境中，只删除数据库记录
    // 物理文件删除需要云存储服务支持
    await prisma.media.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '文件记录删除成功（物理文件需要在云存储中手动删除）'
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
