'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Container, Chip, TextField, InputAdornment, Pagination } from '@mui/material';
import { Search, CalendarToday, AccessTime, Visibility, Tag } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { usePosts, useCategories } from '@/hooks/useDataSync';
import Link from 'next/link';


export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // 使用数据同步Hooks
  const { data: postsData, loading, refresh: refreshPosts } = usePosts({
    page: currentPage,
    limit: postsPerPage,
    category: selectedCategory || undefined,
    status: 'PUBLISHED'
  });
  const { data: categoriesData } = useCategories();

  // 从API数据中提取posts和categories
  const posts = (postsData as any)?.posts || [];
  const totalPages = Math.ceil(((postsData as any)?.total || 0) / postsPerPage);
  const categories = (categoriesData as any)?.categories || [];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // 客户端过滤（用于搜索）
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;

    return posts.filter((post: any) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [posts, searchTerm]);

  // 精选文章
  const featuredPosts = posts.filter((post: any) => post.featured);

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              技术博客
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto mb-8">
              分享技术见解、开发经验和行业思考
            </Typography>

            {/* 搜索框 */}
            <Box className="max-w-md mx-auto">
              <TextField
                fullWidth
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-white/60" />
                    </InputAdornment>
                  ),
                  className: "glass text-white",
                  style: { color: 'white' }
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
          </Box>

          {/* 精选文章 */}
          {featuredPosts.length > 0 && (
            <Box className="mb-16">
              <Typography variant="h4" className="text-white font-bold mb-8 text-center">
                精选文章
              </Typography>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                    <GlassCard className="p-8 h-full glass-hover cursor-pointer">
                      <Box className="flex items-center gap-2 mb-4">
                        <Chip
                          label="精选"
                          size="small"
                          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0"
                        />
                        <Chip
                          label={post.category?.name || '未分类'}
                          size="small"
                          className="bg-white/10 text-white border-white/20"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="h5" className="text-white font-bold mb-3">
                        {post.title}
                      </Typography>
                      <Typography variant="body1" className="text-white/80 mb-4 leading-relaxed">
                        {post.excerpt || (post.content?.substring(0, 150) || '') + '...'}
                      </Typography>
                      <Box className="flex items-center justify-between text-sm text-white/60 mb-4">
                        <Box className="flex items-center gap-4">
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
                      <Box className="flex flex-wrap gap-2">
                        {post.tags?.map((tag: any) => (
                          <Chip
                            key={tag.id || tag.name || tag}
                            label={tag.name || tag}
                            size="small"
                            className="bg-white/5 text-white/70 border-white/10"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </GlassCard>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* 过滤器和文章列表 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          {/* 分类过滤器 */}
          <Box className="mb-8">
            <Typography variant="h6" className="text-white font-semibold mb-4">
              分类筛选
            </Typography>
            <Box className="flex flex-wrap gap-2">
              <Chip
                label="全部"
                onClick={() => handleCategoryFilter('')}
                className={`cursor-pointer transition-all duration-300 ${selectedCategory === ''
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                variant={selectedCategory === '' ? 'filled' : 'outlined'}
              />
              {categories.map((category: any) => {
                const categoryName = category.name || category;
                const categorySlug = category.slug || category;
                return (
                  <Chip
                    key={category.id || categorySlug}
                    label={categoryName}
                    onClick={() => handleCategoryFilter(categorySlug)}
                    className={`cursor-pointer transition-all duration-300 ${selectedCategory === categorySlug
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    variant={selectedCategory === categorySlug ? 'filled' : 'outlined'}
                  />
                );
              })}
            </Box>
          </Box>

          {/* 文章列表 */}
          {loading ? (
            <Box className="text-center py-12">
              <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
              <Typography variant="body1" className="text-white/70">
                加载中...
              </Typography>
            </Box>
          ) : (
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                  <GlassCard className="p-6 h-full glass-hover cursor-pointer">
                    <Box className="flex items-center gap-2 mb-3">
                      <Chip
                        label={post.category?.name || '未分类'}
                        size="small"
                        className="bg-white/10 text-white border-white/20"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" className="text-white font-semibold mb-3">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" className="text-white/70 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt || (post.content?.substring(0, 100) || '') + '...'}
                    </Typography>
                    <Box className="flex items-center justify-between text-sm text-white/60 mb-3">
                      <Box className="flex items-center gap-1">
                        <CalendarToday fontSize="small" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <AccessTime fontSize="small" />
                        <span>{Math.ceil((post.content?.length || 0) / 500)} 分钟阅读</span>
                      </Box>
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
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <Box className="flex justify-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
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
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
