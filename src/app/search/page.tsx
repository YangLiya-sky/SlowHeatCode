'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, TextField, InputAdornment, Chip, Pagination } from '@mui/material';
import { Search, CalendarToday, Visibility, FilterList, Clear, Comment, Article, Work } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({
    posts: [],
    projects: [],
    categories: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'projects'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const resultsPerPage = 10;

  // 热门搜索词
  const popularSearches = ['React', 'TypeScript', 'CSS', '性能优化', '微服务', '设计'];

  // 执行搜索
  const performSearch = async (query: string, type: 'all' | 'posts' | 'projects' = 'all') => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.search(query, type === 'all' ? undefined : type) as any;

      if (response.success) {
        setSearchResults(response.results);
        setTotalResults(response.total);

        // 添加到搜索历史
        const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索输入
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery, searchType);
      setCurrentPage(1);
    }
  };

  // 处理搜索类型切换
  const handleTypeChange = (type: 'all' | 'posts' | 'projects') => {
    setSearchType(type);
    if (searchQuery.trim()) {
      performSearch(searchQuery, type);
    }
  };

  // 快速搜索
  const quickSearch = (term: string) => {
    setSearchQuery(term);
    performSearch(term, searchType);
  };

  // 清空搜索
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ posts: [], projects: [], categories: [], tags: [] });
    setTotalResults(0);
    setCurrentPage(1);
  };

  // 加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 获取当前页面的结果
  const getCurrentPageResults = () => {
    const allResults = [
      ...searchResults.posts.map((item: any) => ({ ...item, type: 'post' })),
      ...searchResults.projects.map((item: any) => ({ ...item, type: 'project' })),
      ...searchResults.categories.map((item: any) => ({ ...item, type: 'category' })),
      ...searchResults.tags.map((item: any) => ({ ...item, type: 'tag' }))
    ];

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return allResults.slice(startIndex, endIndex);
  };

  const currentResults = getCurrentPageResults();
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              全站搜索
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto">
              搜索文章、项目、分类和标签，快速找到您需要的内容
            </Typography>
          </Box>

          {/* 搜索表单 */}
          <GlassCard className="p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入关键词搜索..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-white/60" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <Clear
                        className="text-white/60 cursor-pointer hover:text-white"
                        onClick={clearSearch}
                      />
                    </InputAdornment>
                  ),
                  className: "text-white"
                }}
                className="bg-white/5 rounded-lg"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                  }
                }}
              />

              {/* 搜索类型选择 */}
              <Box className="flex flex-wrap gap-2">
                <Chip
                  label="全部"
                  onClick={() => handleTypeChange('all')}
                  className={`cursor-pointer transition-all duration-300 ${searchType === 'all'
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  variant={searchType === 'all' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="文章"
                  onClick={() => handleTypeChange('posts')}
                  className={`cursor-pointer transition-all duration-300 ${searchType === 'posts'
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  variant={searchType === 'posts' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="项目"
                  onClick={() => handleTypeChange('projects')}
                  className={`cursor-pointer transition-all duration-300 ${searchType === 'projects'
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  variant={searchType === 'projects' ? 'filled' : 'outlined'}
                />
              </Box>

              <GlassButton
                type="submit"
                variant="contained"
                startIcon={<Search />}
                className="w-full sm:w-auto"
                disabled={!searchQuery.trim() || loading}
              >
                {loading ? '搜索中...' : '搜索'}
              </GlassButton>
            </form>
          </GlassCard>

          {/* 快速搜索和历史 */}
          {!searchQuery && (
            <Box className="space-y-6 mb-8">
              {/* 热门搜索 */}
              <GlassCard className="p-6">
                <Typography variant="h6" className="text-white font-semibold mb-4">
                  热门搜索
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Chip
                      key={term}
                      label={term}
                      onClick={() => quickSearch(term)}
                      className="bg-white/10 text-white border-white/20 cursor-pointer hover:bg-white/20"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </GlassCard>

              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <GlassCard className="p-6">
                  <Typography variant="h6" className="text-white font-semibold mb-4">
                    搜索历史
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Chip
                        key={index}
                        label={term}
                        onClick={() => quickSearch(term)}
                        className="bg-white/5 text-white/80 border-white/10 cursor-pointer hover:bg-white/15"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </GlassCard>
              )}
            </Box>
          )}

          {/* 搜索结果 */}
          {searchQuery && (
            <Box className="space-y-6">
              {/* 结果统计 */}
              <Box className="flex items-center justify-between">
                <Typography variant="h5" className="text-white font-bold">
                  搜索结果 ({totalResults} 个结果)
                </Typography>
                {searchQuery && (
                  <Typography variant="body2" className="text-white/60">
                    搜索关键词: "{searchQuery}"
                  </Typography>
                )}
              </Box>

              {loading ? (
                <Box className="text-center py-12">
                  <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
                  <Typography variant="body1" className="text-white/70">
                    搜索中...
                  </Typography>
                </Box>
              ) : currentResults.length > 0 ? (
                <>
                  {/* 搜索结果列表 */}
                  <Box className="space-y-4">
                    {currentResults.map((result: any) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={
                          result.type === 'post' ? `/blog/${result.slug || result.id}` :
                            result.type === 'project' ? `/projects/${result.slug || result.id}` :
                              result.type === 'category' ? `/blog?category=${result.slug}` :
                                `/blog?tag=${result.slug}`
                        }
                      >
                        <GlassCard className="p-6 glass-hover cursor-pointer">
                          <Box className="flex items-start gap-4">
                            {/* 类型图标 */}
                            <Box className="flex-shrink-0 mt-1">
                              {result.type === 'post' && <Article className="text-blue-400" />}
                              {result.type === 'project' && <Work className="text-green-400" />}
                              {result.type === 'category' && <FilterList className="text-purple-400" />}
                              {result.type === 'tag' && <Chip className="text-orange-400" />}
                            </Box>

                            <Box className="flex-1">
                              <Box className="flex items-center gap-2 mb-2">
                                <Chip
                                  label={
                                    result.type === 'post' ? '文章' :
                                      result.type === 'project' ? '项目' :
                                        result.type === 'category' ? '分类' : '标签'
                                  }
                                  size="small"
                                  className="bg-white/10 text-white border-white/20"
                                  variant="outlined"
                                />
                                {result.category && (
                                  <Chip
                                    label={result.category.name}
                                    size="small"
                                    className="bg-white/5 text-white/80 border-white/10"
                                    variant="outlined"
                                  />
                                )}
                              </Box>

                              <Typography variant="h6" className="text-white font-semibold mb-2">
                                {result.title || result.name}
                              </Typography>

                              <Typography variant="body2" className="text-white/70 mb-3 line-clamp-2">
                                {result.excerpt || result.description || `${result.postCount || 0} 篇文章`}
                              </Typography>

                              {(result.type === 'post' || result.type === 'project') && (
                                <Box className="flex items-center gap-4 text-sm text-white/60">
                                  {result.publishedAt && (
                                    <Box className="flex items-center gap-1">
                                      <CalendarToday fontSize="small" />
                                      <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
                                    </Box>
                                  )}
                                  {result.views !== undefined && (
                                    <Box className="flex items-center gap-1">
                                      <Visibility fontSize="small" />
                                      <span>{result.views}</span>
                                    </Box>
                                  )}
                                  {result._count?.comments !== undefined && (
                                    <Box className="flex items-center gap-1">
                                      <Comment fontSize="small" />
                                      <span>{result._count.comments}</span>
                                    </Box>
                                  )}
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </GlassCard>
                      </Link>
                    ))}
                  </Box>

                  {/* 分页 */}
                  {totalPages > 1 && (
                    <Box className="flex justify-center mt-8">
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => setCurrentPage(page)}
                        className="pagination-glass"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(255,255,255,0.2)',
                            }
                          }
                        }}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box className="text-center py-12">
                  <Search className="text-white/30 mb-4" style={{ fontSize: 64 }} />
                  <Typography variant="h6" className="text-white/70 mb-2">
                    未找到相关结果
                  </Typography>
                  <Typography variant="body2" className="text-white/50">
                    尝试使用不同的关键词或检查拼写
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
