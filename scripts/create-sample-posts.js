const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSamplePosts() {
  try {
    console.log('开始创建示例文章...');

    // 获取管理员用户
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      console.error('未找到管理员用户，请先创建管理员账户');
      return;
    }

    // 获取分类
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();

    const samplePosts = [
      {
        title: '玻璃拟态设计：当界面开始呼吸半透明之美',
        slug: 'glassmorphism-design-trend',
        excerpt: '探索玻璃拟态设计的魅力，了解如何在现代Web界面中实现这种优雅的视觉效果。',
        content: `# 玻璃拟态设计：当界面开始呼吸半透明之美

玻璃拟态（Glassmorphism）是近年来备受关注的设计趋势，它通过半透明效果、模糊背景和精致的边框，创造出如玻璃般的视觉效果。

## 什么是玻璃拟态设计？

玻璃拟态设计是一种视觉设计风格，其特点包括：

- **半透明背景**：使用透明度创建层次感
- **背景模糊**：通过backdrop-filter实现毛玻璃效果
- **精致边框**：使用细腻的边框增强玻璃质感
- **柔和阴影**：创造浮动效果

## 技术实现

在CSS中，我们可以这样实现玻璃拟态效果：

\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
\`\`\`

## 设计原则

1. **层次分明**：合理使用透明度创建视觉层次
2. **色彩和谐**：选择协调的背景色彩
3. **适度使用**：避免过度使用造成视觉疲劳

玻璃拟态设计为现代界面带来了优雅和现代感，是值得掌握的设计技巧。`,
        status: 'PUBLISHED',
        featured: true,
        categoryId: categories.find(c => c.name === '技术分享')?.id,
        tags: ['CSS', 'JavaScript', '前端开发', '设计模式']
      },
      {
        title: 'React 18 新特性详解：并发渲染的革命',
        slug: 'react-18-new-features',
        excerpt: 'React 18 带来了并发渲染、自动批处理等重要特性，让我们深入了解这些变化。',
        content: `# React 18 新特性详解：并发渲染的革命

React 18 是一个重要的版本更新，引入了许多激动人心的新特性，其中最重要的是并发渲染。

## 主要新特性

### 1. 并发渲染（Concurrent Rendering）

并发渲染允许React在渲染过程中暂停和恢复工作，提高应用的响应性。

\`\`\`jsx
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
\`\`\`

### 2. 自动批处理（Automatic Batching）

React 18 会自动批处理所有状态更新，包括Promise、setTimeout等异步操作中的更新。

\`\`\`jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // React 18 会自动批处理这些更新
    setCount(c => c + 1);
    setFlag(f => !f);
  }
}
\`\`\`

### 3. Suspense 改进

Suspense 现在支持服务端渲染，并且可以更好地处理数据获取。

\`\`\`jsx
<Suspense fallback={<Loading />}>
  <ProfilePage />
</Suspense>
\`\`\`

## 迁移指南

从React 17升级到React 18相对简单：

1. 更新依赖
2. 使用新的createRoot API
3. 测试应用行为

React 18 为现代React应用开发带来了更好的性能和用户体验。`,
        status: 'PUBLISHED',
        featured: true,
        categoryId: categories.find(c => c.name === '技术分享')?.id,
        tags: ['React', 'JavaScript', '前端开发']
      },
      {
        title: 'TypeScript 最佳实践：类型安全的艺术',
        slug: 'typescript-best-practices',
        excerpt: '掌握TypeScript的最佳实践，编写更安全、更可维护的代码。',
        content: `# TypeScript 最佳实践：类型安全的艺术

TypeScript 为JavaScript带来了静态类型检查，让我们能够编写更安全、更可维护的代码。

## 核心原则

### 1. 严格模式配置

在tsconfig.json中启用严格模式：

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

### 2. 合理使用类型

\`\`\`typescript
// 好的做法
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// 避免使用any
function processUser(user: User): string {
  return \`Hello, \${user.name}\`;
}
\`\`\`

### 3. 泛型的使用

\`\`\`typescript
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const numbers = createArray(3, 0); // number[]
const strings = createArray(3, ''); // string[]
\`\`\`

## 高级技巧

### 1. 条件类型

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };
\`\`\`

### 2. 映射类型

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

TypeScript 不仅提供了类型安全，还能提高开发效率和代码质量。`,
        status: 'PUBLISHED',
        featured: false,
        categoryId: categories.find(c => c.name === '技术分享')?.id,
        tags: ['TypeScript', 'JavaScript', '前端开发', '最佳实践']
      },
      {
        title: 'Next.js 全栈开发实战：从零到部署',
        slug: 'nextjs-fullstack-development',
        excerpt: '使用Next.js构建现代全栈应用，包括SSR、API路由和部署策略。',
        content: `# Next.js 全栈开发实战：从零到部署

Next.js 是一个强大的React框架，提供了服务端渲染、API路由等功能，让我们能够构建完整的全栈应用。

## 项目结构

\`\`\`
my-app/
├── pages/
│   ├── api/
│   ├── _app.js
│   └── index.js
├── components/
├── styles/
└── public/
\`\`\`

## 核心特性

### 1. 服务端渲染（SSR）

\`\`\`jsx
export async function getServerSideProps(context) {
  const data = await fetchData();
  
  return {
    props: {
      data
    }
  };
}
\`\`\`

### 2. API路由

\`\`\`javascript
// pages/api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ users: [] });
  }
}
\`\`\`

### 3. 静态生成（SSG）

\`\`\`jsx
export async function getStaticProps() {
  const posts = await getPosts();
  
  return {
    props: {
      posts
    },
    revalidate: 60 // ISR
  };
}
\`\`\`

## 性能优化

1. **图片优化**：使用next/image组件
2. **代码分割**：自动代码分割
3. **预加载**：Link组件的预加载功能

Next.js 为现代Web开发提供了完整的解决方案。`,
        status: 'PUBLISHED',
        featured: false,
        categoryId: categories.find(c => c.name === '项目经验')?.id,
        tags: ['Next.js', 'React', '全栈开发', 'SSR']
      },
      {
        title: '现代CSS布局技术：Grid vs Flexbox',
        slug: 'modern-css-layout-grid-flexbox',
        excerpt: '深入比较CSS Grid和Flexbox，了解何时使用哪种布局技术。',
        content: `# 现代CSS布局技术：Grid vs Flexbox

CSS Grid和Flexbox是现代Web布局的两大利器，了解它们的特点和使用场景对前端开发至关重要。

## Flexbox：一维布局的王者

Flexbox适用于一维布局（行或列）：

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

### 主要特性

- **主轴和交叉轴**：灵活的方向控制
- **弹性增长**：flex-grow, flex-shrink
- **对齐控制**：justify-content, align-items

## CSS Grid：二维布局的专家

Grid适用于二维布局（行和列）：

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
\`\`\`

### 主要特性

- **网格线**：精确的位置控制
- **网格区域**：命名区域布局
- **响应式**：minmax(), auto-fit

## 选择指南

| 场景 | 推荐 | 原因 |
|------|------|------|
| 导航栏 | Flexbox | 一维排列 |
| 卡片布局 | Grid | 二维网格 |
| 居中对齐 | Flexbox | 简单直接 |
| 复杂布局 | Grid | 精确控制 |

## 实际应用

\`\`\`css
/* 响应式卡片布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* 弹性导航 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

掌握这两种布局技术，能让我们应对各种布局需求。`,
        status: 'PUBLISHED',
        featured: false,
        categoryId: categories.find(c => c.name === '技术分享')?.id,
        tags: ['CSS', '前端开发', '布局', '响应式设计']
      }
    ];

    for (const postData of samplePosts) {
      const { tags: postTags, ...postInfo } = postData;
      
      // 创建文章
      const post = await prisma.post.create({
        data: {
          ...postInfo,
          authorId: admin.id,
          publishedAt: new Date(),
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 50) + 10
        }
      });

      // 关联标签
      if (postTags && postTags.length > 0) {
        for (const tagName of postTags) {
          const tag = tags.find(t => t.name === tagName);
          if (tag) {
            await prisma.postTag.create({
              data: {
                postId: post.id,
                tagId: tag.id
              }
            });
          }
        }
      }

      console.log(`✓ 创建文章: ${postData.title}`);
    }

    console.log('示例文章创建完成！');
  } catch (error) {
    console.error('创建示例文章失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSamplePosts();
