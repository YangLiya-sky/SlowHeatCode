import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.qq.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // 发送邮件的邮箱
        pass: process.env.SMTP_PASS, // 邮箱授权码
      },
    });

    // 邮件内容
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // 发送者
      to: process.env.CONTACT_EMAIL || '1378473519@qq.com', // 接收者
      subject: `[博客联系] ${subject}`, // 主题
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; text-align: center;">新的联系消息</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">联系信息</h2>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">姓名：</strong>
              <span style="color: #333;">${name}</span>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">邮箱：</strong>
              <span style="color: #333;">${email}</span>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">主题：</strong>
              <span style="color: #333;">${subject}</span>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">消息内容：</strong>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #667eea;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p>此邮件来自您的博客联系表单</p>
              <p>发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>🚀 由 Vibe 博客系统发送</p>
          </div>
        </div>
      `,
      // 纯文本版本
      text: `
新的联系消息

姓名：${name}
邮箱：${email}
主题：${subject}

消息内容：
${message}

发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
      `,
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: '消息发送成功！我会尽快回复您。'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('邮件发送失败:', error);

    // 根据错误类型返回不同的错误信息
    let errorMessage = '邮件发送失败，请稍后重试';

    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        errorMessage = '邮件服务配置错误，请联系管理员';
      } else if (error.message.includes('network')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
