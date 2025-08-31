import { NextRequest, NextResponse } from 'next/server';
import { RecommendationEngine } from '@/lib/recommendations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    const relatedPosts = await RecommendationEngine.getRelatedPosts(id, limit);

    return NextResponse.json({
      success: true,
      data: relatedPosts
    });
  } catch (error) {
    console.error('Get related posts error:', error);
    return NextResponse.json(
      { success: false, error: '获取相关文章失败' },
      { status: 500 }
    );
  }
}
