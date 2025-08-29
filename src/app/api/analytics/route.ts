import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // 获取统计数据
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
      recentPosts,
      popularPosts,
      categoryStats,
    ] = await Promise.all([
      // 总文章数
      prisma.post.count(),

      // 已发布文章数
      prisma.post.count({
        where: { status: 'PUBLISHED' },
      }),

      // 草稿数
      prisma.post.count({
        where: { status: 'DRAFT' },
      }),

      // 总浏览量
      prisma.post.aggregate({
        _sum: { views: true },
      }),

      // 总点赞数
      prisma.post.aggregate({
        _sum: { likes: true },
      }),

      // 最近文章
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
          createdAt: true,
        },
      }),

      // 热门文章
      prisma.post.findMany({
        take: 5,
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        select: {
          id: true,
          title: true,
          views: true,
          likes: true,
        },
      }),

      // 分类统计
      prisma.category.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        }
      }),
    ]);

    // 计算本月新增文章
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: thisMonth,
        },
      },
    });

    // 计算平均阅读时间（模拟数据）
    const avgReadTime = totalViews._sum.views ?
      Math.round((totalViews._sum.views * 4.2) / totalPosts * 100) / 100 : 0;

    return NextResponse.json({
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes._sum.likes || 0,
        thisMonthPosts,
        avgReadTime,
      },
      recentPosts,
      popularPosts,
      categoryStats: categoryStats.map(category => ({
        category: category.name,
        count: category._count.posts,
      })),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
