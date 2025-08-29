# Vercel Setup页面修复指南

## 🚨 当前问题

如果您看到错误：`the URL must start with the protocol 'prisma://' or 'prisma+postgres://'`

这是因为Prisma Accelerate需要特定的URL格式。

## 🔧 解决方案

### 方案1：使用Prisma Accelerate（推荐）

在Vercel环境变量中设置：
```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19KME5YT001VWJTNHFPY1N0T1dyLU8iLCJhcGlfa2V5IjoiMDFLM1Y0WUgzRVlKQlRaOE1SWVhERjhTNFAiLCJ0ZW5hbnRfaWQiOiJhZmYyZjFjN2RkNjQyZjVjMTRmYTUzZTg5ZDE2ODFhNjIyOTIxMTllNmJlNzZmYTNkOTYxODcwZjU2YTk3MWNkIiwiaW50ZXJuYWxfc2VjcmV0IjoiMmJkZDA2NWEtMjNjMy00MDhjLWI2MTAtYmI1YWY0NTBjZDVkIn0.yF4sCx7hO_SGsIXNhHpBPjcfx5D8dY1V8PhazGzQz3Q
```

**注意**：Accelerate需要5-10分钟同步新创建的表。如果setup页面显示"表不存在"错误，这是正常的。

### 方案2：临时使用直接连接

如果急需使用setup功能，可以临时切换：

1. 在Vercel环境变量中修改：
```
DATABASE_URL = $STORAGE_POSTGRES_PRISMA_URL
```

2. 重新部署项目

3. 完成管理员设置后，再切换回Accelerate

## 📋 完整环境变量配置

```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
DIRECT_URL = $STORAGE_POSTGRES_URL_NON_POOLING
NEXTAUTH_SECRET = sqd1Ui+YJKMq0KTD5ws478KUi+04XRe70MRAwKmVR9s=
NEXTAUTH_URL = https://slow-heat-code.vercel.app
SETUP_KEY = admin-setup-2025
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

## 🧪 测试步骤

### 1. 检查健康状态
```
访问：https://slow-heat-code.vercel.app/api/health
```

### 2. 检查setup状态
```
访问：https://slow-heat-code.vercel.app/api/setup/status
```

### 3. 创建管理员
```
访问：https://slow-heat-code.vercel.app/setup
设置密钥：admin-setup-2025
```

## ⚠️ Accelerate同步说明

- **新部署**：Accelerate需要5-10分钟同步数据库表
- **表不存在错误**：这是正常的，等待同步完成
- **临时解决**：可以使用直接连接完成初始设置
- **长期使用**：建议使用Accelerate获得最佳性能

## 🔍 故障排除

### 错误：协议不匹配
- 确保DATABASE_URL使用 `prisma+postgres://` 协议
- 检查API密钥是否正确

### 错误：表不存在
- 等待Accelerate同步（5-10分钟）
- 或临时切换到直接连接

### 错误：环境变量未设置
- 检查所有必需的环境变量
- 确保在Vercel控制台中正确设置

## 🚀 快速修复

如果需要立即使用setup功能：

1. **临时修改环境变量**：
   ```
   DATABASE_URL = $STORAGE_POSTGRES_PRISMA_URL
   ```

2. **重新部署**

3. **完成管理员设置**

4. **切换回Accelerate**：
   ```
   DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=...
   ```

5. **再次部署**

这样可以确保setup功能立即可用，同时保持长期的性能优化。
