// 公开用户信息API - 不需要认证
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 只返回公开的用户信息
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
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
      },
      where: {
        role: {
          in: ['USER', 'ADMIN'] // 只显示普通用户和管理员
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      users: users.map((user: any) => ({
        ...user,
        publishedPosts: user._count.posts,
        completedProjects: user._count.projects
      }))
    });

  } catch (error) {
    console.error('Get public users error:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
