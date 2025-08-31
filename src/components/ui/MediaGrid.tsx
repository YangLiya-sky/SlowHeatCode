'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { Refresh, ViewModule, ViewList } from '@mui/icons-material';
import { MediaPreview } from './FileUpload';
import { useRealTimeMedia } from '@/lib/realTimeSync';

interface MediaGridProps {
  media: any[];
  onDeleteMedia: (id: string) => void;
  onSelectMedia?: (media: any) => void;
  showRealTimeStatus?: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media: initialMedia,
  onDeleteMedia,
  onSelectMedia,
  showRealTimeStatus = true
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localMedia, setLocalMedia] = useState(initialMedia);
  
  // 使用实时媒体数据
  const { data: realTimeMedia, connected: mediaConnected, refresh } = useRealTimeMedia();

  // 当实时数据更新时，更新本地状态
  useEffect(() => {
    if (realTimeMedia && Array.isArray(realTimeMedia)) {
      setLocalMedia(realTimeMedia);
    }
  }, [realTimeMedia]);

  // 当初始数据变化时，更新本地状态
  useEffect(() => {
    setLocalMedia(initialMedia);
  }, [initialMedia]);

  const handleRefresh = () => {
    refresh();
  };

  return (
    <Box className="space-y-4">
      {/* 工具栏 */}
      <Box className="flex items-center justify-between">
        <Typography variant="h6" className="text-white font-medium">
          媒体文件 ({localMedia.length})
        </Typography>
        
        <Box className="flex items-center gap-2">
          {/* 实时状态指示器 */}
          {showRealTimeStatus && (
            <Box className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
              mediaConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                mediaConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              {mediaConnected ? '实时预览' : '预览断开'}
            </Box>
          )}
          
          {/* 视图切换 */}
          <Box className="flex items-center bg-white/5 rounded-lg p-1">
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              className={`${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/60'}`}
            >
              <ViewModule fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              className={`${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60'}`}
            >
              <ViewList fontSize="small" />
            </IconButton>
          </Box>
          
          {/* 刷新按钮 */}
          <IconButton
            onClick={handleRefresh}
            className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
            title="刷新媒体列表"
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* 媒体网格/列表 */}
      {localMedia.length === 0 ? (
        <Box className="text-center py-12">
          <Typography variant="body1" className="text-white/60">
            暂无媒体文件
          </Typography>
        </Box>
      ) : (
        <Box className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-2"
        }>
          {localMedia.map((item) => (
            viewMode === 'grid' ? (
              <MediaPreview
                key={item.id}
                media={item}
                onDelete={onDeleteMedia}
                onSelect={onSelectMedia}
              />
            ) : (
              <MediaListItem
                key={item.id}
                media={item}
                onDelete={onDeleteMedia}
                onSelect={onSelectMedia}
              />
            )
          ))}
        </Box>
      )}

      {/* 实时预览功能说明 */}
      {showRealTimeStatus && mediaConnected && (
        <Box className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Typography variant="body2" className="text-blue-300">
            💡 实时预览已启用：文件上传、删除或修改时会自动更新显示，无需手动刷新页面。
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// 列表视图项组件
const MediaListItem: React.FC<{
  media: any;
  onDelete: (id: string) => void;
  onSelect?: (media: any) => void;
}> = ({ media, onDelete, onSelect }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isImage = media.mimeType.startsWith('image/');

  return (
    <Box 
      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
      onClick={() => onSelect?.(media)}
    >
      {/* 缩略图 */}
      <Box className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
        {isImage ? (
          <img 
            src={media.url} 
            alt={media.alt || media.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white/40 text-lg">📄</div>
        )}
      </Box>

      {/* 文件信息 */}
      <Box className="flex-1 min-w-0">
        <Typography variant="body1" className="text-white font-medium truncate">
          {media.originalName}
        </Typography>
        <Box className="flex items-center gap-2 mt-1">
          <Chip
            label={media.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
            size="small"
            className="bg-white/10 text-white/70 text-xs"
          />
          <Typography variant="caption" className="text-white/60">
            {formatFileSize(media.size)}
          </Typography>
          <Typography variant="caption" className="text-white/50">
            {formatDate(media.createdAt)}
          </Typography>
        </Box>
      </Box>

      {/* 操作按钮 */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(media.id);
        }}
        className="text-white/60 hover:text-red-400"
      >
        <span className="text-sm">🗑️</span>
      </IconButton>
    </Box>
  );
};
