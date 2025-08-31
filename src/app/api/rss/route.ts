// RSS订阅API
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 获取最新的已发布文章
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 20
    });

    // 获取网站设置
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['site_title', 'site_description', 'site_url']
        }
      }
    });

    const settingsMap = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    const siteTitle = settingsMap.site_title || 'Vibe Blog';
    const siteDescription = settingsMap.site_description || '现代化玻璃拟态博客系统';
    const siteUrl = settingsMap.site_url || 'https://your-domain.com';

    // 生成RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl}/feed.xsl"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <description><![CDATA[${siteDescription}]]></description>
    <link>${siteUrl}</link>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <generator>Vibe Blog RSS Generator</generator>
    <webMaster>admin@${siteUrl.replace('https://', '').replace('http://', '')}</webMaster>
    <managingEditor>admin@${siteUrl.replace('https://', '').replace('http://', '')}</managingEditor>
    <copyright>Copyright © ${new Date().getFullYear()} ${siteTitle}</copyright>
    <ttl>60</ttl>

    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content?.substring(0, 200) + '...' || ''}]]></description>
      <link>${siteUrl}/blog/${post.slug || post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug || post.id}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date(post.createdAt).toUTCString()}</pubDate>
      <author><![CDATA[${post.author?.name || 'Anonymous'}]]></author>
      <category><![CDATA[${post.category?.name || 'Uncategorized'}]]></category>
      <content:encoded><![CDATA[${post.content || post.excerpt || ''}]]></content:encoded>
    </item>
    `).join('')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
      },
    });

  } catch (error) {
    console.error('RSS generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    );
  }
}
