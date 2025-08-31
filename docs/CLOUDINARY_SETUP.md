# Cloudinary云存储配置指南

本文档介绍如何配置Cloudinary云存储服务，用于在生产环境中处理媒体文件上传。

## 🎯 为什么需要云存储？

在Vercel等无服务器平台部署时，本地文件系统是只读的，无法保存上传的文件。因此需要使用云存储服务来处理媒体文件。

## 📋 配置步骤

### 1. 注册Cloudinary账户

1. **访问官网**
   - 前往 https://cloudinary.com
   - 点击"Sign Up Free"注册免费账户

2. **验证邮箱**
   - 查收验证邮件并完成验证
   - 登录到Cloudinary控制台

### 2. 获取API凭据

1. **进入Dashboard**
   - 登录后会自动跳转到Dashboard
   - 在页面顶部可以看到Account Details

2. **复制配置信息**
   ```
   Cloud Name: your-cloud-name
   API Key: 123456789012345
   API Secret: your-api-secret-key
   ```

### 3. 配置环境变量

在生产环境（如Vercel）中添加以下环境变量：

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Vercel部署配置

1. **登录Vercel控制台**
   - 访问 https://vercel.com
   - 进入您的项目设置

2. **添加环境变量**
   - 项目设置 → Environment Variables
   - 添加以下变量：
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

3. **重新部署**
   - 保存环境变量后
   - 触发重新部署以应用配置

## 🔧 功能特性

### 自动环境检测
- **开发环境**: 自动使用本地文件系统存储
- **生产环境**: 自动使用Cloudinary云存储

### 文件管理
- **上传**: 自动上传到`vibe-blog`文件夹
- **删除**: 支持从云端删除文件
- **优化**: 自动图片压缩和格式优化

### 安全性
- **访问控制**: 通过API密钥控制访问
- **HTTPS**: 所有文件通过HTTPS提供
- **CDN**: 全球CDN加速访问

## 📊 免费额度

Cloudinary免费计划包含：
- **存储空间**: 25GB
- **带宽**: 25GB/月
- **转换**: 25,000次/月
- **视频处理**: 1GB存储 + 1GB带宽

对于个人博客来说，免费额度通常足够使用。

## 🛠️ 高级配置

### 图片优化设置

可以在上传时添加转换参数：

```javascript
cloudinary.uploader.upload_stream({
  resource_type: 'image',
  folder: 'vibe-blog',
  transformation: [
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
})
```

### 文件夹组织

建议按以下结构组织文件：
```
vibe-blog/
├── posts/          # 文章图片
├── projects/       # 项目图片
├── avatars/        # 头像图片
└── general/        # 其他图片
```

## ⚠️ 注意事项

1. **API密钥安全**
   - 不要在代码中硬编码API密钥
   - 使用环境变量存储敏感信息

2. **文件命名**
   - 系统会自动生成唯一文件名
   - 避免文件名冲突

3. **带宽监控**
   - 定期检查使用量
   - 避免超出免费额度

## 🔍 故障排除

### 上传失败
- 检查API凭据是否正确
- 确认网络连接正常
- 查看服务器日志错误信息

### 图片无法显示
- 确认Cloudinary URL格式正确
- 检查文件是否成功上传
- 验证访问权限设置

### 环境变量问题
- 确认所有必需的环境变量都已设置
- 重新部署应用以应用新配置
- 检查变量名拼写是否正确

## 📚 相关文档

- [Cloudinary官方文档](https://cloudinary.com/documentation)
- [Node.js SDK文档](https://cloudinary.com/documentation/node_integration)
- [图片转换指南](https://cloudinary.com/documentation/image_transformations)

配置完成后，您的博客就可以在生产环境中正常使用媒体上传功能了！
