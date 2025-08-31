// 公开系统设置API - 不需要认证
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 只返回公开的设置信息
    const publicSettings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'site_title',
            'site_subtitle',
            'site_description',
            'contact_email',
            'github_url',
            'enable_comments',
            'seo_optimization'
          ]
        }
      }
    });

    // 转换为键值对格式
    const settings: Record<string, any> = {};
    publicSettings.forEach(setting => {
      let value: any = setting.value;

      // 根据类型转换值
      if (setting.type === 'boolean') {
        value = setting.value === 'true';
      } else if (setting.type === 'number') {
        value = parseFloat(setting.value);
      }

      settings[setting.key] = value;
    });

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Get public settings error:', error);
    return NextResponse.json(
      { success: false, error: '获取设置失败' },
      { status: 500 }
    );
  }
}
