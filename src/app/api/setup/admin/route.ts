import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 检查数据库连接
    await prisma.$connect();

    // 检查是否已有管理员用户
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: '管理员账户已存在' },
        { status: 400 }
      );
    }

    const { email, username, password, setupKey } = await request.json();

    // 简单的设置密钥验证（可以设置为环境变量）
    const expectedSetupKey = process.env.SETUP_KEY || 'admin-setup-2025';
    if (setupKey !== expectedSetupKey) {
      return NextResponse.json(
        { error: '设置密钥错误' },
        { status: 401 }
      );
    }

    // 验证输入
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: '邮箱、用户名和密码都是必填项' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6位' },
        { status: 400 }
      );
    }

    // 检查邮箱和用户名是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '邮箱或用户名已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: username,
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: '管理员账户创建成功',
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('创建管理员账户失败:', error);
    await prisma.$disconnect();

    return NextResponse.json(
      { error: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}
