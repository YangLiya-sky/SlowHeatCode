import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: '退出登录成功' });
  
  // 清除 auth-token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return response;
}
