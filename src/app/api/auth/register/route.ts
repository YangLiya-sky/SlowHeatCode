import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, name } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: '邮箱、用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '邮箱或用户名已存在' },
        { status: 409 }
      );
    }

    const user = await createUser(email, username, password, name);
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      message: '注册成功',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    // 设置 HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
