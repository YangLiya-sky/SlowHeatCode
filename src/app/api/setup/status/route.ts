import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    
    // 检查是否已有管理员用户
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    await prisma.$disconnect();
    
    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    });

  } catch (error) {
    console.error('检查系统状态失败:', error);
    await prisma.$disconnect();
    
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
