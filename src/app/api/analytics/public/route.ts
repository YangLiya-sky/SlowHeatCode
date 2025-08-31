// 公开数据统计API - 不需要认证
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 获取公开统计数据
    const [
      totalPosts,
      totalProjects,
      totalCategories,
      totalTags,
      totalViews,
      recentPosts,
      popularPosts
    ] = await Promise.all([
      // 已发布文章总数
      prisma.post.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // 已完成项目总数
      prisma.project.count({
        where: { status: 'COMPLETED' }
      }),
      
      // 分类总数
      prisma.category.count(),
      
      // 标签总数
      prisma.tag.count(),
      
      // 总浏览量
      prisma.post.aggregate({
        where: { status: 'PUBLISHED' },
        _sum: { views: true }
      }).then(result => result._sum.views || 0),
      
      // 最近发布的文章
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true
        },
        orderBy: { publishedAt: 'desc' },
        take: 5
      }),
      
      // 热门文章
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          views: true
        },
        orderBy: { views: 'desc' },
        take: 5
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalPosts,
          totalProjects,
          totalCategories,
          totalTags,
          totalViews
        },
        recentPosts,
        popularPosts,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get public analytics error:', error);
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
