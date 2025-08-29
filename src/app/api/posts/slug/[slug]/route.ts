import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 通过 slug 获取文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 增加浏览量
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      post: {
        ...post,
        tags: post.tags.map(pt => pt.tag),
      },
    });
  } catch (error) {
    console.error('Get post by slug error:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}
