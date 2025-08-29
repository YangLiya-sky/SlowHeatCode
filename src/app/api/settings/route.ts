import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/settings - 获取所有设置
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();

    // 转换为键值对格式
    const settingsMap = settings.reduce((acc, setting) => {
      let value = setting.value;

      // 根据类型转换值
      switch (setting.type) {
        case 'boolean':
          value = setting.value === 'true';
          break;
        case 'number':
          value = parseFloat(setting.value);
          break;
        case 'json':
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
          break;
        default:
          value = setting.value;
      }

      acc[setting.key] = value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      settings: settingsMap
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: '获取设置失败' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - 批量更新设置
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const settings = await request.json();

    // 批量更新设置
    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      let stringValue: string;
      let type = 'string';

      // 确定类型和值
      if (typeof value === 'boolean') {
        type = 'boolean';
        stringValue = value.toString();
      } else if (typeof value === 'number') {
        type = 'number';
        stringValue = value.toString();
      } else if (typeof value === 'object') {
        type = 'json';
        stringValue = JSON.stringify(value);
      } else {
        stringValue = String(value);
      }

      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: '设置更新成功'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, error: '更新设置失败' },
      { status: 500 }
    );
  }
}

// POST /api/settings - 创建单个设置
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const { key, value, type = 'string' } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: '键和值不能为空' },
        { status: 400 }
      );
    }

    let stringValue: string;

    if (type === 'json') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }

    const setting = await prisma.setting.create({
      data: { key, value: stringValue, type }
    });

    return NextResponse.json({
      success: true,
      message: '设置创建成功',
      setting
    });
  } catch (error) {
    console.error('Create setting error:', error);
    return NextResponse.json(
      { success: false, error: '创建设置失败' },
      { status: 500 }
    );
  }
}
