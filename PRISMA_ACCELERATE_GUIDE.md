# Prisma Accelerate 使用指南

## 🚀 什么是Prisma Accelerate？

Prisma Accelerate是一个全球分布式数据库缓存和连接池服务，提供：
- ✅ **全球边缘缓存** - 查询结果在全球边缘节点缓存
- ✅ **连接池优化** - 减少数据库连接开销
- ✅ **查询加速** - 高频查询可获得1000x性能提升
- ✅ **冷启动优化** - 减少serverless函数的冷启动时间

## ⚙️ 当前配置

### 环境变量设置
```env
# Prisma Accelerate URL（已启用）
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# 直接数据库连接（用于迁移）
STORAGE_POSTGRES_URL_NON_POOLING="postgresql://username:password@host/database"
```

### Prisma Schema
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")          # Accelerate URL
  directUrl = env("STORAGE_POSTGRES_URL_NON_POOLING") # 直接连接
}
```

## 🔧 故障排除

### "表不存在"错误
如果遇到 `The table 'public.users' does not exist` 错误：

**原因**：Prisma Accelerate需要时间同步新创建的数据库表

**解决方案**：
1. **等待同步**（推荐）：通常需要5-10分钟
2. **临时切换**：如果急需使用，可以临时切换到直接连接

```env
# 注释掉Accelerate URL
# DATABASE_URL="prisma+postgres://accelerate..."

# 启用直接连接
DATABASE_URL="postgresql://username:password@host/database"
```

3. **重新生成客户端**：
```bash
npx prisma generate
```

### 切换回Accelerate
当确认表已同步后，可以切换回Accelerate：
```env
# 启用Accelerate
DATABASE_URL="prisma+postgres://accelerate..."

# 注释掉直接连接
# DATABASE_URL="postgresql://..."
```

然后重新生成客户端：
```bash
npx prisma generate --accelerate
```

## 📊 性能监控

### 查询缓存
Accelerate会自动缓存SELECT查询，缓存时间：
- **默认**：60秒
- **自定义**：可在查询中指定缓存时间

### 连接池
- **自动管理**：无需手动配置连接池
- **全球分布**：根据用户位置选择最近的边缘节点

## 🌍 部署建议

### 开发环境
- 可以使用直接连接进行调试
- 便于查看详细的数据库日志

### 生产环境
- **强烈推荐**使用Prisma Accelerate
- 获得最佳性能和用户体验
- 自动处理全球用户的访问优化

## 🔐 安全注意事项

1. **API密钥保护**：
   - 不要在客户端代码中暴露API密钥
   - 使用环境变量管理敏感信息

2. **访问控制**：
   - Accelerate继承原数据库的访问权限
   - 不会改变数据库的安全模型

3. **数据加密**：
   - 所有数据传输都使用TLS加密
   - 缓存数据也经过加密处理

## 📈 最佳实践

1. **查询优化**：
   - 使用索引优化频繁查询
   - 避免N+1查询问题

2. **缓存策略**：
   - 识别高频查询并优化
   - 合理设置缓存时间

3. **监控**：
   - 定期检查查询性能
   - 监控缓存命中率

## 🆘 支持

如果遇到问题：
1. 检查Prisma Accelerate控制台
2. 查看应用日志
3. 临时切换到直接连接进行调试
4. 联系Prisma支持团队
