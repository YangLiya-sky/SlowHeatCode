import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// PUT /api/categories/[id] - 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth-token')?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: '分类名称不能为空' },
        { status: 400 }
      );
    }

    // 生成新的slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || '',
        slug: slug + '-' + Date.now(),
      }
    });

    return NextResponse.json({
      success: true,
      message: '分类更新成功',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: '更新分类失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth-token')?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    // 检查是否有文章使用此分类
    const postCount = await prisma.post.count({
      where: { categoryId: id }
    });

    if (postCount > 0) {
      return NextResponse.json(
        { success: false, error: `无法删除分类，还有 ${postCount} 篇文章使用此分类` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '分类删除成功'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: '删除分类失败' },
      { status: 500 }
    );
  }
}
