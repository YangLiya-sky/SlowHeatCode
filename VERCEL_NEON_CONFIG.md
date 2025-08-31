# Vercel Neon PostgreSQL 配置指南

## 🎯 根据官方文档配置

基于 Vercel Neon 集成文档：https://vercel.com/docs/storage/vercel-postgres

## 🔧 Vercel 环境变量配置

### 在 Vercel 控制台中设置以下环境变量：

```bash
# 数据库连接（Vercel 自动提供）
DATABASE_URL = $POSTGRES_PRISMA_URL
DIRECT_URL = $POSTGRES_URL_NON_POOLING

# NextAuth.js 配置
NEXTAUTH_SECRET = sqd1Ui+YJKMq0KTD5ws478KUi+04XRe70MRAwKmVR9s=
NEXTAUTH_URL = https://slow-heat-code.vercel.app

# 应用配置
SETUP_KEY = admin-setup-2025
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

## 📋 Vercel 自动提供的环境变量

当您在 Vercel 中连接 Neon 数据库时，以下变量会自动创建：

- `POSTGRES_PRISMA_URL` - 优化的连接池URL
- `POSTGRES_URL_NON_POOLING` - 直接连接URL（用于迁移）
- `POSTGRES_URL` - 标准连接URL
- `POSTGRES_DATABASE` - 数据库名称
- `POSTGRES_HOST` - 数据库主机
- `POSTGRES_PASSWORD` - 数据库密码
- `POSTGRES_USER` - 数据库用户名

## ⚙️ Prisma Schema 配置

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 🚀 部署步骤

### 1. 在 Vercel 中连接 Neon
1. 进入 Vercel 项目设置
2. 选择 "Storage" 标签
3. 点击 "Connect Store"
4. 选择 "Neon" 并连接您的数据库

### 2. 设置环境变量
在 Vercel 项目设置 > Environment Variables 中添加：
```
DATABASE_URL = $POSTGRES_PRISMA_URL
DIRECT_URL = $POSTGRES_URL_NON_POOLING
NEXTAUTH_SECRET = sqd1Ui+YJKMq0KTD5ws478KUi+04XRe70MRAwKmVR9s=
NEXTAUTH_URL = https://slow-heat-code.vercel.app
SETUP_KEY = admin-setup-2025
NODE_ENV = production
```

### 3. 部署项目
```bash
git push origin main
```

## 🧪 测试配置

### 本地测试
```bash
npm run build
npm run start
```

### 生产环境测试
访问以下端点验证配置：

1. **健康检查**：
   ```
   https://slow-heat-code.vercel.app/api/health
   ```

2. **Setup 状态**：
   ```
   https://slow-heat-code.vercel.app/api/setup/status
   ```

3. **Setup 页面**：
   ```
   https://slow-heat-code.vercel.app/setup
   ```

## 🔍 故障排除

### 常见问题

#### 1. 数据库连接失败
- 检查 Neon 数据库是否正常运行
- 验证环境变量是否正确设置
- 确认 Vercel 项目已连接到 Neon

#### 2. 表不存在错误
```bash
# 推送数据库 schema
npx prisma db push
```

#### 3. 环境变量未找到
- 确保在 Vercel 控制台中正确设置了所有环境变量
- 检查变量名称是否完全匹配
- 重新部署项目以应用新的环境变量

## 📊 性能优化

### 连接池配置
Vercel 自动提供优化的连接池：
- `POSTGRES_PRISMA_URL` - 包含连接池优化
- `POSTGRES_URL_NON_POOLING` - 直接连接，用于迁移

### 推荐配置
- **生产环境**：使用 `POSTGRES_PRISMA_URL`
- **迁移操作**：使用 `POSTGRES_URL_NON_POOLING`
- **开发环境**：可以使用直接连接进行调试

## 🔐 安全最佳实践

1. **环境变量管理**：
   - 使用 Vercel 环境变量，不要硬编码敏感信息
   - 为不同环境（开发、预览、生产）设置不同的值

2. **数据库安全**：
   - 启用 SSL 连接（`sslmode=require`）
   - 定期轮换数据库密码
   - 限制数据库访问权限

3. **应用安全**：
   - 使用强随机的 `NEXTAUTH_SECRET`
   - 设置复杂的 `SETUP_KEY`
   - 启用 HTTPS（Vercel 自动提供）

## ✅ 验证清单

部署前请确认：

- [ ] Vercel 项目已连接到 Neon 数据库
- [ ] 所有必需的环境变量已设置
- [ ] 数据库 schema 已推送
- [ ] 本地构建测试通过
- [ ] 健康检查端点正常响应
- [ ] Setup 页面可以正常访问

完成这些步骤后，您的应用就可以在 Vercel 上正常运行了！
