'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Alert, Link, IconButton, InputAdornment } from '@mui/material';
import { Login, Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center py-12 px-4 lg:px-8">
      <Container maxWidth="sm">
        <GlassCard className="p-8">
          <Box className="text-center mb-8">
            <Box className="flex justify-center mb-4">
              <Box className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500">
                <Login className="text-white text-3xl" />
              </Box>
            </Box>
            <Typography variant="h4" className="text-white font-bold mb-2">
              管理员登录
            </Typography>
            <Typography variant="body1" className="text-white/70">
              登录到管理后台
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4" sx={{
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              color: '#f44336',
              '& .MuiAlert-icon': { color: '#f44336' }
            }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="mb-4" sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              color: '#4caf50',
              '& .MuiAlert-icon': { color: '#4caf50' }
            }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <TextField
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-white/60" />
                  </InputAdornment>
                ),
                style: { color: 'white' }
              }}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
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
              label="密码"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-white/60" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/60 hover:text-white"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: 'white' }
              }}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
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
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Box>
                  登录中...
                </>
              ) : (
                <>
                  <Login className="mr-2" />
                  登录
                </>
              )}
            </GlassButton>
          </form>

          <Box className="text-center mt-6">
            <Typography variant="body2" className="text-white/70">
              请使用管理员账户登录
            </Typography>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  );
}
