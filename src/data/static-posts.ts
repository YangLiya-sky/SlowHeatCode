export const staticPosts = [
  {
    id: "1",
    title: "现代CSS布局技术：Grid vs Flexbox",
    slug: "modern-css-layout-grid-vs-flexbox",
    excerpt: "深入比较CSS Grid和Flexbox，了解何时使用哪种布局技术。",
    content: `# 现代CSS布局技术：Grid vs Flexbox

CSS Grid和Flexbox是现代Web开发中最重要的布局技术。本文将深入比较这两种技术，帮助你了解何时使用哪种布局方案。

## CSS Grid

CSS Grid是一个二维布局系统，非常适合创建复杂的网格布局。

### 主要特点
- 二维布局（行和列）
- 精确的网格控制
- 适合页面级布局

### 使用场景
- 整体页面布局
- 复杂的网格系统
- 需要精确控制的布局

## Flexbox

Flexbox是一个一维布局系统，专为组件级布局设计。

### 主要特点
- 一维布局（行或列）
- 灵活的空间分配
- 适合组件级布局

### 使用场景
- 导航栏
- 卡片布局
- 居中对齐

## 总结

选择Grid还是Flexbox取决于你的具体需求：
- 复杂布局选择Grid
- 简单组件选择Flexbox
- 两者可以结合使用`,
    status: "PUBLISHED",
    featured: true,
    views: 1250,
    likes: 89,
    publishedAt: "2025-01-28T10:00:00Z",
    createdAt: "2025-01-28T10:00:00Z",
    updatedAt: "2025-01-28T10:00:00Z",
    author: {
      id: "1",
      username: "yangliya",
      name: "杨立雅"
    },
    category: {
      id: "1",
      name: "前端开发",
      slug: "frontend"
    },
    tags: [
      { id: "1", name: "CSS", slug: "css" },
      { id: "2", name: "前端开发", slug: "frontend" }
    ],
    _count: {
      comments: 12
    }
  },
  {
    id: "2",
    title: "Next.js 全栈开发实战：从零到部署",
    slug: "nextjs-fullstack-development",
    excerpt: "使用Next.js构建现代全栈应用，包括SSR、API路由和部署策略。",
    content: `# Next.js 全栈开发实战：从零到部署

Next.js是一个强大的React框架，提供了服务端渲染、API路由等功能，让我们能够构建完整的全栈应用。

## 项目结构

\`\`\`
my-app/
├── app/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
└── public/
\`\`\`

## 核心特性

### 1. App Router
Next.js 13+引入的新路由系统，提供更好的开发体验。

### 2. 服务端渲染（SSR）
\`\`\`tsx
export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
\`\`\`

### 3. API路由
\`\`\`typescript
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}
\`\`\`

## 部署策略

### Vercel部署
1. 连接GitHub仓库
2. 自动检测Next.js项目
3. 一键部署

### 自定义服务器
使用Docker容器化部署到云服务器。

## 总结

Next.js提供了完整的全栈开发解决方案，从开发到部署都有完善的工具链支持。`,
    status: "PUBLISHED",
    featured: false,
    views: 890,
    likes: 67,
    publishedAt: "2025-01-27T14:30:00Z",
    createdAt: "2025-01-27T14:30:00Z",
    updatedAt: "2025-01-27T14:30:00Z",
    author: {
      id: "1",
      username: "yangliya",
      name: "杨立雅"
    },
    category: {
      id: "2",
      name: "全栈开发",
      slug: "fullstack"
    },
    tags: [
      { id: "3", name: "React", slug: "react" },
      { id: "4", name: "Next.js", slug: "nextjs" },
      { id: "5", name: "全栈开发", slug: "fullstack" }
    ],
    _count: {
      comments: 8
    }
  },
  {
    id: "3",
    title: "TypeScript 最佳实践：类型安全的艺术",
    slug: "typescript-best-practices",
    excerpt: "掌握TypeScript的最佳实践，编写更安全、更可维护的代码。",
    content: `# TypeScript 最佳实践：类型安全的艺术

TypeScript为JavaScript带来了静态类型检查，让我们能够编写更安全、更可维护的代码。

## 基础类型定义

### 接口 vs 类型别名
\`\`\`typescript
// 接口 - 推荐用于对象形状
interface User {
  id: string;
  name: string;
  email: string;
}

// 类型别名 - 推荐用于联合类型
type Status = 'loading' | 'success' | 'error';
\`\`\`

### 泛型的使用
\`\`\`typescript
function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    success: true,
    timestamp: Date.now()
  };
}
\`\`\`

## 高级技巧

### 条件类型
\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };
\`\`\`

### 映射类型
\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 最佳实践

1. **严格模式配置**
   - 启用 \`strict: true\`
   - 使用 \`noImplicitAny\`

2. **类型守卫**
   - 使用类型谓词
   - 运行时类型检查

3. **模块化类型**
   - 分离类型定义
   - 使用命名空间

## 总结

TypeScript不仅仅是添加类型，更是一种编程思维的转变。通过合理使用TypeScript的特性，我们可以构建更加健壮的应用程序。`,
    status: "PUBLISHED",
    featured: false,
    views: 756,
    likes: 45,
    publishedAt: "2025-01-26T09:15:00Z",
    createdAt: "2025-01-26T09:15:00Z",
    updatedAt: "2025-01-26T09:15:00Z",
    author: {
      id: "1",
      username: "yangliya",
      name: "杨立雅"
    },
    category: {
      id: "1",
      name: "前端开发",
      slug: "frontend"
    },
    tags: [
      { id: "6", name: "TypeScript", slug: "typescript" },
      { id: "7", name: "JavaScript", slug: "javascript" },
      { id: "2", name: "前端开发", slug: "frontend" }
    ],
    _count: {
      comments: 15
    }
  }
];

export const staticCategories = [
  {
    id: "1",
    name: "前端开发",
    slug: "frontend",
    description: "前端技术、框架和最佳实践",
    _count: { posts: 2 }
  },
  {
    id: "2",
    name: "全栈开发",
    slug: "fullstack", 
    description: "全栈开发技术和架构设计",
    _count: { posts: 1 }
  }
];

export const staticTags = [
  { id: "1", name: "CSS", slug: "css", _count: { posts: 1 } },
  { id: "2", name: "前端开发", slug: "frontend", _count: { posts: 2 } },
  { id: "3", name: "React", slug: "react", _count: { posts: 1 } },
  { id: "4", name: "Next.js", slug: "nextjs", _count: { posts: 1 } },
  { id: "5", name: "全栈开发", slug: "fullstack", _count: { posts: 1 } },
  { id: "6", name: "TypeScript", slug: "typescript", _count: { posts: 1 } },
  { id: "7", name: "JavaScript", slug: "javascript", _count: { posts: 1 } }
];
