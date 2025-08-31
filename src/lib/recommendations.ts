import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

// 使用 Prisma 生成的类型，包含所需的关系
type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    tags: {
      include: {
        tag: {
          select: {
            id: true;
            name: true;
            slug: true;
          };
        };
      };
    };
    author: {
      select: {
        id: true;
        name: true;
        username: true;
      };
    };
  };
}>;

interface RecommendationScore {
  postId: string;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  // 获取相关文章推荐
  static async getRelatedPosts(currentPostId: string, limit: number = 3): Promise<any[]> {
    try {
      // 获取当前文章信息
      const currentPost = await prisma.post.findUnique({
        where: { id: currentPostId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      });

      if (!currentPost) {
        return [];
      }

      // 获取所有其他已发布文章
      const allPosts = await prisma.post.findMany({
        where: {
          AND: [
            { id: { not: currentPostId } },
            { status: 'PUBLISHED' }
          ]
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // 计算相关性分数
      const recommendations = this.calculateRecommendationScores(currentPost, allPosts);

      // 排序并返回前N个
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(rec => {
          const post = allPosts.find(p => p.id === rec.postId) as any;
          return {
            ...post,
            tags: post?.tags?.map((pt: any) => pt.tag) || [],
            recommendationScore: rec.score,
            recommendationReasons: rec.reasons
          };
        });
    } catch (error) {
      console.error('Get related posts error:', error);
      return [];
    }
  }

  // 计算推荐分数
  private static calculateRecommendationScores(currentPost: any, allPosts: any[]): RecommendationScore[] {
    const currentTags = currentPost.tags?.map((pt: any) => pt.tag.id) || [];
    const currentCategoryId = currentPost.categoryId;

    return allPosts.map(post => {
      let score = 0;
      const reasons: string[] = [];

      // 1. 相同分类 (+30分)
      if (post.categoryId && post.categoryId === currentCategoryId) {
        score += 30;
        reasons.push('相同分类');
      }

      // 2. 共同标签 (每个共同标签 +20分)
      const postTags = post.tags?.map((pt: any) => pt.tag?.id) || [];
      const commonTags = currentTags.filter((tagId: string) => postTags.includes(tagId));
      if (commonTags.length > 0) {
        score += commonTags.length * 20;
        reasons.push(`${commonTags.length}个共同标签`);
      }

      // 3. 热门程度 (基于浏览量和点赞数)
      const popularityScore = Math.min((post.views || 0) * 0.1 + (post.likes || 0) * 2, 20);
      score += popularityScore;
      if (popularityScore > 10) {
        reasons.push('热门文章');
      }

      // 4. 时间新鲜度 (越新的文章分数越高，最多+15分)
      const daysSincePublished = Math.floor(
        (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const freshnessScore = Math.max(15 - daysSincePublished * 0.5, 0);
      score += freshnessScore;
      if (freshnessScore > 10) {
        reasons.push('最新文章');
      }

      // 5. 标题相似度 (简单的关键词匹配)
      const titleSimilarity = this.calculateTitleSimilarity(currentPost.title, post.title);
      score += titleSimilarity * 10;
      if (titleSimilarity > 0.3) {
        reasons.push('标题相关');
      }

      return {
        postId: post.id,
        score: Math.round(score),
        reasons
      };
    });
  }

  // 计算标题相似度
  private static calculateTitleSimilarity(title1: string, title2: string): number {
    const words1 = this.extractKeywords(title1);
    const words2 = this.extractKeywords(title2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  // 提取关键词
  private static extractKeywords(text: string): string[] {
    // 移除标点符号，转换为小写，分割成词
    const words = text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);

    // 过滤常见停用词
    const stopWords = ['的', '是', '在', '和', '与', '或', '但', '如果', '因为', '所以', '这', '那', '一个', '一些'];
    return words.filter(word => !stopWords.includes(word));
  }

  // 获取热门文章推荐
  static async getPopularPosts(limit: number = 5): Promise<any[]> {
    try {
      return await prisma.post.findMany({
        where: {
          status: 'PUBLISHED'
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        },
        orderBy: [
          { views: 'desc' },
          { likes: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });
    } catch (error) {
      console.error('Get popular posts error:', error);
      return [];
    }
  }

  // 获取最新文章推荐
  static async getLatestPosts(limit: number = 5): Promise<any[]> {
    try {
      return await prisma.post.findMany({
        where: {
          status: 'PUBLISHED'
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });
    } catch (error) {
      console.error('Get latest posts error:', error);
      return [];
    }
  }
}
