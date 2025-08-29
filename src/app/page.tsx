'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Avatar, Chip } from '@mui/material';
import { Code, Palette, Rocket, TrendingUp, Article, GitHub } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useDataSync } from '@/lib/dataSync';
import Link from 'next/link';

const skills = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'UI/UX Design'
];



const features = [
  {
    icon: Code,
    title: '全栈开发',
    description: '精通前端和后端技术栈，能够独立完成完整的Web应用开发'
  },
  {
    icon: Palette,
    title: 'UI/UX设计',
    description: '注重用户体验，擅长现代化界面设计和交互设计'
  },
  {
    icon: Rocket,
    title: '性能优化',
    description: '专注于应用性能优化，提供流畅的用户体验'
  },
  {
    icon: TrendingUp,
    title: '持续学习',
    description: '紧跟技术趋势，不断学习和分享新技术'
  }
];

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 使用数据同步
  const { data: syncedPosts } = useDataSync('posts');

  useEffect(() => {
    loadRecentPosts();
  }, []);

  const loadRecentPosts = async () => {
    try {
      const response = await fetch('/api/posts?status=PUBLISHED&limit=3');
      if (response.ok) {
        const data = await response.json();
        setRecentPosts(data.posts);

        // 预加载博客页面数据
        setTimeout(() => {
          fetch('/api/posts?status=PUBLISHED&limit=10').catch(() => { });
          fetch('/api/categories').catch(() => { });
        }, 1000);
      }
    } catch (error) {
      console.error('Load recent posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Box className="text-center md:text-left">
              <Typography variant="h1" className="text-white font-bold mb-6 animate-float">
                你好，我是
                <span className="gradient-text block mt-2">
                  开发者
                </span>
              </Typography>
              <Typography variant="h5" className="text-white/80 mb-8 leading-relaxed">
                一名热爱技术的全栈开发者，专注于创建优雅、高效的Web应用。
                欢迎来到我的数字世界！
              </Typography>
              <Box className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <GlassButton glassVariant="primary" size="large">
                  <Article className="mr-2" />
                  查看博客
                </GlassButton>
                <GlassButton glassVariant="outline" size="large">
                  <GitHub className="mr-2" />
                  GitHub
                </GlassButton>
              </Box>
            </Box>
            <Box className="flex justify-center">
              <GlassCard className="p-8 text-center max-w-sm">
                <Avatar
                  sx={{ width: 120, height: 120 }}
                  className="mx-auto mb-4 border-4 border-white/20"
                  src="/api/placeholder/120/120"
                  alt="Profile"
                />
                <Typography variant="h6" className="text-white font-semibold mb-2">
                  开发者
                </Typography>
                <Typography variant="body2" className="text-white/70 mb-4">
                  全栈开发工程师
                </Typography>
                <Box className="flex flex-wrap gap-2 justify-center">
                  {skills.slice(0, 3).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      className="bg-white/10 text-white border-white/20"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </GlassCard>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Typography variant="h2" className="text-center text-white font-bold mb-4">
            我的专长
          </Typography>
          <Typography variant="h6" className="text-center text-white/70 mb-12">
            专注于现代Web技术和用户体验
          </Typography>
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <GlassCard key={index} className="p-6 h-full glass-hover text-center">
                  <Box className="mb-4">
                    <IconComponent className="text-4xl text-indigo-400" />
                  </Box>
                  <Typography variant="h6" className="text-white font-semibold mb-3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" className="text-white/70 leading-relaxed">
                    {feature.description}
                  </Typography>
                </GlassCard>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Recent Posts Section */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Typography variant="h2" className="text-center text-white font-bold mb-4">
            最新文章
          </Typography>
          <Typography variant="h6" className="text-center text-white/70 mb-12">
            分享技术见解和开发经验
          </Typography>
          {loading ? (
            <Box className="text-center py-12">
              <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
              <Typography variant="body1" className="text-white/70">
                加载中...
              </Typography>
            </Box>
          ) : (
            <>
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <GlassCard className="p-6 h-full glass-hover cursor-pointer">
                      <Typography variant="h6" className="text-white font-semibold mb-3">
                        {post.title}
                      </Typography>
                      <Typography variant="body2" className="text-white/70 mb-4 leading-relaxed">
                        {post.excerpt || (post.content?.substring(0, 100) || '') + '...'}
                      </Typography>
                      <Box className="flex justify-between items-center text-sm text-white/60 mb-3">
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                        <span>{Math.ceil((post.content?.length || 0) / 500)} 分钟阅读</span>
                      </Box>
                      <Box className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 3).map((tag: any) => (
                          <Chip
                            key={tag.id || tag.name || tag}
                            label={typeof tag === 'object' ? (tag.tag?.name || tag.name) : tag}
                            size="small"
                            className="bg-white/5 text-white/60 border-white/10"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </GlassCard>
                  </Link>
                ))}
              </Box>
              <Box className="text-center mt-8">
                <Link href="/blog">
                  <GlassButton glassVariant="secondary">
                    查看所有文章
                  </GlassButton>
                </Link>
              </Box>
            </>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
