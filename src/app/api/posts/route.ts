import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = {
        slug: category
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          status: true,
          featured: true,
          views: true,
          likes: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
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
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: {
                where: {
                  status: 'APPROVED'
                }
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // 转换标签格式
    const postsWithTags = posts.map(post => ({
      ...post,
      tags: post.tags.map(pt => pt.tag),
      commentCount: post._count.comments,
    }));

    return NextResponse.json({
      posts: postsWithTags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
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

    const { title, slug, excerpt, content, status, featured, categoryId, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 生成 slug（如果没有提供）
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // 检查 slug 是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug: finalSlug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'URL别名已存在' },
        { status: 409 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        status: status || 'DRAFT',
        featured: featured || false,
        categoryId: categoryId || null,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: user.id,
      },
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

    // 创建标签关联
    if (tags && tags.length > 0) {
      const tagConnections = tags.map((tagId: string) => ({
        postId: post.id,
        tagId,
      }));

      await prisma.postTag.createMany({
        data: tagConnections,
      });
    }

    // 获取完整的文章信息（包含标签）
    const fullPost = await prisma.post.findUnique({
      where: { id: post.id },
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
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: '文章创建成功',
      post: {
        ...fullPost,
        tags: fullPost?.tags.map(pt => pt.tag) || [],
      },
    });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
}
