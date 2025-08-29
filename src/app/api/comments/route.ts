import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/comments - 获取所有评论
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const postId = searchParams.get('postId');
    
    const where: any = {};
    if (status) where.status = status;
    if (postId) where.postId = postId;

    const comments = await prisma.comment.findMany({
      where,
      include: {
        post: {
          select: { title: true }
        },
        author: {
          select: { name: true, username: true }
        },
        replies: {
          include: {
            author: {
              select: { name: true, username: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: '获取评论失败' },
      { status: 500 }
    );
  }
}

// POST /api/comments - 创建新评论
export async function POST(request: NextRequest) {
  try {
    const { postId, content, guestName, guestEmail, parentId } = await request.json();
    
    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: '文章ID和评论内容不能为空' },
        { status: 400 }
      );
    }

    // 检查文章是否存在
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查是否启用评论功能
    const commentSetting = await prisma.setting.findUnique({
      where: { key: 'enable_comments' }
    });

    if (commentSetting?.value !== 'true') {
      return NextResponse.json(
        { success: false, error: '评论功能已关闭' },
        { status: 403 }
      );
    }

    // 检查是否需要审核
    const moderationSetting = await prisma.setting.findUnique({
      where: { key: 'comment_moderation' }
    });

    const status = moderationSetting?.value === 'true' ? 'PENDING' : 'APPROVED';

    const comment = await prisma.comment.create({
      data: {
        content,
        status,
        postId,
        guestName,
        guestEmail,
        parentId
      }
    });

    return NextResponse.json({
      success: true,
      message: status === 'PENDING' ? '评论已提交，等待审核' : '评论发布成功',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { success: false, error: '创建评论失败' },
      { status: 500 }
    );
  }
}
