import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
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

    // 检查Cloudinary配置
    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!hasCloudinaryConfig) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary配置不完整' },
        { status: 400 }
      );
    }

    console.log('Starting Cloudinary test upload...');
    console.log('Config check:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME?.substring(0, 5) + '...'
    });

    // 创建一个简单的测试图片（1x1像素的红色PNG）
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');

    console.log('Test image created, size:', testImageBuffer.length, 'bytes');

    try {
      // 测试上传到Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'vibe-blog',
            public_id: `test-upload-${Date.now()}`,
            overwrite: true
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload stream error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success:', result?.public_id);
              resolve(result);
            }
          }
        ).end(testImageBuffer);
      }) as any;

      console.log('Upload successful:', uploadResult.public_id);

      // 立即删除测试文件
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id);
        console.log('Test file cleaned up:', uploadResult.public_id);
      } catch (cleanupError) {
        console.warn('Failed to cleanup test file:', cleanupError);
      }

      return NextResponse.json({
        success: true,
        message: 'Cloudinary上传测试成功',
        testResult: {
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          cleanedUp: true
        }
      });

    } catch (uploadError) {
      console.error('Cloudinary upload test failed:', uploadError);
      
      let errorMessage = '未知错误';
      let errorDetails = '';
      
      if (uploadError instanceof Error) {
        errorMessage = uploadError.message;
        errorDetails = uploadError.stack || '';
      } else if (typeof uploadError === 'object' && uploadError !== null) {
        errorMessage = JSON.stringify(uploadError);
        errorDetails = String(uploadError);
      } else {
        errorMessage = String(uploadError);
      }

      return NextResponse.json({
        success: false,
        error: `Cloudinary上传测试失败: ${errorMessage}`,
        details: errorDetails,
        errorType: typeof uploadError,
        isError: uploadError instanceof Error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test upload API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `测试失败: ${error instanceof Error ? error.message : '未知错误'}` 
      },
      { status: 500 }
    );
  }
}
