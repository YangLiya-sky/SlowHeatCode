# Vercel Neon PostgreSQL 配置指南

## 🗄️ 数据库配置

### 环境变量设置

#### 本地开发 (.env)
```env
# Prisma Accelerate URL（推荐用于生产环境）
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# 直接数据库连接（用于迁移和管理操作）
STORAGE_POSTGRES_URL_NON_POOLING="postgresql://username:password@host/database?sslmode=require"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# 系统设置
SETUP_KEY="admin-setup-2025"
NEXT_TELEMETRY_DISABLED=1
NODE_ENV="development"
```

#### Vercel 生产环境
Vercel会自动提供以下环境变量：
- `STORAGE_POSTGRES_URL_NON_POOLING` - 直接连接URL
- `STORAGE_POSTGRES_PRISMA_URL` - Prisma优化URL
- `NEXTAUTH_URL` - 自动设置为您的域名

## ⚙️ Prisma 配置

### schema.prisma
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("STORAGE_POSTGRES_URL_NON_POOLING")
}

generator client {
  provider = "prisma-client-js"
}
```

## 🚀 部署步骤

### 1. 数据库初始化
```bash
# 推送schema到数据库
npx prisma db push

# 生成Prisma客户端
npx prisma generate --accelerate
```

### 2. 构建项目
```bash
npm run build
```

### 3. 部署到Vercel
```bash
vercel --prod
```

## 🔧 常见问题解决

### Prisma Accelerate连接问题
如果Accelerate有问题，可以临时切换到直接连接：
```env
# 注释掉Accelerate URL
# DATABASE_URL="prisma+postgres://accelerate..."

# 使用直接连接
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

### 表不存在错误
运行以下命令同步数据库：
```bash
npx prisma db push
npx prisma generate
```

## 📊 性能优化

### Prisma Accelerate 优势
- ✅ 全球边缘缓存
- ✅ 连接池优化
- ✅ 查询缓存
- ✅ 减少冷启动时间

### 推荐配置
- 生产环境：使用Prisma Accelerate
- 开发环境：可以使用直接连接进行调试
- 迁移操作：始终使用directUrl

## 🔐 安全注意事项

1. **API密钥安全**：不要在客户端代码中暴露API密钥
2. **环境变量**：使用Vercel环境变量管理敏感信息
3. **连接限制**：Neon有连接数限制，使用连接池
4. **SSL连接**：生产环境始终使用SSL连接
