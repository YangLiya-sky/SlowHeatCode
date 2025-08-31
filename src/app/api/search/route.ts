// 全站搜索API
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'posts', 'projects', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: '搜索关键词至少需要2个字符'
      }, { status: 400 });
    }

    const searchTerm = query.trim();
    const results: any = {
      posts: [],
      projects: [],
      categories: [],
      tags: []
    };

    // 搜索文章
    if (!type || type === 'posts' || type === 'all') {
      results.posts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { excerpt: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        include: {
          author: {
            select: { id: true, username: true, name: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true, slug: true }
              }
            }
          },
          _count: {
            select: { comments: true }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' }
        ],
        take: limit
      });

      // 格式化文章数据
      results.posts = results.posts.map((post: any) => ({
        ...post,
        tags: post.tags.map((t: any) => t.tag),
        type: 'post'
      }));
    }

    // 搜索项目
    if (!type || type === 'projects' || type === 'all') {
      results.projects = await prisma.project.findMany({
        where: {
          status: { in: ['COMPLETED', 'ACTIVE'] },
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { technologies: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        include: {
          author: {
            select: { id: true, username: true, name: true }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { updatedAt: 'desc' }
        ],
        take: limit
      });

      results.projects = results.projects.map((project: any) => ({
        ...project,
        type: 'project'
      }));
    }

    // 搜索分类
    if (!type || type === 'all') {
      results.categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        include: {
          _count: {
            select: { posts: true }
          }
        },
        take: 10
      });

      results.categories = results.categories.map((category: any) => ({
        ...category,
        type: 'category',
        postCount: category._count.posts
      }));
    }

    // 搜索标签
    if (!type || type === 'all') {
      results.tags = await prisma.tag.findMany({
        where: {
          name: { contains: searchTerm, mode: 'insensitive' }
        },
        include: {
          _count: {
            select: { posts: true }
          }
        },
        take: 10
      });

      results.tags = results.tags.map((tag: any) => ({
        ...tag,
        type: 'tag',
        postCount: tag._count.posts
      }));
    }

    // 计算总结果数
    const totalResults = results.posts.length + 
                        results.projects.length + 
                        results.categories.length + 
                        results.tags.length;

    // 如果指定了类型，只返回该类型的结果
    if (type && type !== 'all') {
      return NextResponse.json({
        success: true,
        results: results[type] || [],
        total: results[type]?.length || 0,
        query: searchTerm,
        type
      });
    }

    return NextResponse.json({
      success: true,
      results,
      total: totalResults,
      query: searchTerm,
      type: 'all'
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: '搜索失败' },
      { status: 500 }
    );
  }
}
