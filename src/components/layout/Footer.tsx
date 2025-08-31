'use client';

import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import { GitHub, LinkedIn, Twitter, Email, Favorite } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';

const socialLinks = [
  { name: 'GitHub', icon: GitHub, href: 'https://github.com', color: '#333' },
  { name: 'LinkedIn', icon: LinkedIn, href: 'https://linkedin.com', color: '#0077b5' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: '#1da1f2' },
  { name: 'Email', icon: Email, href: 'mailto:1378473519@qq.com', color: '#ea4335' },
];

export function Footer() {
  return (
    <Box component="footer" className="mt-20 py-12 px-4 lg:px-8">
      <GlassCard className="p-8">
        <Box className="max-w-6xl mx-auto">
          {/* 主要内容区域 */}
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* 品牌信息 */}
            <Box>
              <Typography variant="h5" className="gradient-text font-bold mb-4">
                杨立雅 - 个人博客
              </Typography>
              <Typography variant="body2" className="text-white/70 mb-4 leading-relaxed">
                杨立雅的个人博客网站，采用玻璃拟态设计风格，分享技术见解和生活感悟。
              </Typography>
              <Box className="flex space-x-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <IconButton
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                        }
                      }}
                    >
                      <IconComponent />
                    </IconButton>
                  );
                })}
              </Box>
            </Box>

            {/* 快速链接 */}
            <Box>
              <Typography variant="h6" className="text-white font-semibold mb-4">
                快速链接
              </Typography>
              <Box className="space-y-2">
                {['首页', '关于我', '博客', '项目', '联系我'].map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    className="text-white/70 hover:text-white cursor-pointer transition-colors duration-300 block"
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* 最新文章 */}
            <Box>
              <Typography variant="h6" className="text-white font-semibold mb-4">
                最新文章
              </Typography>
              <Box className="space-y-3">
                {[
                  '玻璃拟态设计趋势探索',
                  'React 18 新特性详解',
                  'TypeScript 最佳实践'
                ].map((article) => (
                  <Typography
                    key={article}
                    variant="body2"
                    className="text-white/70 hover:text-white cursor-pointer transition-colors duration-300 block leading-relaxed"
                  >
                    {article}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          <Divider className="border-white/20 my-6" />

          {/* 版权信息 */}
          <Box className="flex flex-col md:flex-row justify-between items-center">
            <Typography variant="body2" className="text-white/60 mb-4 md:mb-0">
              © 2024 杨立雅. All rights reserved.
            </Typography>
            <Box className="flex items-center text-white/60">
              <Typography variant="body2" className="mr-1">
                Made with
              </Typography>
              <Favorite className="text-red-400 mx-1" fontSize="small" />
              <Typography variant="body2" className="ml-1">
                using Next.js & Material-UI
              </Typography>
            </Box>
          </Box>
        </Box>
      </GlassCard>
    </Box>
  );
}
