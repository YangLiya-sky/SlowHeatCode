import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// POST /api/comments/[id]/reply - 回复评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: '回复内容不能为空' },
        { status: 400 }
      );
    }

    // 获取原评论信息
    const parentComment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!parentComment) {
      return NextResponse.json(
        { success: false, error: '原评论不存在' },
        { status: 404 }
      );
    }

    const reply = await prisma.comment.create({
      data: {
        content,
        status: 'APPROVED', // 管理员回复直接通过
        postId: parentComment.postId,
        authorId: user.id,
        parentId: id
      }
    });

    return NextResponse.json({
      success: true,
      message: '回复成功',
      reply
    });
  } catch (error) {
    console.error('Reply comment error:', error);
    return NextResponse.json(
      { success: false, error: '回复失败' },
      { status: 500 }
    );
  }
}
