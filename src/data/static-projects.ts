// 静态数据已迁移到数据库，此文件保留作为类型参考
// 所有项目数据现在通过API从数据库获取

export const staticProjects: any[] = [];

// 类型定义保留供参考
export interface ProjectType {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string;
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  featured: boolean;
  views: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}