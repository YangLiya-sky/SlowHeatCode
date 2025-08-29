# 🚀 Vercel 部署指南

## 📋 部署前准备

### 1. 推送代码到GitHub
```bash
# 添加远程仓库
git remote add origin https://github.com/YangLiya-sky/SlowHeatCode.git

# 推送代码
git add .
git commit -m "Ready for Vercel deployment"
git push -u origin main
```

### 2. 数据库准备
推荐使用以下数据库服务：
- **Neon** (推荐): https://neon.tech - PostgreSQL，免费额度充足
- **PlanetScale**: https://planetscale.com - MySQL，免费额度
- **Supabase**: https://supabase.com - PostgreSQL，免费额度

## 🌐 Vercel 部署步骤

### 1. 登录Vercel
- 访问 https://vercel.com
- 使用GitHub账号登录

### 2. 创建新项目
- 点击 "New Project"
- 选择 `SlowHeatCode` 仓库
- 点击 "Import"

### 3. 配置项目设置
- **Framework Preset**: Next.js (自动检测)
- **Root Directory**: `./` (默认)
- **Build Command**: `npm run build` (默认)
- **Output Directory**: `.next` (默认)

### 4. 配置环境变量
在 "Environment Variables" 部分添加：

#### 必需的环境变量：
```
DATABASE_URL = your_database_connection_string
NEXTAUTH_SECRET = your_secret_key_here
NEXTAUTH_URL = https://your-project-name.vercel.app
```

#### 环境变量详细说明：

**DATABASE_URL**
- Neon示例: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
- PlanetScale示例: `mysql://username:password@aws.connect.psdb.cloud/database-name?sslmode=require`

**NEXTAUTH_SECRET**
- 生成方法: `openssl rand -base64 32`
- 或使用在线生成器: https://generate-secret.vercel.app/32

**NEXTAUTH_URL**
- 开发环境: `http://localhost:3000`
- 生产环境: `https://your-project-name.vercel.app`

### 5. 部署
- 点击 "Deploy"
- 等待构建完成（通常2-3分钟）

## 🗄️ 数据库设置

### 使用Neon (推荐)
1. 注册 https://neon.tech
2. 创建新项目
3. 复制连接字符串
4. 在Vercel中设置 `DATABASE_URL`

### 初始化数据库
部署完成后，需要初始化数据库：
1. 在Vercel项目的Functions标签页
2. 找到任意API函数，点击查看日志
3. 数据库表会在首次API调用时自动创建

## 🔧 部署后配置

### 1. 自定义域名（可选）
- 在Vercel项目设置中添加自定义域名
- 更新 `NEXTAUTH_URL` 环境变量

### 2. 数据初始化
访问以下URL来初始化示例数据：
- `https://your-domain.vercel.app/api/posts` - 检查API是否正常
- 使用管理面板创建第一个用户和内容

## 🚨 常见问题

### 构建失败
- 检查 `package.json` 中的依赖版本
- 确保所有TypeScript错误已修复

### 数据库连接失败
- 检查 `DATABASE_URL` 格式是否正确
- 确保数据库服务正在运行
- 检查网络连接和防火墙设置

### 认证问题
- 确保 `NEXTAUTH_SECRET` 已设置
- 检查 `NEXTAUTH_URL` 是否与实际域名匹配

## 📊 监控和维护

### Vercel Analytics
- 在项目设置中启用Analytics
- 监控性能和用户访问

### 日志查看
- 在Vercel控制台的Functions标签页查看API日志
- 使用 `console.log` 进行调试

## 🔄 更新部署

每次推送到main分支，Vercel会自动重新部署：
```bash
git add .
git commit -m "Update content"
git push origin main
```

## 🎉 部署完成

部署成功后，您的博客将在以下地址可用：
- 主域名: `https://your-project-name.vercel.app`
- 自定义域名: `https://your-custom-domain.com` (如果配置了)

享受您的新博客吧！🎊
