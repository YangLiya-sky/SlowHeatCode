import { NextRequest, NextResponse } from 'next/server';
import { notifyDataUpdate } from '@/lib/realTimeNotify';

// 手动触发数据更新的端点
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();

    if (!type) {
      return NextResponse.json(
        { success: false, error: '缺少数据类型参数' },
        { status: 400 }
      );
    }

    // 触发数据更新通知
    await notifyDataUpdate(type);

    return NextResponse.json({
      success: true,
      message: `${type} 数据更新已触发`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Trigger data update error:', error);
    return NextResponse.json(
      { success: false, error: '触发数据更新失败' },
      { status: 500 }
    );
  }
}
