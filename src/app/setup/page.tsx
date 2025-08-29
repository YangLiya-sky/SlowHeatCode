'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, TextField, Alert, CircularProgress } from '@mui/material';
import { AdminPanelSettings, Security } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function SetupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    setupKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasAdmin, setHasAdmin] = useState(false);

  // 检查是否已有管理员
  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        const adminExists = data.users?.some((user: any) => user.role === 'ADMIN');
        setHasAdmin(adminExists);
      }
    } catch (error) {
      console.error('检查管理员状态失败:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // 验证表单
    if (!formData.email || !formData.username || !formData.password || !formData.setupKey) {
      setError('请填写所有必填字段');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('密码确认不匹配');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/setup/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          setupKey: formData.setupKey
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('管理员账户创建成功！您现在可以登录管理后台。');
        setFormData({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          setupKey: ''
        });
        setHasAdmin(true);
      } else {
        setError(data.error || '创建失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (hasAdmin) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Container maxWidth="sm" className="py-20">
          <GlassCard className="p-8 text-center">
            <AdminPanelSettings className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <Typography variant="h4" className="text-white font-bold mb-4">
              系统已初始化
            </Typography>
            <Typography variant="body1" className="text-white/70 mb-6">
              管理员账户已存在，系统已完成初始化设置。
            </Typography>
            <GlassButton 
              glassVariant="primary"
              onClick={() => window.location.href = '/login'}
            >
              前往登录
            </GlassButton>
          </GlassCard>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Navbar />
      <Container maxWidth="sm" className="py-20">
        <GlassCard className="p-8">
          <Box className="text-center mb-8">
            <Security className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <Typography variant="h4" className="text-white font-bold mb-2">
              系统初始化
            </Typography>
            <Typography variant="body1" className="text-white/70">
              创建管理员账户以完成系统设置
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" className="mb-4">
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="邮箱地址"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="glass-input"
            />

            <TextField
              fullWidth
              label="用户名"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="glass-input"
            />

            <TextField
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="glass-input"
            />

            <TextField
              fullWidth
              label="确认密码"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="glass-input"
            />

            <TextField
              fullWidth
              label="设置密钥"
              name="setupKey"
              type="password"
              value={formData.setupKey}
              onChange={handleInputChange}
              required
              helperText="请输入系统设置密钥（默认：admin-setup-2025）"
              className="glass-input"
            />

            <GlassButton
              type="submit"
              glassVariant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} className="mr-2" />
                  创建中...
                </>
              ) : (
                '创建管理员账户'
              )}
            </GlassButton>
          </form>
        </GlassCard>
      </Container>
      <Footer />
    </Box>
  );
}
