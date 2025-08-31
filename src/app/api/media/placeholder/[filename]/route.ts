import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // 创建一个简单的占位符SVG图片
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f3f4f6"/>
      <text x="100" y="90" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">
        文件上传失败
      </text>
      <text x="100" y="110" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">
        ${filename}
      </text>
      <text x="100" y="130" text-anchor="middle" font-family="Arial" font-size="10" fill="#d1d5db">
        请检查Cloudinary配置
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}
