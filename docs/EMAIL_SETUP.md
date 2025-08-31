# 邮件服务配置指南

本文档介绍如何配置邮件服务，使联系表单能够发送邮件到您的邮箱。

## 🎯 配置步骤

### 1. 选择邮件服务提供商

推荐使用以下邮件服务：
- **QQ邮箱**（推荐，国内稳定）
- **Gmail**（国际通用）
- **163邮箱**（国内备选）

### 2. 获取邮箱授权码

#### QQ邮箱配置（推荐）

1. **登录QQ邮箱**
   - 访问 https://mail.qq.com
   - 使用您的QQ账号登录

2. **开启SMTP服务**
   - 点击"设置" → "账户"
   - 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
   - 开启"IMAP/SMTP服务"

3. **获取授权码**
   - 点击"生成授权码"
   - 按照提示发送短信验证
   - 保存生成的16位授权码（这不是您的QQ密码）

#### Gmail配置

1. **开启两步验证**
   - 访问 https://myaccount.google.com
   - 安全 → 两步验证

2. **生成应用专用密码**
   - 安全 → 应用专用密码
   - 选择"邮件"和您的设备
   - 保存生成的16位密码

#### 163邮箱配置

1. **登录163邮箱**
   - 访问 https://mail.163.com

2. **开启SMTP服务**
   - 设置 → POP3/SMTP/IMAP
   - 开启"IMAP/SMTP服务"
   - 设置客户端授权密码

### 3. 配置环境变量

在 `.env` 文件中添加以下配置：

```env
# 邮件服务配置
SMTP_HOST="smtp.qq.com"                # 邮件服务器地址
SMTP_PORT="587"                        # 端口号
SMTP_USER="your-email@qq.com"          # 发送邮件的邮箱
SMTP_PASS="your-app-password"          # 邮箱授权码
CONTACT_EMAIL="1378473519@qq.com"      # 接收联系消息的邮箱
```

### 4. 不同邮件服务的配置

#### QQ邮箱
```env
SMTP_HOST="smtp.qq.com"
SMTP_PORT="587"
SMTP_USER="your-email@qq.com"
SMTP_PASS="your-qq-auth-code"
```

#### Gmail
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

#### 163邮箱
```env
SMTP_HOST="smtp.163.com"
SMTP_PORT="587"
SMTP_USER="your-email@163.com"
SMTP_PASS="your-client-auth-password"
```

## 🔧 测试配置

1. **重启开发服务器**
   ```bash
   npm run dev
   ```

2. **测试发送邮件**
   - 访问 http://localhost:3000/contact
   - 填写联系表单
   - 点击发送消息
   - 检查您的邮箱是否收到邮件

## ⚠️ 常见问题

### 1. 认证失败
- 确保使用的是授权码，不是登录密码
- 检查邮箱是否开启了SMTP服务

### 2. 连接超时
- 检查网络连接
- 确认SMTP服务器地址和端口正确

### 3. 邮件被拒绝
- 检查发送邮箱是否有效
- 确认授权码是否正确

## 🚀 生产环境部署

在生产环境（如Vercel）中，需要在环境变量中配置：

1. **Vercel环境变量**
   - 登录Vercel控制台
   - 项目设置 → Environment Variables
   - 添加所有邮件相关的环境变量

2. **安全建议**
   - 不要在代码中硬编码邮箱密码
   - 使用环境变量存储敏感信息
   - 定期更换授权码

## 📧 邮件模板

系统会发送格式化的HTML邮件，包含：
- 发送者信息
- 联系主题
- 消息内容
- 发送时间
- 美观的样式设计

收到的邮件示例：
```
主题：[博客联系] 项目合作咨询

内容：
姓名：张三
邮箱：zhangsan@example.com
主题：项目合作咨询
消息：您好，我对您的项目很感兴趣...
```

## 🎨 自定义邮件模板

如需自定义邮件模板，请编辑：
`src/app/api/contact/route.ts` 中的 `mailOptions.html` 部分。
