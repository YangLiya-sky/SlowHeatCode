'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CalendarToday, AccessTime, Visibility } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  views: number;
  likes: number;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  recommendationScore?: number;
  recommendationReasons?: string[];
}

interface RelatedPostsProps {
  currentPostId: string;
  limit?: number;
  className?: string;
}

export default function RelatedPosts({ 
  currentPostId, 
  limit = 3, 
  className = '' 
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/posts/${currentPostId}/related?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('获取相关文章失败');
        }

        const data = await response.json();
        
        if (data.success) {
          setRelatedPosts(data.data || []);
        } else {
          throw new Error(data.error || '获取相关文章失败');
        }
      } catch (err) {
        console.error('Fetch related posts error:', err);
        setError(err instanceof Error ? err.message : '获取相关文章失败');
      } finally {
        setLoading(false);
      }
    };

    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId, limit]);

  if (loading) {
    return (
      <Box className={`py-8 ${className}`}>
        <Typography variant="h5" className="text-white font-bold mb-6">
          相关文章
        </Typography>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <Box className="h-4 bg-white/20 rounded mb-3"></Box>
              <Box className="h-3 bg-white/10 rounded mb-2"></Box>
              <Box className="h-3 bg-white/10 rounded mb-4"></Box>
              <Box className="flex gap-2">
                <Box className="h-6 w-16 bg-white/10 rounded"></Box>
                <Box className="h-6 w-20 bg-white/10 rounded"></Box>
              </Box>
            </GlassCard>
          ))}
        </Box>
      </Box>
    );
  }

  if (error || relatedPosts.length === 0) {
    return null;
  }

  return (
    <Box className={`py-8 ${className}`}>
      <Typography variant="h5" className="text-white font-bold mb-6">
        相关文章
      </Typography>
      
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <GlassCard className="p-6 h-full glass-hover cursor-pointer group">
              {/* 推荐原因标签 */}
              {post.recommendationReasons && post.recommendationReasons.length > 0 && (
                <Box className="flex flex-wrap gap-1 mb-3">
                  {post.recommendationReasons.slice(0, 2).map((reason, index) => (
                    <Chip
                      key={index}
                      label={reason}
                      size="small"
                      className="bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-300 border-indigo-400/30"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}

              {/* 分类标签 */}
              {post.category && (
                <Box className="mb-3">
                  <Chip
                    label={post.category.name}
                    size="small"
                    className="bg-white/10 text-white border-white/20"
                    variant="outlined"
                  />
                </Box>
              )}

              {/* 文章标题 */}
              <Typography 
                variant="h6" 
                className="text-white font-semibold mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2"
              >
                {post.title}
              </Typography>

              {/* 文章摘要 */}
              {post.excerpt && (
                <Typography 
                  variant="body2" 
                  className="text-white/70 mb-4 leading-relaxed line-clamp-3"
                >
                  {post.excerpt}
                </Typography>
              )}

              {/* 文章元信息 */}
              <Box className="flex items-center justify-between text-sm text-white/60 mb-3">
                <Box className="flex items-center gap-1">
                  <CalendarToday fontSize="small" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </Box>
                <Box className="flex items-center gap-1">
                  <Visibility fontSize="small" />
                  <span>{post.views || 0}</span>
                </Box>
              </Box>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <Box className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      className="bg-white/5 text-white/60 border-white/10"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}

              {/* 推荐分数（开发模式下显示） */}
              {process.env.NODE_ENV === 'development' && post.recommendationScore && (
                <Box className="mt-2 text-xs text-white/40">
                  推荐分数: {post.recommendationScore}
                </Box>
              )}
            </GlassCard>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
