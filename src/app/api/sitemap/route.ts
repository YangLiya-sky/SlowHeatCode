// 站点地图API
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 获取所有已发布的文章
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        id: true,
        updatedAt: true,
        publishedAt: true
      },
      orderBy: { publishedAt: 'desc' }
    });

    // 获取所有已完成的项目
    const projects = await prisma.project.findMany({
      where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
      select: {
        slug: true,
        id: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    // 获取所有分类
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true
      }
    });

    // 获取网站设置
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['site_url']
        }
      }
    });

    const siteUrl = settings.find(s => s.key === 'site_url')?.value || 'https://your-domain.com';

    // 生成站点地图XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 博客首页 -->
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 项目首页 -->
  <url>
    <loc>${siteUrl}/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 归档页面 -->
  <url>
    <loc>${siteUrl}/archive</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 搜索页面 -->
  <url>
    <loc>${siteUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- 关于页面 -->
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 技能页面 -->
  <url>
    <loc>${siteUrl}/skills</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 联系页面 -->
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- 文章页面 -->
  ${posts.map(post => `
  <url>
    <loc>${siteUrl}/blog/${post.slug || post.id}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
  
  <!-- 项目页面 -->
  ${projects.map(project => `
  <url>
    <loc>${siteUrl}/projects/${project.slug || project.id}</loc>
    <lastmod>${project.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
  
  <!-- 分类页面 -->
  ${categories.map(category => `
  <url>
    <loc>${siteUrl}/blog?category=${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `).join('')}
</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400', // 缓存24小时
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}
