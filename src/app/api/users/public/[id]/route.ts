// 公开单个用户信息API
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        posts: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
            views: true,
            likes: true,
            category: {
              select: { name: true, slug: true }
            }
          },
          orderBy: { publishedAt: 'desc' },
          take: 10
        },
        projects: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            technologies: true,
            githubUrl: true,
            liveUrl: true,
            views: true
          },
          orderBy: { updatedAt: 'desc' },
          take: 10
        },
        _count: {
          select: { 
            posts: {
              where: { status: 'PUBLISHED' }
            },
            projects: {
              where: { status: 'COMPLETED' }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        publishedPosts: user._count.posts,
        completedProjects: user._count.projects
      }
    });

  } catch (error) {
    console.error('Get public user error:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
