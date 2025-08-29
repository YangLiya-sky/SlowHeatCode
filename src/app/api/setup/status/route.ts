import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Setup status check requested');

    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');

    // 检查是否已有管理员用户
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });
    console.log('Admin count:', adminCount);

    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    });

  } catch (error) {
    console.error('检查系统状态失败:', error);

    return NextResponse.json(
      {
        error: '无法连接数据库',
        hasAdmin: false,
        adminCount: 0
      },
      { status: 500 }
    );
  }
}
