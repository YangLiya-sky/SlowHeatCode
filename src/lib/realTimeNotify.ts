import { prisma } from '@/lib/prisma';

// 存储活跃的 SSE 连接
const connections = new Set<ReadableStreamDefaultController>();

// 广播数据到所有连接
export function broadcastToClients(eventType: string, data: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;

  connections.forEach(controller => {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      // 连接已关闭，从集合中移除
      connections.delete(controller);
    }
  });
}

// 添加连接
export function addConnection(controller: ReadableStreamDefaultController) {
  connections.add(controller);
}

// 移除连接
export function removeConnection(controller: ReadableStreamDefaultController) {
  connections.delete(controller);
}

// 获取最新统计数据
async function getLatestAnalytics() {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
      recentPosts,
      popularPosts,
      categoryStats,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.aggregate({ _sum: { likes: true } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
          createdAt: true,
        },
      }),
      prisma.post.findMany({
        take: 5,
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        select: {
          id: true,
          title: true,
          views: true,
          likes: true,
        },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        }
      }),
    ]);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: thisMonth,
        },
      },
    });

    const avgReadTime = totalViews._sum.views ?
      Math.round((totalViews._sum.views * 4.2) / totalPosts * 100) / 100 : 0;

    return {
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes._sum.likes || 0,
        thisMonthPosts,
        avgReadTime,
      },
      recentPosts,
      popularPosts,
      categoryStats: categoryStats.map(category => ({
        category: category.name,
        count: category._count.posts,
      })),
    };
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return null;
  }
}

// 获取最新媒体数据
async function getLatestMedia() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return media;
  } catch (error) {
    console.error('Failed to get media:', error);
    return null;
  }
}

// 获取最新设置数据
async function getLatestSettings() {
  try {
    const settings = await prisma.setting.findMany();

    // 转换为键值对格式
    const settingsMap = settings.reduce((acc, setting) => {
      let value: any = setting.value;

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

    return settingsMap;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

// 数据更新通知函数（供其他 API 调用）
export async function notifyDataUpdate(type: string, data?: any) {
  let eventData = data;

  // 如果没有提供数据，获取最新数据
  if (!eventData) {
    switch (type) {
      case 'analytics':
        eventData = await getLatestAnalytics();
        break;
      case 'media':
        eventData = await getLatestMedia();
        break;
      case 'settings':
        eventData = await getLatestSettings();
        break;
      default:
        eventData = { type, timestamp: new Date().toISOString() };
    }
  }

  if (eventData) {
    broadcastToClients(`${type}-update`, eventData);
  }
}
