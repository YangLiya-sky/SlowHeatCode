import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

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
      hasCloudinaryUrl: !!process.env.CLOUDINARY_URL,
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudinaryUrl: process.env.CLOUDINARY_URL ?
        process.env.CLOUDINARY_URL.substring(0, 20) + '...' : 'undefined',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ?
        process.env.CLOUDINARY_CLOUD_NAME.substring(0, 5) + '...' : 'undefined',
      nodeEnv: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production'
    };

    const hasCloudinaryConfig = process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);

    let cloudinaryTest = null;

    // 如果配置完整，测试Cloudinary连接
    if (hasCloudinaryConfig) {
      try {
        console.log('Testing Cloudinary connection...');

        // 测试API连接 - 获取账户信息
        const result = await cloudinary.api.ping();
        console.log('Cloudinary ping result:', result);

        cloudinaryTest = {
          success: true,
          message: 'Cloudinary连接成功',
          pingResult: result
        };
      } catch (error) {
        console.error('Cloudinary test error:', error);
        cloudinaryTest = {
          success: false,
          message: 'Cloudinary连接失败',
          error: error instanceof Error ? error.message : String(error),
          details: error instanceof Error ? error.stack : undefined
        };
      }
    }

    return NextResponse.json({
      success: true,
      config: cloudinaryConfig,
      hasCompleteConfig: !!hasCloudinaryConfig,
      willUseCloudinary: !!(process.env.NODE_ENV === 'production' && hasCloudinaryConfig),
      cloudinaryTest
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
