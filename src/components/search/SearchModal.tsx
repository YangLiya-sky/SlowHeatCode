'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  TextField, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Search, Article, Close } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  createdAt: string;
  type: 'post' | 'project';
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 重置状态当模态框打开时
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      // 延迟聚焦以确保模态框完全打开
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      
      // 搜索文章
      const postsResponse = await fetch(`/api/posts?search=${encodeURIComponent(searchQuery)}&status=PUBLISHED&limit=10`);
      const postsData = await postsResponse.json();
      
      // 搜索项目
      const projectsResponse = await fetch(`/api/projects?search=${encodeURIComponent(searchQuery)}&limit=5`);
      const projectsData = await projectsResponse.json();

      const postResults: SearchResult[] = (postsData.posts || []).map((post: any) => ({
        ...post,
        type: 'post' as const
      }));

      const projectResults: SearchResult[] = (projectsData.projects || []).map((project: any) => ({
        ...project,
        type: 'project' as const
      }));

      setResults([...postResults, ...projectResults]);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const url = result.type === 'post' ? `/blog/${result.slug}` : `/projects/${result.slug}`;
    window.location.href = url;
    onClose();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'bg-transparent shadow-none'
      }}
      BackdropProps={{
        className: 'backdrop-blur-sm'
      }}
    >
      <DialogContent className="p-0">
        <GlassCard className="p-6">
          {/* 搜索输入框 */}
          <Box className="mb-4">
            <TextField
              ref={inputRef}
              fullWidth
              placeholder="搜索文章、项目..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-white/60" />
                  </InputAdornment>
                ),
                endAdornment: loading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} className="text-white/60" />
                  </InputAdornment>
                ) : null,
                className: "text-white",
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

          {/* 搜索结果 */}
          {query.length >= 2 && (
            <Box>
              {results.length > 0 ? (
                <>
                  <Typography variant="body2" className="text-white/70 mb-3">
                    找到 {results.length} 个结果
                  </Typography>
                  <List ref={listRef} className="max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <ListItem
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={`cursor-pointer rounded-lg mb-2 transition-all duration-200 ${
                          index === selectedIndex 
                            ? 'bg-white/20' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <Box className="w-full">
                          <Box className="flex items-center gap-2 mb-2">
                            <Article className="text-indigo-400" fontSize="small" />
                            <Chip
                              label={result.type === 'post' ? '文章' : '项目'}
                              size="small"
                              className={`${
                                result.type === 'post' 
                                  ? 'bg-blue-500/20 text-blue-300' 
                                  : 'bg-green-500/20 text-green-300'
                              }`}
                            />
                            {result.category && (
                              <Chip
                                label={result.category.name}
                                size="small"
                                className="bg-white/10 text-white/70"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          
                          <Typography variant="h6" className="text-white font-semibold mb-1">
                            {highlightText(result.title, query)}
                          </Typography>
                          
                          {result.excerpt && (
                            <Typography variant="body2" className="text-white/70 mb-2 line-clamp-2">
                              {highlightText(result.excerpt, query)}
                            </Typography>
                          )}

                          <Box className="flex items-center justify-between">
                            <Typography variant="caption" className="text-white/50">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </Typography>
                            
                            {result.tags && result.tags.length > 0 && (
                              <Box className="flex gap-1">
                                {result.tags.slice(0, 2).map((tag) => (
                                  <Chip
                                    key={tag.slug}
                                    label={tag.name}
                                    size="small"
                                    className="bg-white/5 text-white/60"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : !loading && (
                <Box className="text-center py-8">
                  <Typography variant="body1" className="text-white/70">
                    没有找到相关内容
                  </Typography>
                  <Typography variant="body2" className="text-white/50 mt-2">
                    尝试使用不同的关键词
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* 搜索提示 */}
          {query.length < 2 && (
            <Box className="text-center py-8">
              <Typography variant="body1" className="text-white/70">
                输入至少2个字符开始搜索
              </Typography>
              <Typography variant="body2" className="text-white/50 mt-2">
                支持搜索文章标题、内容和项目信息
              </Typography>
            </Box>
          )}

          {/* 快捷键提示 */}
          <Box className="mt-4 pt-4 border-t border-white/10">
            <Typography variant="caption" className="text-white/50">
              快捷键：↑↓ 选择，Enter 打开，Esc 关闭
            </Typography>
          </Box>
        </GlassCard>
      </DialogContent>
    </Dialog>
  );
}
