import { PrismaClient, PostStatus, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据...');

  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vibe.com' },
    update: {},
    create: {
      email: 'admin@vibe.com',
      username: 'admin',
      name: '管理员',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('创建管理员用户:', admin.email);

  // 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: '技术',
        slug: 'technology',
        description: '技术相关文章',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'life' },
      update: {},
      create: {
        name: '生活',
        slug: 'life',
        description: '生活感悟和随笔',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: '教程',
        slug: 'tutorial',
        description: '技术教程和指南',
      },
    }),
  ]);

  console.log('创建分类:', categories.map(c => c.name));

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: { name: 'JavaScript', slug: 'javascript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'css' },
      update: {},
      create: { name: 'CSS', slug: 'css' },
    }),
  ]);

  console.log('创建标签:', tags.map(t => t.name));

  // 创建示例文章
  const posts = [
    {
      title: 'Next.js 15 新特性详解',
      slug: 'nextjs-15-new-features',
      excerpt: 'Next.js 15 带来了许多令人兴奋的新特性，包括React 19支持、改进的性能和新的API。',
      content: `# Next.js 15 新特性详解

Next.js 15 是一个重大更新，带来了许多令人兴奋的新特性和改进。

## 主要特性

### 1. React 19 支持
Next.js 15 完全支持 React 19，包括新的并发特性和服务器组件改进。

### 2. 性能优化
- 更快的构建时间
- 改进的热重载
- 优化的包大小

### 3. 新的 API
- 改进的 App Router
- 新的缓存策略
- 更好的 TypeScript 支持

## 总结
Next.js 15 是一个值得升级的版本，为开发者带来了更好的开发体验。`,
      categoryId: categories[0].id,
      authorId: admin.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
    },
    {
      title: '现代化前端开发最佳实践',
      slug: 'modern-frontend-best-practices',
      excerpt: '探讨现代前端开发中的最佳实践，包括代码组织、性能优化和用户体验设计。',
      content: `# 现代化前端开发最佳实践

在快速发展的前端生态系统中，遵循最佳实践对于构建高质量的应用程序至关重要。

## 代码组织

### 1. 模块化设计
- 使用 ES6 模块
- 合理的文件结构
- 组件化开发

### 2. 类型安全
- TypeScript 的使用
- 严格的类型检查
- 接口定义

## 性能优化

### 1. 代码分割
- 动态导入
- 路由级别的分割
- 组件懒加载

### 2. 缓存策略
- 浏览器缓存
- CDN 缓存
- 服务端缓存

## 用户体验

### 1. 响应式设计
- 移动优先
- 灵活的布局
- 适配不同设备

### 2. 性能监控
- 核心 Web 指标
- 错误监控
- 用户行为分析

## 总结
现代前端开发需要综合考虑多个方面，持续学习和实践是关键。`,
      categoryId: categories[0].id,
      authorId: admin.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    },
    {
      title: 'TypeScript 高级技巧与模式',
      slug: 'typescript-advanced-tips',
      excerpt: 'TypeScript 的高级用法和设计模式，帮助你写出更优雅和类型安全的代码。',
      content: `# TypeScript 高级技巧与模式

TypeScript 不仅仅是 JavaScript 的超集，它还提供了强大的类型系统和高级特性。

## 高级类型

### 1. 条件类型
\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;
\`\`\`

### 2. 映射类型
\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

### 3. 模板字面量类型
\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
\`\`\`

## 设计模式

### 1. 工厂模式
使用 TypeScript 的类型系统实现类型安全的工厂模式。

### 2. 装饰器模式
利用 TypeScript 装饰器实现横切关注点。

### 3. 观察者模式
类型安全的事件系统实现。

## 最佳实践

### 1. 严格模式
启用所有严格检查选项。

### 2. 类型守卫
使用类型守卫确保运行时类型安全。

### 3. 泛型约束
合理使用泛型约束提高代码可读性。

## 总结
掌握 TypeScript 的高级特性可以显著提高代码质量和开发效率。`,
      categoryId: categories[2].id,
      authorId: admin.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });
    console.log('创建文章:', post.title);

    // 为文章添加标签
    if (postData.slug === 'nextjs-15-new-features') {
      await prisma.postTag.createMany({
        data: [
          { postId: post.id, tagId: tags[1].id }, // Next.js
          { postId: post.id, tagId: tags[0].id }, // React
        ],
      });
    } else if (postData.slug === 'modern-frontend-best-practices') {
      await prisma.postTag.createMany({
        data: [
          { postId: post.id, tagId: tags[3].id }, // JavaScript
          { postId: post.id, tagId: tags[4].id }, // CSS
        ],
      });
    } else if (postData.slug === 'typescript-advanced-tips') {
      await prisma.postTag.createMany({
        data: [
          { postId: post.id, tagId: tags[2].id }, // TypeScript
          { postId: post.id, tagId: tags[3].id }, // JavaScript
        ],
      });
    }
  }

  // 创建示例项目
  const projects = [
    {
      title: 'Vibe 博客系统',
      slug: 'vibe-blog-system',
      description: '基于 Next.js 15 和 React 19 的现代化博客系统',
      content: `# Vibe 博客系统

一个功能完整的现代化博客系统，采用最新的技术栈构建。

## 技术特性

- Next.js 15 + React 19
- TypeScript 全栈开发
- Prisma ORM + PostgreSQL
- Material-UI + Tailwind CSS
- 玻璃拟态设计风格

## 核心功能

- 完整的管理后台
- 响应式前台展示
- 实时数据同步
- 评论系统
- RSS 订阅
- SEO 优化

## 部署方式

支持 Vercel、Netlify 等平台一键部署。`,
      technologies: 'Next.js,React,TypeScript,Prisma,PostgreSQL,Material-UI,Tailwind CSS',
      category: 'Web应用',
      githubUrl: 'https://github.com/YangLiya-sky/SlowHeatCode',
      liveUrl: 'https://vibe-blog.vercel.app',
      status: ProjectStatus.COMPLETED,
      featured: true,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
      endDate: new Date(),
      authorId: admin.id,
    },
    {
      title: 'React 组件库',
      slug: 'react-component-library',
      description: '企业级 React 组件库，提供丰富的 UI 组件',
      content: `# React 组件库

一个企业级的 React 组件库，提供丰富的 UI 组件和工具函数。

## 组件特性

- TypeScript 支持
- 主题定制
- 响应式设计
- 无障碍访问
- 单元测试覆盖

## 包含组件

- 基础组件：Button、Input、Select 等
- 布局组件：Grid、Layout、Container 等
- 数据展示：Table、List、Card 等
- 反馈组件：Modal、Toast、Loading 等

## 使用方式

\`\`\`bash
npm install @company/react-components
\`\`\``,
      technologies: 'React,TypeScript,Storybook,Jest,Rollup',
      category: '组件库',
      githubUrl: 'https://github.com/example/react-components',
      status: ProjectStatus.ACTIVE,
      featured: true,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60天前
      authorId: admin.id,
    },
  ];

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: projectData,
    });
    console.log('创建项目:', project.title);
  }

  // 创建系统设置
  const settings = [
    { key: 'site_title', value: 'Vibe Blog', type: 'TEXT' },
    { key: 'site_description', value: '现代化玻璃拟态博客系统', type: 'TEXT' },
    { key: 'site_url', value: 'http://localhost:3000', type: 'TEXT' },
    { key: 'site_keywords', value: 'blog,技术,前端,React,Next.js', type: 'TEXT' },
    { key: 'author_name', value: '杨立雅', type: 'TEXT' },
    { key: 'author_email', value: 'admin@vibe.com', type: 'TEXT' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('创建系统设置完成');
  console.log('数据库种子数据创建完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
