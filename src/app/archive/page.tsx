'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, Chip } from '@mui/material';
import { CalendarToday, Visibility, Comment, Article } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useArchive } from '@/hooks/useDataSync';
import Link from 'next/link';

export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  // 获取归档数据
  const { data: archiveData, loading } = useArchive(selectedYear, selectedMonth);

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const handleYearSelect = (year: number) => {
    setSelectedYear(year === selectedYear ? undefined : year);
    setSelectedMonth(undefined);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month === selectedMonth ? undefined : month);
  };

  const resetFilter = () => {
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
  };

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
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto">
              按时间浏览所有已发布的文章，探索不同时期的技术见解和思考
            </Typography>
          </Box>

          {loading ? (
            <Box className="text-center py-12">
              <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
              <Typography variant="body1" className="text-white/70">
                加载中...
              </Typography>
            </Box>
          ) : (
            <Box className="space-y-8">
              {/* 筛选器 */}
              <GlassCard className="p-6">
                <Typography variant="h6" className="text-white font-semibold mb-4">
                  时间筛选
                </Typography>
                
                {selectedYear || selectedMonth ? (
                  <Box className="mb-4">
                    <Chip
                      label="重置筛选"
                      onClick={resetFilter}
                      className="bg-red-500/20 text-red-300 border-red-500/30 cursor-pointer"
                      variant="outlined"
                    />
                  </Box>
                ) : null}

                {!selectedYear && !selectedMonth && (archiveData as any)?.archive ? (
                  // 显示归档概览
                  <Box className="space-y-4">
                    {Object.entries(
                      (archiveData as any).archive.reduce((acc: any, item: any) => {
                        if (!acc[item.year]) acc[item.year] = [];
                        acc[item.year].push(item);
                        return acc;
                      }, {})
                    ).map(([year, months]: [string, any]) => (
                      <Box key={year} className="space-y-2">
                        <Chip
                          label={`${year}年 (${months.reduce((sum: number, m: any) => sum + m.count, 0)}篇)`}
                          onClick={() => handleYearSelect(parseInt(year))}
                          className="bg-white/10 text-white border-white/20 cursor-pointer hover:bg-white/20"
                          variant="outlined"
                        />
                        <Box className="flex flex-wrap gap-2 ml-4">
                          {months.map((month: any) => (
                            <Chip
                              key={`${year}-${month.month}`}
                              label={`${monthNames[month.month - 1]} (${month.count})`}
                              onClick={() => {
                                setSelectedYear(parseInt(year));
                                handleMonthSelect(month.month);
                              }}
                              size="small"
                              className="bg-white/5 text-white/80 border-white/10 cursor-pointer hover:bg-white/15"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </GlassCard>

              {/* 文章列表 */}
              {(archiveData as any)?.posts && (
                <Box className="space-y-6">
                  <Typography variant="h5" className="text-white font-bold">
                    {selectedYear && selectedMonth 
                      ? `${selectedYear}年${monthNames[selectedMonth - 1]}的文章`
                      : selectedYear 
                      ? `${selectedYear}年的文章`
                      : '所有文章'
                    } ({(archiveData as any).posts.length}篇)
                  </Typography>

                  <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(archiveData as any).posts.map((post: any) => (
                      <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                        <GlassCard className="p-6 h-full glass-hover cursor-pointer">
                          <Box className="flex items-center gap-2 mb-3">
                            <Chip
                              label={post.category?.name || '未分类'}
                              size="small"
                              className="bg-white/10 text-white border-white/20"
                              variant="outlined"
                            />
                            {post.featured && (
                              <Chip
                                label="精选"
                                size="small"
                                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0"
                              />
                            )}
                          </Box>

                          <Typography variant="h6" className="text-white font-semibold mb-3">
                            {post.title}
                          </Typography>

                          <Typography variant="body2" className="text-white/70 mb-4 line-clamp-3">
                            {post.excerpt || (post.content?.substring(0, 100) || '') + '...'}
                          </Typography>

                          <Box className="flex items-center justify-between text-sm text-white/60 mb-3">
                            <Box className="flex items-center gap-1">
                              <CalendarToday fontSize="small" />
                              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                            </Box>
                            <Box className="flex items-center gap-3">
                              <Box className="flex items-center gap-1">
                                <Visibility fontSize="small" />
                                <span>{post.views || 0}</span>
                              </Box>
                              <Box className="flex items-center gap-1">
                                <Comment fontSize="small" />
                                <span>{post._count?.comments || 0}</span>
                              </Box>
                            </Box>
                          </Box>

                          <Box className="flex flex-wrap gap-1">
                            {(post.tags || []).slice(0, 3).map((tag: any) => (
                              <Chip
                                key={tag.id}
                                label={tag.name}
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
                </Box>
              )}

              {(archiveData as any)?.posts && (archiveData as any).posts.length === 0 && (
                <Box className="text-center py-12">
                  <Article className="text-white/30 mb-4" style={{ fontSize: 64 }} />
                  <Typography variant="h6" className="text-white/70 mb-2">
                    暂无文章
                  </Typography>
                  <Typography variant="body2" className="text-white/50">
                    该时间段内还没有发布任何文章
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
