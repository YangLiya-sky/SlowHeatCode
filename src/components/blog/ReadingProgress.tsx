'use client';

import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Fab, Tooltip } from '@mui/material';
import { KeyboardArrowUp, AccessTime, Visibility } from '@mui/icons-material';

interface ReadingProgressProps {
  contentRef?: React.RefObject<HTMLElement>;
  showBackToTop?: boolean;
  showReadingTime?: boolean;
  estimatedReadingTime?: number;
  className?: string;
}

export default function ReadingProgress({
  contentRef,
  showBackToTop = true,
  showReadingTime = true,
  estimatedReadingTime,
  className = ''
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      let scrollTop: number;
      let scrollHeight: number;
      let clientHeight: number;

      if (contentRef?.current) {
        // 基于特定内容元素计算
        const element = contentRef.current;
        const rect = element.getBoundingClientRect();
        const elementTop = window.pageYOffset + rect.top;
        const elementHeight = element.offsetHeight;
        
        scrollTop = Math.max(0, window.pageYOffset - elementTop);
        scrollHeight = elementHeight;
        clientHeight = window.innerHeight;
      } else {
        // 基于整个页面计算
        scrollTop = window.pageYOffset;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        clientHeight = window.innerHeight;
      }

      const scrolled = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(scrolled);

      // 显示/隐藏回到顶部按钮
      setIsVisible(scrollTop > 300);

      // 计算阅读时间
      if (estimatedReadingTime) {
        const timeSpent = (scrolled / 100) * estimatedReadingTime;
        setReadingTime(Math.round(timeSpent));
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // 初始计算
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [contentRef, estimatedReadingTime]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* 顶部进度条 */}
      <Box 
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
        sx={{ 
          transform: `translateY(${progress > 0 ? '0' : '-100%'})`,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b)',
              transition: 'transform 0.1s ease-out'
            }
          }}
        />
      </Box>

      {/* 侧边进度指示器 */}
      <Box
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40"
        sx={{
          opacity: progress > 5 ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <Box className="relative">
          {/* 进度圆环 */}
          <svg width="60" height="60" className="transform -rotate-90">
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
              fill="transparent"
            />
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.1s ease-out'
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* 进度百分比 */}
          <Box className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {Math.round(progress)}%
            </span>
          </Box>
        </Box>

        {/* 阅读时间指示 */}
        {showReadingTime && estimatedReadingTime && (
          <Tooltip title={`预计阅读时间: ${estimatedReadingTime} 分钟`} placement="left">
            <Box className="mt-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <AccessTime className="text-white/70 text-sm mb-1" />
              <Box className="text-white/70 text-xs">
                {readingTime}/{estimatedReadingTime}分钟
              </Box>
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* 回到顶部按钮 */}
      {showBackToTop && (
        <Fab
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40"
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            transition: 'all 0.3s ease-in-out',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #5855eb, #db2777)',
              transform: isVisible ? 'scale(1.1)' : 'scale(0)',
            }
          }}
          size="medium"
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </>
  );
}

// 计算阅读时间的工具函数
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // 移除HTML标签
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // 计算中文字符数（每个中文字符算作一个词）
  const chineseChars = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 计算英文单词数
  const englishWords = textContent
    .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  
  // 总词数（中文字符 + 英文单词）
  const totalWords = chineseChars + englishWords;
  
  // 计算阅读时间（分钟）
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}
