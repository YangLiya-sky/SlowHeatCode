'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Container, TextField, InputAdornment, Chip, Pagination } from '@mui/material';
import { Search, CalendarToday, AccessTime, Visibility, FilterList, Clear, TrendingUp } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

// 模拟博客数据
const blogPosts = [
  {
    id: 1,
    title: '玻璃拟态设计趋势探索',
    excerpt: '深入探讨玻璃拟态设计在现代Web开发中的应用和最佳实践，包括设计原理、实现技巧和用户体验考量...',
    content: '玻璃拟态设计是一种现代的UI设计趋势，通过半透明效果和背景模糊来创造层次感...',
    date: '2024-01-15',
    readTime: '5 分钟阅读',
    views: 1250,
    tags: ['设计', 'CSS', 'UI/UX', '玻璃拟态'],
    category: '前端开发',
    author: '开发者'
  },
  {
    id: 2,
    title: 'React 18 新特性详解',
    excerpt: '全面解析React 18的并发特性、Suspense改进和新的Hooks，以及如何在实际项目中应用这些新功能...',
    content: 'React 18 引入了许多激动人心的新特性，包括并发渲染、自动批处理、新的Hooks等...',
    date: '2024-01-10',
    readTime: '8 分钟阅读',
    views: 2100,
    tags: ['React', 'JavaScript', '前端', 'Hooks'],
    category: '前端开发',
    author: '开发者'
  },
  {
    id: 3,
    title: 'TypeScript 最佳实践',
    excerpt: '分享在大型项目中使用TypeScript的经验和技巧，包括类型设计、代码组织和性能优化...',
    content: 'TypeScript 为JavaScript带来了静态类型检查，在大型项目中能够显著提高代码质量...',
    date: '2024-01-05',
    readTime: '6 分钟阅读',
    views: 1800,
    tags: ['TypeScript', 'JavaScript', '最佳实践', '类型安全'],
    category: '前端开发',
    author: '开发者'
  },
  {
    id: 4,
    title: 'Next.js 性能优化指南',
    excerpt: '详细介绍Next.js应用的性能优化策略，包括代码分割、图片优化、缓存策略等实用技巧...',
    content: 'Next.js 提供了许多内置的性能优化功能，包括自动代码分割、图片优化、静态生成等...',
    date: '2023-12-28',
    readTime: '10 分钟阅读',
    views: 3200,
    tags: ['Next.js', '性能优化', 'React', 'SSR'],
    category: '前端开发',
    author: '开发者'
  },
  {
    id: 5,
    title: '现代CSS布局技术',
    excerpt: '探索CSS Grid、Flexbox和Container Queries等现代布局技术，以及它们在响应式设计中的应用...',
    content: '现代CSS提供了强大的布局工具，包括Flexbox、Grid和最新的Container Queries...',
    date: '2023-12-20',
    readTime: '7 分钟阅读',
    views: 1650,
    tags: ['CSS', '布局', '响应式设计', 'Grid', 'Flexbox'],
    category: '前端开发',
    author: '开发者'
  },
  {
    id: 6,
    title: 'Node.js 微服务架构实践',
    excerpt: '分享Node.js微服务架构的设计和实现经验，包括服务拆分、通信机制和部署策略...',
    content: '微服务架构是现代应用开发的重要模式，Node.js为构建微服务提供了良好的基础...',
    date: '2023-11-15',
    readTime: '12 分钟阅读',
    views: 2800,
    tags: ['Node.js', '微服务', '后端', '架构设计'],
    category: '后端开发',
    author: '开发者'
  }
];

const categories = Array.from(new Set(blogPosts.map(post => post.category)));
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

// 热门搜索词
const popularSearches = ['React', 'TypeScript', 'CSS', '性能优化', '微服务', '设计'];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const postsPerPage = 6;

  // 从localStorage加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 保存搜索历史
  const saveSearchHistory = (term: string) => {
    if (term.trim() && !searchHistory.includes(term)) {
      const newHistory = [term, ...searchHistory.slice(0, 9)]; // 保留最近10个搜索
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  // 搜索逻辑
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  // 分页
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // 处理搜索
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (term.trim()) {
      saveSearchHistory(term);
    }
  };

  // 清除所有筛选
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  return (
    <Box className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              搜索文章
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto mb-8">
              在这里搜索您感兴趣的技术文章和教程
            </Typography>
            
            {/* 主搜索框 */}
            <Box className="max-w-2xl mx-auto mb-8">
              <TextField
                fullWidth
                placeholder="搜索文章标题、内容或标签..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-white/60" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <Clear 
                        className="text-white/60 cursor-pointer hover:text-white"
                        onClick={() => handleSearch('')}
                      />
                    </InputAdornment>
                  ),
                  className: "glass text-white text-lg",
                  style: { color: 'white', fontSize: '1.1rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(99, 102, 241, 0.8)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  }
                }}
              />
            </Box>

            {/* 搜索统计 */}
            {searchTerm && (
              <Typography variant="body1" className="text-white/70 mb-4">
                找到 <span className="text-indigo-400 font-semibold">{filteredPosts.length}</span> 篇相关文章
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* 筛选器和快捷搜索 */}
      <Box className="py-8 px-4 lg:px-8">
        <Container maxWidth="lg">
          <GlassCard className="p-6 mb-8">
            {/* 筛选器标题 */}
            <Box className="flex items-center justify-between mb-6">
              <Box className="flex items-center gap-2">
                <FilterList className="text-white" />
                <Typography variant="h6" className="text-white font-semibold">
                  筛选条件
                </Typography>
              </Box>
              {(selectedCategory || selectedTags.length > 0 || searchTerm) && (
                <GlassButton glassVariant="ghost" size="small" onClick={clearAllFilters}>
                  <Clear className="mr-1" fontSize="small" />
                  清除筛选
                </GlassButton>
              )}
            </Box>

            {/* 分类筛选 */}
            <Box className="mb-6">
              <Typography variant="body2" className="text-white/70 mb-3">
                按分类筛选
              </Typography>
              <Box className="flex flex-wrap gap-2">
                <Chip
                  label="全部分类"
                  onClick={() => setSelectedCategory('')}
                  className={`cursor-pointer transition-all duration-300 ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                  variant={!selectedCategory ? 'filled' : 'outlined'}
                />
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* 标签筛选 */}
            <Box className="mb-6">
              <Typography variant="body2" className="text-white/70 mb-3">
                按标签筛选 (可多选)
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => toggleTag(tag)}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* 热门搜索 */}
            {!searchTerm && (
              <Box>
                <Typography variant="body2" className="text-white/70 mb-3 flex items-center">
                  <TrendingUp className="mr-1" fontSize="small" />
                  热门搜索
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Chip
                      key={term}
                      label={term}
                      onClick={() => handleSearch(term)}
                      className="cursor-pointer bg-white/5 text-white/80 border-white/10 hover:bg-white/10 transition-all duration-300"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* 搜索历史 */}
            {!searchTerm && searchHistory.length > 0 && (
              <Box className="mt-6">
                <Typography variant="body2" className="text-white/70 mb-3">
                  最近搜索
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 5).map((term, index) => (
                    <Chip
                      key={index}
                      label={term}
                      onClick={() => handleSearch(term)}
                      className="cursor-pointer bg-white/5 text-white/70 border-white/10 hover:bg-white/10 transition-all duration-300"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </GlassCard>
        </Container>
      </Box>

      {/* 搜索结果 */}
      <Box className="py-12 px-4 lg:px-8">
        <Container maxWidth="lg">
          {currentPosts.length > 0 ? (
            <>
              <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <GlassCard className="p-6 h-full glass-hover cursor-pointer">
                      <Box className="flex items-center gap-2 mb-3">
                        <Chip
                          label={post.category}
                          size="small"
                          className="bg-white/10 text-white border-white/20"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="h6" className="text-white font-semibold mb-3">
                        {post.title}
                      </Typography>
                      <Typography variant="body2" className="text-white/70 mb-4 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </Typography>
                      <Box className="flex items-center justify-between text-sm text-white/60 mb-3">
                        <Box className="flex items-center gap-1">
                          <CalendarToday fontSize="small" />
                          <span>{post.date}</span>
                        </Box>
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
                        {post.tags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            className={`${
                              selectedTags.includes(tag)
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-white/5 text-white/60 border-white/10'
                            }`}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </GlassCard>
                  </Link>
                ))}
              </Box>

              {/* 分页 */}
              {totalPages > 1 && (
                <Box className="flex justify-center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                          color: 'white',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box className="text-center py-12">
              <Search className="text-6xl text-white/30 mb-4" />
              <Typography variant="h5" className="text-white/70 mb-4">
                {searchTerm ? '没有找到相关文章' : '开始搜索文章'}
              </Typography>
              <Typography variant="body1" className="text-white/50 mb-6">
                {searchTerm 
                  ? '尝试使用不同的关键词或调整筛选条件'
                  : '在上方搜索框中输入关键词来查找文章'
                }
              </Typography>
              {searchTerm && (
                <GlassButton glassVariant="outline" onClick={clearAllFilters}>
                  清除所有筛选条件
                </GlassButton>
              )}
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
