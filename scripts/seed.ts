import { PrismaClient, PostStatus, CommentStatus } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据...');

  // 创建管理员用户
  const adminUser = await prisma.user.upsert({
    where: { email: '13617296551@163.com' },
    update: {
      password: await hashPassword('YangLiya02171998'),
    },
    create: {
      email: '13617296551@163.com',
      username: 'admin',
      password: await hashPassword('YangLiya02171998'),
      name: '管理员',
      role: 'ADMIN',
    },
  });

  console.log('管理员用户创建成功:', adminUser.email);

  // 创建分类
  const categories = [
    { name: '前端开发', description: '前端技术相关文章', slug: 'frontend' },
    { name: '后端开发', description: '后端技术相关文章', slug: 'backend' },
    { name: '移动开发', description: '移动应用开发相关文章', slug: 'mobile' },
    { name: '设计', description: 'UI/UX设计相关文章', slug: 'design' },
    { name: '工具', description: '开发工具和效率相关文章', slug: 'tools' }
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    createdCategories.push(category);
    console.log('分类创建成功:', category.name);
  }

  // 创建标签
  const tags = [
    { name: 'React', slug: 'react' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'CSS', slug: 'css' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'Python', slug: 'python' },
    { name: 'Vue.js', slug: 'vuejs' },
    { name: 'Angular', slug: 'angular' },
    { name: 'Docker', slug: 'docker' },
    { name: 'AWS', slug: 'aws' },
    { name: 'MongoDB', slug: 'mongodb' }
  ];

  const createdTags = [];
  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData,
    });
    createdTags.push(tag);
    console.log('标签创建成功:', tag.name);
  }

  // 创建网站设置
  const settings = [
    { key: 'site_title', value: 'Vibe - 个人博客', type: 'string' },
    { key: 'site_subtitle', value: '分享技术见解和开发经验', type: 'string' },
    { key: 'site_description', value: '这是一个专注于前端开发、技术分享的个人博客，记录学习过程中的心得体会和技术实践。', type: 'string' },
    { key: 'contact_email', value: '13617296551@163.com', type: 'string' },
    { key: 'github_url', value: 'https://github.com/username', type: 'string' },
    { key: 'enable_comments', value: 'true', type: 'boolean' },
    { key: 'enable_analytics', value: 'true', type: 'boolean' },
    { key: 'comment_moderation', value: 'true', type: 'boolean' },
    { key: 'auto_backup', value: 'false', type: 'boolean' },
    { key: 'seo_optimization', value: 'true', type: 'boolean' }
  ];

  for (const settingData of settings) {
    const setting = await prisma.setting.upsert({
      where: { key: settingData.key },
      update: { value: settingData.value },
      create: settingData,
    });
    console.log('设置创建成功:', setting.key);
  }

  // 创建示例文章
  const posts = [
    {
      title: '玻璃拟态设计趋势探索',
      slug: 'glassmorphism-design-trends',
      excerpt: '深入探讨玻璃拟态设计在现代Web开发中的应用和最佳实践，包括设计原理、实现技巧和用户体验考量。',
      content: `# 玻璃拟态设计趋势探索

玻璃拟态（Glassmorphism）是近年来备受关注的设计趋势，它通过模拟玻璃的视觉效果，创造出既现代又优雅的用户界面。

## 什么是玻璃拟态设计？

玻璃拟态设计是一种视觉设计风格，其特点包括：

- **半透明背景**：使用透明度创造层次感
- **背景模糊**：通过backdrop-filter实现毛玻璃效果
- **细腻边框**：使用微妙的边框增强玻璃质感
- **柔和阴影**：营造浮动感和深度

## 技术实现

### CSS实现方式

\`\`\`css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
\`\`\`

## 设计原则

玻璃拟态设计依赖于清晰的层次结构和适当的对比度，确保在美观的同时保持良好的可用性。`,
      status: PostStatus.PUBLISHED,
      featured: true,
      categoryId: createdCategories.find(c => c.slug === 'design')?.id,
      tagSlugs: ['css', 'react'],
      publishedAt: new Date('2024-01-15'),
      authorId: adminUser.id,
    },
    {
      title: 'React 18 新特性详解',
      slug: 'react-18-new-features',
      excerpt: '全面解析React 18的并发特性、Suspense改进和新的Hooks，以及如何在实际项目中应用这些新功能。',
      content: `# React 18 新特性详解

React 18 引入了许多激动人心的新特性，这些特性将显著改善用户体验和开发者体验。

## 并发特性

React 18 的最大亮点是并发特性的引入，它允许 React 在渲染过程中被中断，从而提高应用的响应性。

### 自动批处理

React 18 扩展了批处理的范围，现在在 Promise、setTimeout 和原生事件处理程序中的更新也会被自动批处理。

\`\`\`javascript
// React 18 中，这些更新会被批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会重新渲染一次
}, 1000);
\`\`\`

## Suspense 改进

React 18 对 Suspense 进行了重大改进，现在支持服务端渲染和并发特性。

## 新的 Hooks

### useId

\`\`\`javascript
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>选择我</label>
      <input id={id} type="checkbox" />
    </>
  );
}
\`\`\`

这些新特性让 React 应用更加高效和用户友好。`,
      status: PostStatus.PUBLISHED,
      featured: true,
      categoryId: createdCategories.find(c => c.slug === 'frontend')?.id,
      tagSlugs: ['react', 'javascript'],
      publishedAt: new Date('2024-01-10'),
      authorId: adminUser.id,
    },
    {
      title: 'TypeScript 最佳实践',
      slug: 'typescript-best-practices',
      excerpt: '分享在大型项目中使用TypeScript的经验和技巧，包括类型设计、代码组织和性能优化。',
      content: `# TypeScript 最佳实践

TypeScript 为 JavaScript 带来了静态类型检查，在大型项目中能够显著提高代码质量和开发效率。

## 类型设计原则

### 1. 优先使用接口而非类型别名

\`\`\`typescript
// 推荐
interface User {
  id: string;
  name: string;
  email: string;
}

// 避免（除非需要联合类型）
type User = {
  id: string;
  name: string;
  email: string;
}
\`\`\`

### 2. 使用严格的类型检查

在 tsconfig.json 中启用严格模式：

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## 代码组织

### 模块化类型定义

将类型定义组织在单独的文件中，便于维护和重用：

\`\`\`typescript
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
\`\`\`

## 性能优化

### 使用 const assertions

\`\`\`typescript
const themes = ['light', 'dark'] as const;
type Theme = typeof themes[number]; // 'light' | 'dark'
\`\`\`

这些实践能帮助你构建更健壮、可维护的 TypeScript 应用。`,
      status: PostStatus.PUBLISHED,
      featured: false,
      categoryId: createdCategories.find(c => c.slug === 'frontend')?.id,
      tagSlugs: ['typescript', 'javascript'],
      publishedAt: new Date('2024-01-05'),
      authorId: adminUser.id,
    },
    {
      title: 'Next.js 性能优化指南',
      slug: 'nextjs-performance-optimization',
      excerpt: '详细介绍Next.js应用的性能优化策略，包括代码分割、图片优化、缓存策略等实用技巧。',
      content: `# Next.js 性能优化指南

Next.js 提供了许多内置的性能优化功能，合理使用这些功能可以显著提升应用性能。

## 代码分割

### 动态导入

\`\`\`javascript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
\`\`\`

### 路由级别的代码分割

Next.js 自动为每个页面进行代码分割，但你也可以进一步优化：

\`\`\`javascript
// pages/dashboard.js
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('../components/Chart'), {
  ssr: false, // 禁用服务端渲染
});
\`\`\`

## 图片优化

使用 Next.js 的 Image 组件：

\`\`\`javascript
import Image from 'next/image';

function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={500}
      priority // 优先加载
    />
  );
}
\`\`\`

## 缓存策略

### 静态生成 (SSG)

\`\`\`javascript
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: { data },
    revalidate: 60, // 60秒后重新生成
  };
}
\`\`\`

### 增量静态再生 (ISR)

ISR 允许你在构建时生成静态页面，并在运行时按需更新：

\`\`\`javascript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 1, // 每秒最多重新生成一次
  };
}
\`\`\`

通过这些优化策略，你的 Next.js 应用将获得更好的性能表现。`,
      status: PostStatus.PUBLISHED,
      featured: false,
      categoryId: createdCategories.find(c => c.slug === 'frontend')?.id,
      tagSlugs: ['nextjs', 'react'],
      publishedAt: new Date('2023-12-28'),
      authorId: adminUser.id,
    },
  ];

  for (const postData of posts) {
    const { tagSlugs, ...postCreateData } = postData;

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postCreateData,
    });

    // 创建文章标签关联
    if (tagSlugs && tagSlugs.length > 0) {
      for (const tagSlug of tagSlugs) {
        const tag = createdTags.find(t => t.slug === tagSlug);
        if (tag) {
          await prisma.postTag.upsert({
            where: {
              postId_tagId: {
                postId: post.id,
                tagId: tag.id,
              },
            },
            update: {},
            create: {
              postId: post.id,
              tagId: tag.id,
            },
          });
        }
      }
    }

    console.log('文章创建成功:', post.title);
  }

  // 创建示例评论
  const comments = [
    {
      content: '这篇文章写得很好，学到了很多！',
      status: CommentStatus.APPROVED,
      guestName: '张三',
      guestEmail: 'zhangsan@example.com',
      postId: '', // 将在下面设置
    },
    {
      content: '能否详细介绍一下并发特性的实现原理？',
      status: CommentStatus.PENDING,
      guestName: '李四',
      guestEmail: 'lisi@example.com',
      postId: '', // 将在下面设置
    },
    {
      content: '代码示例很清晰，感谢分享！',
      status: CommentStatus.APPROVED,
      guestName: '王五',
      guestEmail: 'wangwu@example.com',
      postId: '', // 将在下面设置
    },
  ];

  const allPosts = await prisma.post.findMany();
  for (let i = 0; i < comments.length && i < allPosts.length; i++) {
    comments[i].postId = allPosts[i].id;
    const comment = await prisma.comment.create({
      data: comments[i],
    });
    console.log('评论创建成功:', comment.content.substring(0, 20) + '...');
  }

  console.log('数据初始化完成！');
  console.log('管理员登录信息:');
  console.log('邮箱: 13617296551@163.com');
  console.log('密码: YangLiya02171998');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
