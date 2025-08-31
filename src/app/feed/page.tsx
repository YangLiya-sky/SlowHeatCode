'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, IconButton, Tooltip } from '@mui/material';
import { RssFeed, ContentCopy, OpenInNew, Refresh } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';

export default function FeedPage() {
  const [copied, setCopied] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');

  useEffect(() => {
    // 获取当前域名
    const currentUrl = window.location.origin;
    setFeedUrl(`${currentUrl}/api/rss`);
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleOpenFeed = () => {
    window.open(feedUrl, '_blank');
  };

  const rssReaders = [
    {
      name: 'Feedly',
      url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(feedUrl)}`,
      description: '最受欢迎的RSS阅读器之一',
      color: '#2bb24c'
    },
    {
      name: 'Inoreader',
      url: `https://www.inoreader.com/feed/${encodeURIComponent(feedUrl)}`,
      description: '功能强大的RSS阅读器',
      color: '#007acc'
    },
    {
      name: 'NewsBlur',
      url: `https://newsblur.com/?url=${encodeURIComponent(feedUrl)}`,
      description: '智能RSS阅读器',
      color: '#505050'
    },
    {
      name: 'The Old Reader',
      url: `https://theoldreader.com/feeds/subscribe?url=${encodeURIComponent(feedUrl)}`,
      description: '经典的RSS阅读体验',
      color: '#d73502'
    }
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <Box className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <Box className="text-center mb-12">
          <Box className="flex items-center justify-center gap-4 mb-4">
            <RssFeed className="text-orange-400 text-5xl" />
            <Typography variant="h2" className="text-white font-bold">
              RSS 订阅
            </Typography>
          </Box>
          <Typography variant="h6" className="text-white/80 max-w-2xl mx-auto">
            通过RSS订阅获取本站最新文章更新，支持各种RSS阅读器
          </Typography>
        </Box>

        {/* RSS URL 卡片 */}
        <GlassCard className="p-8 mb-8">
          <Typography variant="h5" className="text-white font-semibold mb-4 flex items-center gap-2">
            <RssFeed className="text-orange-400" />
            RSS 订阅地址
          </Typography>

          <Box className="bg-black/20 rounded-lg p-4 mb-4 border border-white/10">
            <Box className="flex items-center gap-2">
              <Typography
                variant="body1"
                className="text-white font-mono flex-1 break-all"
              >
                {feedUrl}
              </Typography>
              <Tooltip title={copied ? "已复制!" : "复制链接"}>
                <IconButton
                  onClick={handleCopyUrl}
                  className="text-white/70 hover:text-white"
                  size="small"
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="在新窗口打开">
                <IconButton
                  onClick={handleOpenFeed}
                  className="text-white/70 hover:text-white"
                  size="small"
                >
                  <OpenInNew />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="body2" className="text-white/70">
            将此URL添加到您的RSS阅读器中，即可订阅本站的最新文章更新。
          </Typography>
        </GlassCard>

        {/* 快速订阅 */}
        <GlassCard className="p-8 mb-8">
          <Typography variant="h5" className="text-white font-semibold mb-6">
            快速订阅
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rssReaders.map((reader) => (
              <Card
                key={reader.name}
                className="bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => window.open(reader.url, '_blank')}
              >
                <CardContent className="p-4">
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="h6" className="text-white font-semibold">
                      {reader.name}
                    </Typography>
                    <Chip
                      label="订阅"
                      size="small"
                      style={{ backgroundColor: reader.color, color: 'white' }}
                    />
                  </Box>
                  <Typography variant="body2" className="text-white/70">
                    {reader.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </GlassCard>

        {/* RSS 说明 */}
        <GlassCard className="p-8">
          <Typography variant="h5" className="text-white font-semibold mb-6">
            什么是 RSS？
          </Typography>

          <Box className="space-y-4">
            <Typography variant="body1" className="text-white/80">
              RSS（Really Simple Syndication）是一种用于发布经常更新内容的标准化格式。
              通过RSS订阅，您可以：
            </Typography>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Box>
                <Typography variant="h6" className="text-white font-semibold mb-2">
                  📱 统一管理
                </Typography>
                <Typography variant="body2" className="text-white/70">
                  在一个RSS阅读器中订阅多个网站，统一查看所有更新
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" className="text-white font-semibold mb-2">
                  🔔 及时通知
                </Typography>
                <Typography variant="body2" className="text-white/70">
                  网站有新内容时第一时间收到通知，不错过任何更新
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" className="text-white font-semibold mb-2">
                  🚫 无广告干扰
                </Typography>
                <Typography variant="body2" className="text-white/70">
                  纯净的阅读体验，专注于内容本身
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" className="text-white font-semibold mb-2">
                  📚 离线阅读
                </Typography>
                <Typography variant="body2" className="text-white/70">
                  大多数RSS阅读器支持离线下载，随时随地阅读
                </Typography>
              </Box>
            </Box>
          </Box>
        </GlassCard>
      </Box>
    </Box>
  );
}
