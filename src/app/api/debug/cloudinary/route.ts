import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 验证用户权限
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    // 检查环境变量
    const cloudinaryConfig = {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 
        process.env.CLOUDINARY_CLOUD_NAME.substring(0, 5) + '...' : 'undefined',
      nodeEnv: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production'
    };

    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    return NextResponse.json({
      success: true,
      config: cloudinaryConfig,
      hasCompleteConfig: hasCloudinaryConfig,
      willUseCloudinary: process.env.NODE_ENV === 'production' && hasCloudinaryConfig
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: `诊断失败: ${error instanceof Error ? error.message : '未知错误'}` 
      },
      { status: 500 }
    );
  }
}
