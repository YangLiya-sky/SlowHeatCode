// 静态数据已迁移到数据库，此文件保留作为类型参考
// 所有文章数据现在通过API从数据库获取

export const staticPosts: any[] = [];

export const staticCategories: any[] = [];

export const staticTags: any[] = [];

// 类型定义保留供参考
export interface PostType {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  views: number;
  likes: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count: {
    comments: number;
  };
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: {
    posts: number;
  };
}

export interface TagType {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}