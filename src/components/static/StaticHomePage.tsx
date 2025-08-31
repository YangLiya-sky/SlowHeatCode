'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Chip } from '@mui/material';
import { GitHub, Launch, Visibility, ThumbUp } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { staticPosts } from '@/data/static-posts';
import { staticProjects } from '@/data/static-projects';
import Link from 'next/link';

export default function StaticHomePage() {
  // 获取最新的3篇文章
  const latestPosts = staticPosts.slice(0, 3);

  // 获取精选项目
  const featuredProjects = staticProjects.filter(project => project.featured).slice(0, 2);

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={8} {...({} as any)}>
              <Typography variant="h1" className="text-white font-bold mb-6 text-4xl lg:text-6xl">
                你好，我是{' '}
                <Box component="span" className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  开发者
                </Box>
              </Typography>
              <Typography variant="h5" className="text-white/70 mb-8 leading-relaxed">
                一名热爱技术的全栈开发者，专注于创建优雅、高效的Web应用。
                欢迎来到我的数字世界！
              </Typography>
              <Box className="flex flex-wrap gap-4">
                <Link href="/blog" passHref>
                  <GlassButton glassVariant="primary" className="flex items-center gap-2">
                    <Launch className="w-5 h-5" />
                    查看博客
                  </GlassButton>
                </Link>
                <GlassButton
                  glassVariant="secondary"
                  className="flex items-center gap-2"
                  component="a"
                  href="https://github.com/YangLiya-sky"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHub className="w-5 h-5" />
                  GitHub
                </GlassButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} {...({} as any)}>
              <GlassCard className="p-8 text-center">
                <Box className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  P
                </Box>
                <Typography variant="h6" className="text-white font-semibold mb-2">
                  开发者
                </Typography>
                <Typography variant="body2" className="text-white/70 mb-4">
                  全栈开发工程师
                </Typography>
                <Box className="flex flex-wrap gap-2 justify-center">
                  <Chip label="React" size="small" className="bg-blue-500/20 text-blue-400 border-blue-400/30" />
                  <Chip label="TypeScript" size="small" className="bg-blue-500/20 text-blue-400 border-blue-400/30" />
                  <Chip label="Next.js" size="small" className="bg-blue-500/20 text-blue-400 border-blue-400/30" />
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 我的专长 */}
      <Box className="py-16 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              我的专长
            </Typography>
            <Typography variant="h6" className="text-white/70">
              专注于现代Web技术和用户体验
            </Typography>
          </Box>
          <Grid container spacing={6}>
            {[
              {
                title: "全栈开发",
                description: "精通前端和后端技术栈，能够独立完成完整的Web应用开发",
                icon: "💻"
              },
              {
                title: "UI/UX设计",
                description: "注重用户体验，擅长现代化界面设计和交互设计",
                icon: "🎨"
              },
              {
                title: "性能优化",
                description: "专注于应用性能优化，提供流畅的用户体验",
                icon: "⚡"
              },
              {
                title: "持续学习",
                description: "紧跟技术趋势，不断学习和分享新技术",
                icon: "📚"
              }
            ].map((skill, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index} {...({} as any)}>
                <GlassCard className="p-6 h-full text-center glass-hover">
                  <Box className="text-4xl mb-4">{skill.icon}</Box>
                  <Typography variant="h6" className="text-white font-semibold mb-3">
                    {skill.title}
                  </Typography>
                  <Typography variant="body2" className="text-white/70">
                    {skill.description}
                  </Typography>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 最新文章 */}
      <Box className="py-16 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              最新文章
            </Typography>
            <Typography variant="h6" className="text-white/70">
              分享技术见解和开发经验
            </Typography>
          </Box>
          <Grid container spacing={6}>
            {latestPosts.map((post) => (
              <Grid item xs={12} md={4} key={post.id} {...({} as any)}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <GlassCard className="p-6 h-full glass-hover cursor-pointer">
                    <Typography variant="h6" className="text-white font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" className="text-white/70 mb-4 line-clamp-3">
                      {post.excerpt}
                    </Typography>
                    <Box className="flex items-center justify-between text-sm text-white/60 mb-4">
                      <span>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</span>
                      <span>{Math.ceil(post.content.length / 500)} 分钟阅读</span>
                    </Box>
                    <Box className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag: any) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          className="bg-white/10 text-white/80 border-white/20"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </GlassCard>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Box className="text-center mt-12">
            <Link href="/blog" passHref>
              <GlassButton glassVariant="secondary">
                查看所有文章
              </GlassButton>
            </Link>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
