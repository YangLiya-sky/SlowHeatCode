'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Chip, Avatar, Divider, IconButton } from '@mui/material';
import { CalendarToday, AccessTime, Visibility, Share, Favorite, BookmarkBorder, ArrowBack } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      setLoading(true);
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      } else {
        setError('文章未找到');
      }
    } catch (error) {
      console.error('Load post error:', error);
      setError('加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Box className="flex items-center justify-center min-h-[60vh]">
          <Box className="text-center">
            <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
            <Typography variant="h6" className="text-white/70">
              加载中...
            </Typography>
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Box className="flex items-center justify-center min-h-[60vh]">
          <Box className="text-center">
            <Typography variant="h5" className="text-white/70 mb-4">
              {error || '文章不存在'}
            </Typography>
            <Link href="/blog">
              <GlassButton glassVariant="primary">
                返回博客列表
              </GlassButton>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* 文章内容 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          {/* 返回按钮 */}
          <Box className="mb-8">
            <Link href="/blog">
              <GlassButton glassVariant="ghost" size="small">
                <ArrowBack className="mr-2" />
                返回博客
              </GlassButton>
            </Link>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要内容 */}
            <Box className="lg:col-span-2">
              <GlassCard className="p-8">
                {/* 文章头部 */}
                <Box className="mb-8">
                  <Box className="flex items-center gap-2 mb-4">
                    <Chip
                      label={typeof post.category === 'object' ? post.category?.name : post.category || '未分类'}
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0"
                    />
                    {post.tags?.map((tag: any) => (
                      <Chip
                        key={tag.id || tag.name || tag}
                        label={typeof tag === 'object' ? (tag.tag?.name || tag.name) : tag}
                        size="small"
                        className="bg-white/10 text-white border-white/20"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography variant="h3" className="text-white font-bold mb-4 leading-tight">
                    {post.title}
                  </Typography>

                  {post.excerpt && (
                    <Typography variant="h6" className="text-white/80 mb-6 leading-relaxed">
                      {post.excerpt}
                    </Typography>
                  )}

                  {/* 文章元信息 */}
                  <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Box className="flex items-center gap-4">
                      <Avatar
                        src="/api/placeholder/40/40"
                        alt={post.author?.name || post.author?.username}
                        className="border-2 border-white/20"
                      />
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          {post.author?.name || post.author?.username}
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          全栈开发工程师
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-4 text-sm text-white/60">
                      <Box className="flex items-center gap-1">
                        <CalendarToday fontSize="small" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <AccessTime fontSize="small" />
                        <span>{Math.ceil((post.content?.length || 0) / 500)} 分钟阅读</span>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Visibility fontSize="small" />
                        <span>{post.views || 0}</span>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider className="border-white/10 mb-8" />

                {/* 文章内容 */}
                <Box className="prose prose-invert max-w-none mb-8">
                  <div
                    className="text-white/90 leading-relaxed"
                    style={{
                      lineHeight: '1.8',
                      fontSize: '1.1rem'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: (post.content || '')
                        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mb-6 mt-8">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-white mb-4 mt-6">$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium text-white mb-3 mt-4">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                        .replace(/`(.*?)`/g, '<code class="bg-white/10 px-2 py-1 rounded text-indigo-300 font-mono text-sm">$1</code>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                </Box>

                <Divider className="border-white/10 mb-8" />

                {/* 互动按钮 */}
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center gap-2">
                    <IconButton className="text-white/70 hover:text-red-400">
                      <Favorite />
                    </IconButton>
                    <IconButton className="text-white/70 hover:text-white">
                      <BookmarkBorder />
                    </IconButton>
                    <IconButton className="text-white/70 hover:text-white">
                      <Share />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" className="text-white/60">
                    {post.likes || 0} 人喜欢这篇文章
                  </Typography>
                </Box>
              </GlassCard>
            </Box>

            {/* 侧边栏 */}
            <Box className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-8">
                <Typography variant="h6" className="text-white font-semibold mb-4">
                  文章信息
                </Typography>
                <Box className="space-y-3 text-sm text-white/70">
                  <Box className="flex justify-between">
                    <span>发布时间</span>
                    <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  </Box>
                  <Box className="flex justify-between">
                    <span>阅读时间</span>
                    <span>{Math.ceil((post.content?.length || 0) / 500)} 分钟</span>
                  </Box>
                  <Box className="flex justify-between">
                    <span>浏览次数</span>
                    <span>{post.views || 0}</span>
                  </Box>
                  <Box className="flex justify-between">
                    <span>点赞数</span>
                    <span>{post.likes || 0}</span>
                  </Box>
                </Box>
              </GlassCard>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
