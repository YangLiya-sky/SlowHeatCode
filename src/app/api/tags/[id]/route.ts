import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// PUT /api/tags/[id] - 更新标签
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

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: '标签名称不能为空' },
        { status: 400 }
      );
    }

    // 生成新的slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug: slug + '-' + Date.now(),
      }
    });

    return NextResponse.json({
      success: true,
      message: '标签更新成功',
      tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    return NextResponse.json(
      { success: false, error: '更新标签失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - 删除标签
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

    // 检查是否有文章使用此标签
    const postCount = await prisma.postTag.count({
      where: { tagId: id }
    });

    if (postCount > 0) {
      return NextResponse.json(
        { success: false, error: `无法删除标签，还有 ${postCount} 篇文章使用此标签` },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '标签删除成功'
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    return NextResponse.json(
      { success: false, error: '删除标签失败' },
      { status: 500 }
    );
  }
}
