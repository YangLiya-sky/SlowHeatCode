'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { Email, Phone, LocationOn, LinkedIn, GitHub, Twitter, Send, CheckCircle } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const contactInfo = [
  {
    icon: Email,
    title: '邮箱',
    value: '1378473519@qq.com',
    link: 'mailto:1378473519@qq.com',
    description: '工作合作或技术交流'
  },
  {
    icon: LocationOn,
    title: '位置',
    value: '中国 · 武汉',
    link: '',
    description: '可远程工作或现场办公'
  }
];

const socialLinks = [
  {
    icon: GitHub,
    name: 'GitHub',
    url: 'https://github.com/example',
    color: '#333',
    description: '查看我的开源项目'
  },
  {
    icon: LinkedIn,
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/example',
    color: '#0077b5',
    description: '专业经历和职业网络'
  },
  {
    icon: Twitter,
    name: 'Twitter',
    url: 'https://twitter.com/example',
    color: '#1da1f2',
    description: '技术分享和日常动态'
  },
  {
    icon: Email,
    name: 'WeChat',
    url: '',
    color: '#07c160',
    description: '微信: developer_wechat'
  }
];

const faqs = [
  {
    question: '您接受远程工作吗？',
    answer: '是的，我有丰富的远程工作经验，能够高效地进行远程协作和项目管理。'
  },
  {
    question: '您的技术栈主要是什么？',
    answer: '我主要专注于React/Next.js前端开发，同时具备Node.js后端开发能力，熟悉现代Web开发的完整技术栈。'
  },
  {
    question: '您是否提供技术咨询服务？',
    answer: '是的，我提供技术咨询、代码审查、架构设计等服务。具体可以通过邮件详细沟通。'
  },
  {
    question: '项目合作的流程是怎样的？',
    answer: '通常包括需求分析、技术方案设计、开发实施、测试部署等阶段。我会根据项目规模制定详细的时间计划。'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(data.error || '发送失败，请稍后重试');
      }
    } catch (error) {
      console.error('发送失败:', error);
      setErrorMessage('网络错误，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              联系我
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto mb-8">
              有项目合作想法？技术问题需要讨论？或者只是想打个招呼？
              我很乐意与您交流！
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 联系表单 */}
            <GlassCard className="p-8">
              <Typography variant="h4" className="text-white font-bold mb-6">
                发送消息
              </Typography>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    label="姓名"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="邮箱"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="主题"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="消息内容"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                  InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />

                <GlassButton
                  type="submit"
                  glassVariant="primary"
                  size="large"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Box>
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" />
                      发送消息
                    </>
                  )}
                </GlassButton>
              </form>
            </GlassCard>

            {/* 联系信息 */}
            <Box className="space-y-8">
              {/* 直接联系方式 */}
              <GlassCard className="p-8">
                <Typography variant="h4" className="text-white font-bold mb-6">
                  联系方式
                </Typography>

                <Box className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <Box key={index} className="flex items-start gap-4">
                        <Box className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500">
                          <IconComponent className="text-white text-xl" />
                        </Box>
                        <Box className="flex-1">
                          <Typography variant="h6" className="text-white font-semibold mb-1">
                            {info.title}
                          </Typography>
                          {info.link ? (
                            <Typography
                              component="a"
                              href={info.link}
                              variant="body1"
                              className="text-indigo-400 hover:text-indigo-300 transition-colors mb-1 block"
                            >
                              {info.value}
                            </Typography>
                          ) : (
                            <Typography variant="body1" className="text-white/80 mb-1">
                              {info.value}
                            </Typography>
                          )}
                          <Typography variant="body2" className="text-white/60">
                            {info.description}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </GlassCard>

              {/* 社交媒体 */}
              <GlassCard className="p-8">
                <Typography variant="h5" className="text-white font-bold mb-6">
                  社交媒体
                </Typography>

                <Box className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <Box
                        key={index}
                        component={social.url ? "a" : "div"}
                        href={social.url || undefined}
                        target={social.url ? "_blank" : undefined}
                        rel={social.url ? "noopener noreferrer" : undefined}
                        className={`p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 ${social.url ? 'hover:bg-white/10 cursor-pointer' : ''
                          }`}
                      >
                        <Box className="flex items-center gap-3">
                          <IconComponent
                            className="text-2xl"
                            style={{ color: social.color }}
                          />
                          <Box>
                            <Typography variant="body1" className="text-white font-medium">
                              {social.name}
                            </Typography>
                            <Typography variant="body2" className="text-white/60 text-xs">
                              {social.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </GlassCard>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 常见问题 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-white font-bold text-center mb-12">
            常见问题
          </Typography>

          <Box className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <GlassCard key={index} className="p-6 glass-hover">
                <Typography variant="h6" className="text-white font-semibold mb-3">
                  {faq.question}
                </Typography>
                <Typography variant="body1" className="text-white/80 leading-relaxed">
                  {faq.answer}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 响应时间说明 */}
      <Box className="py-12 px-4 lg:px-8">
        <Container maxWidth="lg">
          <GlassCard className="p-8 text-center">
            <CheckCircle className="text-green-400 text-4xl mb-4 mx-auto" />
            <Typography variant="h5" className="text-white font-bold mb-4">
              快速响应承诺
            </Typography>
            <Typography variant="body1" className="text-white/80 mb-4">
              我通常会在 24 小时内回复邮件，期待与您的交流合作。
            </Typography>
            <Typography variant="body2" className="text-white/60">
              工作时间：周一至周五 9:00-18:00 (GMT+8)
            </Typography>
          </GlassCard>
        </Container>
      </Box>

      {/* 成功提示 */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          消息发送成功！我会尽快回复您。
        </Alert>
      </Snackbar>

      {/* 错误提示 */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorMessage('')}
          severity="error"
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
