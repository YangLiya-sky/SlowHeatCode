import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// PUT /api/comments/[id] - 更新评论状态
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth-token')?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const { status, content } = await request.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (content) updateData.content = content;

    const comment = await prisma.comment.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: '评论更新成功',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json(
      { success: false, error: '更新评论失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth-token')?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    // 删除评论及其回复
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id },
          { parentId: id }
        ]
      }
    });

    return NextResponse.json({
      success: true,
      message: '评论删除成功'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { success: false, error: '删除评论失败' },
      { status: 500 }
    );
  }
}


