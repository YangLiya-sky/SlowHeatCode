// 归档API - 按年月获取文章
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!year && !month) {
      // 返回归档概览 - 按年月分组的文章数量
      const archiveData = await prisma.post.groupBy({
        by: ['publishedAt'],
        where: {
          status: 'PUBLISHED',
          publishedAt: { not: null }
        },
        _count: true
      });

      // 按年月分组统计
      const archiveMap = new Map<string, number>();
      archiveData.forEach((item: any) => {
        if (item.publishedAt) {
          const date = new Date(item.publishedAt);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          archiveMap.set(key, (archiveMap.get(key) || 0) + item._count);
        }
      });

      // 转换为数组并排序
      const archive = Array.from(archiveMap.entries())
        .map(([key, count]) => {
          const [yearStr, monthStr] = key.split('-');
          return {
            year: parseInt(yearStr),
            month: parseInt(monthStr),
            count
          };
        })
        .sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        });

      return NextResponse.json({
        success: true,
        archive
      });
    }

    // 获取特定年月的文章
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    const monthNum = month ? parseInt(month) : undefined;

    const where: any = {
      status: 'PUBLISHED',
      publishedAt: { not: null }
    };

    if (monthNum) {
      // 特定年月
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
      where.publishedAt = {
        gte: startDate,
        lte: endDate
      };
    } else {
      // 整年
      const startDate = new Date(yearNum, 0, 1);
      const endDate = new Date(yearNum, 11, 31, 23, 59, 59);
      where.publishedAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    // 格式化数据
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(t => t.tag)
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      year: yearNum,
      month: monthNum,
      total: posts.length
    });

  } catch (error) {
    console.error('Get archive error:', error);
    return NextResponse.json(
      { success: false, error: '获取归档数据失败' },
      { status: 500 }
    );
  }
}
