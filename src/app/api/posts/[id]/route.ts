import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
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
        comments: {
          where: { status: 'APPROVED' },
          include: {
            author: {
              select: {
                name: true,
                username: true,
              },
            },
            replies: {
              where: { status: 'APPROVED' },
              include: {
                author: {
                  select: {
                    name: true,
                    username: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
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
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      post: {
        ...post,
        tags: post.tags.map(pt => pt.tag),
        commentCount: post._count.comments,
      },
    });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const { title, slug, excerpt, content, status, featured, categoryId, tags } = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 如果 slug 改变了，检查新的 slug 是否已存在
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'URL别名已存在' },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'PUBLISHED' && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (featured !== undefined) updateData.featured = featured;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // 更新标签关联
    if (tags !== undefined) {
      // 删除现有的标签关联
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });

      // 创建新的标签关联
      if (tags.length > 0) {
        const tagConnections = tags.map((tagId: string) => ({
          postId: id,
          tagId,
        }));

        await prisma.postTag.createMany({
          data: tagConnections,
        });
      }
    }

    // 获取完整的文章信息（包含标签）
    const fullPost = await prisma.post.findUnique({
      where: { id },
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

    return NextResponse.json({
      message: '文章更新成功',
      post: {
        ...fullPost,
        tags: fullPost?.tags.map(pt => pt.tag) || [],
      },
    });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    );
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
}
