# Vercel部署修复指南

## 🚀 修复的问题

### 1. 数据库连接问题
- ✅ 修复了Prisma客户端配置
- ✅ 增强了数据库连接错误处理
- ✅ 添加了详细的日志记录

### 2. Setup页面错误
- ✅ 增强了setup API的错误处理
- ✅ 添加了数据库连接测试
- ✅ 改进了错误信息显示

### 3. 环境变量配置
- ✅ 修复了DIRECT_URL配置
- ✅ 优化了生产环境配置

## 🔧 Vercel环境变量配置

在Vercel控制台中设置以下环境变量：

### 必需的环境变量：
```
DATABASE_URL = $STORAGE_POSTGRES_PRISMA_URL
DIRECT_URL = $STORAGE_POSTGRES_URL_NON_POOLING
NEXTAUTH_SECRET = sqd1Ui+YJKMq0KTD5ws478KUi+04XRe70MRAwKmVR9s=
NEXTAUTH_URL = https://slow-heat-code.vercel.app
SETUP_KEY = admin-setup-2025
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

### Vercel自动提供的变量：
- `STORAGE_POSTGRES_PRISMA_URL` - Prisma优化的连接URL
- `STORAGE_POSTGRES_URL_NON_POOLING` - 直接连接URL（用于迁移）

## 📋 部署检查清单

### 1. 环境变量检查
- [ ] DATABASE_URL 已设置
- [ ] DIRECT_URL 已设置
- [ ] NEXTAUTH_SECRET 已设置
- [ ] NEXTAUTH_URL 已设置为正确的域名
- [ ] SETUP_KEY 已设置

### 2. 数据库检查
- [ ] Neon数据库正常运行
- [ ] 数据库表已创建（运行 `npx prisma db push`）
- [ ] 数据库连接权限正确

### 3. 功能测试
- [ ] 访问 `/api/health` 检查健康状态
- [ ] 访问 `/api/setup/status` 检查setup状态
- [ ] 访问 `/setup` 页面测试管理员创建

## 🔍 故障排除

### Setup页面错误
如果setup页面显示错误：

1. **检查数据库连接**：
   ```
   访问：https://slow-heat-code.vercel.app/api/health
   ```

2. **检查setup状态**：
   ```
   访问：https://slow-heat-code.vercel.app/api/setup/status
   ```

3. **查看Vercel日志**：
   - 在Vercel控制台查看Function Logs
   - 查找数据库连接错误或环境变量问题

### 常见错误解决

#### "表不存在"错误
```bash
# 在本地运行数据库迁移
npx prisma db push
```

#### "环境变量未设置"错误
- 检查Vercel环境变量配置
- 确保所有必需变量都已设置
- 重新部署项目

#### "数据库连接失败"错误
- 检查Neon数据库状态
- 验证连接字符串格式
- 确认数据库权限设置

## 🎯 测试步骤

### 1. 健康检查
```
GET https://slow-heat-code.vercel.app/api/health
```
预期响应：
```json
{
  "status": "healthy",
  "database": "connected",
  "tables": {
    "users": 0,
    "posts": 0
  }
}
```

### 2. Setup状态检查
```
GET https://slow-heat-code.vercel.app/api/setup/status
```
预期响应：
```json
{
  "hasAdmin": false,
  "adminCount": 0
}
```

### 3. 创建管理员
```
POST https://slow-heat-code.vercel.app/api/setup/admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "username": "admin",
  "password": "password123",
  "setupKey": "admin-setup-2025"
}
```

## 🚀 部署命令

```bash
# 本地测试
npm run build
npm run start

# 部署到Vercel
vercel --prod
```

## 📞 支持

如果仍有问题：
1. 检查Vercel Function Logs
2. 验证所有环境变量
3. 测试数据库连接
4. 查看本文档的故障排除部分
