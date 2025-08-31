# Vibe - 现代化玻璃拟态博客系统

一个基于 Next.js 15 + React 19 的现代化全栈博客系统，采用玻璃拟态设计风格，具备完整的管理后台和前台展示功能。

## ✨ 主要特性

### 🎨 设计特色
- **玻璃拟态UI设计** - 半透明背景、模糊效果、细腻边框
- **响应式布局** - 完美适配桌面端和移动端
- **暗色主题** - 现代化的深色界面设计
- **流畅动画** - 丰富的交互动效和过渡效果

### 🔧 技术架构
- **前端**: Next.js 15 + React 19 + TypeScript
- **UI组件**: Material-UI + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + bcrypt
- **部署**: Vercel + Neon Database

### 📊 核心功能

#### 管理后台
- **仪表板** - 数据统计和概览
- **文章管理** - 创建、编辑、发布文章
- **项目管理** - 项目展示和管理
- **分类管理** - 文章分类组织
- **标签管理** - 标签系统
- **评论管理** - 评论审核和回复
- **媒体库** - 文件上传和管理
- **用户管理** - 用户权限控制
- **系统设置** - 网站配置管理

#### 前台展示
- **首页** - 精选内容展示
- **博客** - 文章列表和详情
- **项目** - 项目作品展示
- **归档** - 按时间浏览文章
- **搜索** - 全站内容搜索
- **关于** - 个人介绍页面
- **联系** - 联系方式和表单

### 🔄 数据同步架构

系统采用完整的数据同步架构，确保前台和后台数据实时同步：

```
管理后台 ←→ 数据库 (Prisma + PostgreSQL) ←→ 前台
                    ↑
            API客户端 + 数据同步Hook
```

#### 核心组件
- **API客户端** (`src/lib/api-client.ts`) - 统一的API请求管理
- **数据同步Hook** (`src/hooks/useDataSync.ts`) - 响应式数据获取
- **公开API端点** - 支持前台数据访问的安全接口

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 数据库
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/YangLiya-sky/SlowHeatCode.git
cd SlowHeatCode
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vibe"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
```

4. **数据库设置**
```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **初始化管理员**
访问 `http://localhost:3000/setup` 创建管理员账户

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   ├── api/               # API路由
│   ├── blog/              # 博客页面
│   ├── projects/          # 项目页面
│   └── ...                # 其他页面
├── components/            # React组件
│   ├── admin/            # 管理后台组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI组件
├── hooks/                # 自定义Hooks
├── lib/                  # 工具库
├── data/                 # 数据文件
└── styles/               # 样式文件
```

## 🔌 API接口

### 公开接口
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/[slug]` - 获取文章详情
- `GET /api/projects` - 获取项目列表
- `GET /api/categories` - 获取分类列表
- `GET /api/tags` - 获取标签列表
- `GET /api/search` - 全站搜索
- `GET /api/archive` - 文章归档
- `GET /api/analytics/public` - 公开统计数据

### 管理接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户
- `POST /api/posts` - 创建文章
- `PUT /api/posts/[id]` - 更新文章
- `DELETE /api/posts/[id]` - 删除文章

## 🎯 核心特性详解

### 数据同步系统
- **实时同步** - 前台自动获取后台最新数据
- **缓存管理** - 智能缓存和状态管理
- **错误处理** - 统一的错误处理机制
- **加载状态** - 优雅的加载状态指示

### 搜索功能
- **全文搜索** - 支持标题、内容、摘要搜索
- **分类搜索** - 按文章、项目、分类、标签搜索
- **搜索历史** - 本地存储搜索记录
- **热门搜索** - 推荐热门搜索词

### 归档系统
- **时间归档** - 按年月浏览文章
- **统计信息** - 显示每个时间段的文章数量
- **筛选功能** - 支持年份和月份筛选

## 🔧 开发指南

### 添加新页面
1. 在 `src/app/` 下创建页面文件
2. 使用数据同步Hook获取数据
3. 应用玻璃拟态样式

### 添加新API
1. 在 `src/app/api/` 下创建路由文件
2. 实现CRUD操作
3. 添加错误处理和验证

### 自定义组件
1. 在 `src/components/` 下创建组件
2. 使用TypeScript类型定义
3. 应用统一的设计系统

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- 作者: 杨立雅
- GitHub: [@YangLiya-sky](https://github.com/YangLiya-sky)
- 项目地址: [SlowHeatCode](https://github.com/YangLiya-sky/SlowHeatCode)

---

⭐ 如果这个项目对你有帮助，请给个星标支持一下！
