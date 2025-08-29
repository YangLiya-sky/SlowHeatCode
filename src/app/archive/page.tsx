'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { CalendarToday, AccessTime, Visibility, ExpandMore, Archive as ArchiveIcon, Category, TrendingUp } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

// 模拟博客数据
const blogPosts = [
  {
    id: 1,
    title: '玻璃拟态设计趋势探索',
    excerpt: '深入探讨玻璃拟态设计在现代Web开发中的应用和最佳实践...',
    date: '2024-01-15',
    year: 2024,
    month: 1,
    readTime: '5 分钟阅读',
    views: 1250,
    tags: ['设计', 'CSS', 'UI/UX'],
    category: '前端开发'
  },
  {
    id: 2,
    title: 'React 18 新特性详解',
    excerpt: '全面解析React 18的并发特性、Suspense改进和新的Hooks...',
    date: '2024-01-10',
    year: 2024,
    month: 1,
    readTime: '8 分钟阅读',
    views: 2100,
    tags: ['React', 'JavaScript', '前端'],
    category: '前端开发'
  },
  {
    id: 3,
    title: 'TypeScript 最佳实践',
    excerpt: '分享在大型项目中使用TypeScript的经验和技巧...',
    date: '2024-01-05',
    year: 2024,
    month: 1,
    readTime: '6 分钟阅读',
    views: 1800,
    tags: ['TypeScript', 'JavaScript', '最佳实践'],
    category: '前端开发'
  },
  {
    id: 4,
    title: 'Next.js 性能优化指南',
    excerpt: '详细介绍Next.js应用的性能优化策略...',
    date: '2023-12-28',
    year: 2023,
    month: 12,
    readTime: '10 分钟阅读',
    views: 3200,
    tags: ['Next.js', '性能优化', 'React'],
    category: '前端开发'
  },
  {
    id: 5,
    title: '现代CSS布局技术',
    excerpt: '探索CSS Grid、Flexbox和Container Queries等现代布局技术...',
    date: '2023-12-20',
    year: 2023,
    month: 12,
    readTime: '7 分钟阅读',
    views: 1650,
    tags: ['CSS', '布局', '响应式设计'],
    category: '前端开发'
  },
  {
    id: 6,
    title: 'Node.js 微服务架构实践',
    excerpt: '分享Node.js微服务架构的设计和实现经验...',
    date: '2023-11-15',
    year: 2023,
    month: 11,
    readTime: '12 分钟阅读',
    views: 2800,
    tags: ['Node.js', '微服务', '后端'],
    category: '后端开发'
  },
  {
    id: 7,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: 'Vue 3 Composition API的核心概念和实际应用...',
    date: '2023-10-22',
    year: 2023,
    month: 10,
    readTime: '9 分钟阅读',
    views: 1950,
    tags: ['Vue.js', 'JavaScript', '前端'],
    category: '前端开发'
  },
  {
    id: 8,
    title: 'Docker 容器化部署实战',
    excerpt: '从零开始学习Docker容器化技术和部署策略...',
    date: '2023-09-18',
    year: 2023,
    month: 9,
    readTime: '11 分钟阅读',
    views: 2400,
    tags: ['Docker', 'DevOps', '部署'],
    category: 'DevOps'
  }
];

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

const categories = Array.from(new Set(blogPosts.map(post => post.category)));
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

export default function ArchivePage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'category' | 'tags'>('timeline');
  const [expandedYear, setExpandedYear] = useState<number | null>(2024);

  // 按年份和月份分组
  const postsByYear = blogPosts.reduce((acc, post) => {
    if (!acc[post.year]) {
      acc[post.year] = {};
    }
    if (!acc[post.year][post.month]) {
      acc[post.year][post.month] = [];
    }
    acc[post.year][post.month].push(post);
    return acc;
  }, {} as Record<number, Record<number, typeof blogPosts>>);

  // 按分类分组
  const postsByCategory = blogPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, typeof blogPosts>);

  // 按标签分组
  const postsByTag = blogPosts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(post);
    });
    return acc;
  }, {} as Record<string, typeof blogPosts>);

  // 统计数据
  const totalPosts = blogPosts.length;
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const years = Object.keys(postsByYear).map(Number).sort((a, b) => b - a);

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              文章归档
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto mb-8">
              按时间、分类和标签浏览所有文章，探索技术成长的历程
            </Typography>

            {/* 统计信息 */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <GlassCard className="p-6 text-center">
                <ArchiveIcon className="text-3xl text-indigo-400 mb-2" />
                <Typography variant="h3" className="gradient-text font-bold mb-2">
                  {totalPosts}
                </Typography>
                <Typography variant="body1" className="text-white/70">
                  总文章数
                </Typography>
              </GlassCard>
              <GlassCard className="p-6 text-center">
                <Visibility className="text-3xl text-pink-400 mb-2" />
                <Typography variant="h3" className="gradient-text font-bold mb-2">
                  {(totalViews / 1000).toFixed(1)}K
                </Typography>
                <Typography variant="body1" className="text-white/70">
                  总阅读量
                </Typography>
              </GlassCard>
              <GlassCard className="p-6 text-center">
                <Category className="text-3xl text-green-400 mb-2" />
                <Typography variant="h3" className="gradient-text font-bold mb-2">
                  {categories.length}
                </Typography>
                <Typography variant="body1" className="text-white/70">
                  文章分类
                </Typography>
              </GlassCard>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 视图切换 */}
      <Box className="py-8 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="flex justify-center gap-4 mb-12">
            {[
              { key: 'timeline', label: '时间线', icon: CalendarToday },
              { key: 'category', label: '分类', icon: Category },
              { key: 'tags', label: '标签', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <Chip
                key={key}
                icon={<Icon />}
                label={label}
                onClick={() => setViewMode(key as any)}
                className={`cursor-pointer transition-all duration-300 px-6 py-3 ${viewMode === key
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                variant={viewMode === key ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* 内容区域 */}
      <Box className="py-12 px-4 lg:px-8">
        <Container maxWidth="lg">
          {/* 时间线视图 */}
          {viewMode === 'timeline' && (
            <Box className="space-y-6">
              {years.map(year => (
                <GlassCard key={year} className="overflow-hidden">
                  <Accordion
                    expanded={expandedYear === year}
                    onChange={() => setExpandedYear(expandedYear === year ? null : year)}
                    sx={{
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore className="text-white" />}
                      className="px-8 py-4"
                    >
                      <Box className="flex items-center justify-between w-full mr-4">
                        <Typography variant="h4" className="text-white font-bold">
                          {year} 年
                        </Typography>
                        <Typography variant="body1" className="text-white/70">
                          {Object.values(postsByYear[year]).flat().length} 篇文章
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails className="px-8 pb-8">
                      <Box className="space-y-8">
                        {Object.keys(postsByYear[year])
                          .map(Number)
                          .sort((a, b) => b - a)
                          .map(month => (
                            <Box key={month}>
                              <Typography variant="h6" className="text-white font-semibold mb-4 flex items-center">
                                <CalendarToday className="mr-2 text-indigo-400" />
                                {monthNames[month - 1]} {year}
                                <Chip
                                  label={`${postsByYear[year][month].length} 篇`}
                                  size="small"
                                  className="ml-3 bg-white/10 text-white border-white/20"
                                  variant="outlined"
                                />
                              </Typography>
                              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {postsByYear[year][month].map(post => (
                                  <Link key={post.id} href={`/blog/${post.id}`}>
                                    <Box className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                                      <Typography variant="h6" className="text-white font-semibold mb-2">
                                        {post.title}
                                      </Typography>
                                      <Typography variant="body2" className="text-white/70 mb-3 line-clamp-2">
                                        {post.excerpt}
                                      </Typography>
                                      <Box className="flex items-center justify-between text-sm text-white/60 mb-2">
                                        <span>{post.date}</span>
                                        <Box className="flex items-center gap-3">
                                          <Box className="flex items-center gap-1">
                                            <AccessTime fontSize="small" />
                                            <span>{post.readTime}</span>
                                          </Box>
                                          <Box className="flex items-center gap-1">
                                            <Visibility fontSize="small" />
                                            <span>{post.views}</span>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box className="flex flex-wrap gap-1">
                                        {post.tags.slice(0, 3).map(tag => (
                                          <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            className="bg-white/5 text-white/60 border-white/10"
                                            variant="outlined"
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  </Link>
                                ))}
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </GlassCard>
              ))}
            </Box>
          )}

          {/* 分类视图 */}
          {viewMode === 'category' && (
            <Box className="space-y-8">
              {categories.map(category => (
                <GlassCard key={typeof category === 'object' ? category.id : category} className="p-8">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h4" className="text-white font-bold">
                      {typeof category === 'object' ? category.name : category}
                    </Typography>
                    <Chip
                      label={`${postsByCategory[typeof category === 'object' ? category.name : category]?.length || 0} 篇文章`}
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0"
                    />
                  </Box>
                  <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postsByCategory[typeof category === 'object' ? category.name : category]?.map(post => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <Box className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full">
                          <Typography variant="h6" className="text-white font-semibold mb-2">
                            {post.title}
                          </Typography>
                          <Typography variant="body2" className="text-white/70 mb-3 line-clamp-2">
                            {post.excerpt}
                          </Typography>
                          <Box className="flex items-center justify-between text-sm text-white/60 mb-2">
                            <span>{post.date}</span>
                            <Box className="flex items-center gap-1">
                              <Visibility fontSize="small" />
                              <span>{post.views}</span>
                            </Box>
                          </Box>
                          <Box className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                className="bg-white/5 text-white/60 border-white/10"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      </Link>
                    ))}
                  </Box>
                </GlassCard>
              ))}
            </Box>
          )}

          {/* 标签视图 */}
          {viewMode === 'tags' && (
            <Box className="space-y-8">
              {allTags.map(tag => (
                <GlassCard key={typeof tag === 'object' ? tag.id : tag} className="p-8">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h4" className="text-white font-bold">
                      #{typeof tag === 'object' ? tag.name : tag}
                    </Typography>
                    <Chip
                      label={`${postsByTag[typeof tag === 'object' ? tag.name : tag]?.length || 0} 篇文章`}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                    />
                  </Box>
                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {postsByTag[typeof tag === 'object' ? tag.name : tag]?.map(post => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <Box className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                          <Typography variant="h6" className="text-white font-semibold mb-2">
                            {post.title}
                          </Typography>
                          <Typography variant="body2" className="text-white/70 mb-3 line-clamp-2">
                            {post.excerpt}
                          </Typography>
                          <Box className="flex items-center justify-between text-sm text-white/60 mb-2">
                            <span>{post.date}</span>
                            <span>{post.category}</span>
                          </Box>
                          <Box className="flex flex-wrap gap-1">
                            {post.tags.filter(t => t !== tag).slice(0, 2).map(otherTag => (
                              <Chip
                                key={otherTag}
                                label={otherTag}
                                size="small"
                                className="bg-white/5 text-white/60 border-white/10"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      </Link>
                    ))}
                  </Box>
                </GlassCard>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
