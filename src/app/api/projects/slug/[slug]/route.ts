// 通过slug获取项目详情API
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug } // 兼容旧的ID路由
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      );
    }

    // 增加浏览量
    await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        views: project.views + 1
      }
    });

  } catch (error) {
    console.error('Get project by slug error:', error);
    return NextResponse.json(
      { success: false, error: '获取项目失败' },
      { status: 500 }
    );
  }
}
