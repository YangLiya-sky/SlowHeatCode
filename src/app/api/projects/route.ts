import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/projects - 获取项目列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { technologies: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.project.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { success: false, error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/projects - 创建新项目
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const {
      title,
      slug,
      description,
      content,
      technologies,
      category,
      githubUrl,
      liveUrl,
      status,
      featured,
      startDate,
      endDate
    } = await request.json();

    // 验证必填字段
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: '标题和描述为必填项' },
        { status: 400 }
      );
    }

    // 检查slug是否已存在
    if (slug) {
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      });

      if (existingProject) {
        return NextResponse.json(
          { success: false, error: 'URL别名已存在' },
          { status: 400 }
        );
      }
    }

    // 验证用户是否存在于数据库中
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        description,
        content: content || '',
        technologies: technologies || '',
        category: category || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        status: status || 'DRAFT',
        featured: featured || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        authorId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: '项目创建成功',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: '创建项目失败' },
      { status: 500 }
    );
  }
}
