import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/tags - 获取所有标签
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      tags: tags.map(tag => ({
        ...tag,
        postCount: tag._count.posts
      }))
    });
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { success: false, error: '获取标签失败' },
      { status: 500 }
    );
  }
}

// POST /api/tags - 创建新标签
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: '标签名称不能为空' },
        { status: 400 }
      );
    }

    // 生成slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slug + '-' + Date.now(), // 确保唯一性
      }
    });

    return NextResponse.json({
      success: true,
      message: '标签创建成功',
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json(
      { success: false, error: '创建标签失败' },
      { status: 500 }
    );
  }
}
