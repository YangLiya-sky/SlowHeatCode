'use client';

import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, LinearProgress, Dialog, DialogContent, DialogTitle, Chip } from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon, Visibility, Close, Download, Info } from '@mui/icons-material';
import Image from 'next/image';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = 'image/*',
  maxSize = 5,
  multiple = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    // 检查文件类型
    if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
      alert('不支持的文件类型');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await onUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      setUploadProgress(0);
      alert('上传失败，请重试');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
        ${dragOver
          ? 'border-indigo-400 bg-indigo-500/10'
          : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
        }
        ${uploading ? 'pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {uploading ? (
        <Box className="space-y-4">
          <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></Box>
          <Typography variant="body1" className="text-white">
            上传中... {uploadProgress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#6366f1'
              }
            }}
          />
        </Box>
      ) : (
        <Box className="space-y-4">
          <CloudUpload className="text-white/60 text-6xl mx-auto" />
          <Box>
            <Typography variant="h6" className="text-white font-medium mb-2">
              点击上传或拖拽文件到此处
            </Typography>
            <Typography variant="body2" className="text-white/60">
              支持 {accept}，最大 {maxSize}MB
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

interface MediaPreviewProps {
  media: {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    alt?: string;
    size: number;
    mimeType: string;
    createdAt: string;
  };
  onDelete: (id: string) => void;
  onSelect?: (media: any) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  onDelete,
  onSelect
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
  const isVideo = media.mimeType.startsWith('video/');
  const isPDF = media.mimeType === 'application/pdf';

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="text-white/40 text-4xl" />;
    if (isVideo) return <div className="text-white/40 text-4xl">🎥</div>;
    if (isPDF) return <div className="text-white/40 text-4xl">📄</div>;
    return <div className="text-white/40 text-4xl">📁</div>;
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isImage || isVideo || isPDF) {
      setPreviewOpen(true);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <Box
        className="aspect-square rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer relative group overflow-hidden"
        onClick={() => onSelect?.(media)}
      >
        {isImage ? (
          <Box className="relative w-full h-full">
            <Image
              src={media.url}
              alt={media.alt || media.originalName}
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              sizes="(max-width: 768px) 50vw, 25vw"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && !imageError && (
              <Box className="absolute inset-0 flex items-center justify-center bg-white/5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40"></div>
              </Box>
            )}
            {imageError && (
              <Box className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/40 text-center">
                  <ImageIcon className="text-4xl mb-2" />
                  <Typography variant="caption">加载失败</Typography>
                </div>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="w-full h-full flex items-center justify-center">
            {getFileIcon()}
          </Box>
        )}

        {/* 文件类型标签 */}
        <Box className="absolute top-2 left-2">
          <Chip
            label={media.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
            size="small"
            className="bg-black/50 text-white/80 text-xs"
          />
        </Box>

        {/* 操作按钮组 */}
        <Box className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {(isImage || isVideo || isPDF) && (
            <IconButton
              size="small"
              className="text-white/70 hover:text-blue-400 bg-black/50 rounded"
              onClick={handlePreviewClick}
              title="预览"
            >
              <Visibility fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            className="text-white/70 hover:text-green-400 bg-black/50 rounded"
            onClick={handleDownload}
            title="下载"
          >
            <Download fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            className="text-white/70 hover:text-red-400 bg-black/50 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(media.id);
            }}
            title="删除"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        {/* 文件信息 */}
        <Box className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <Typography variant="caption" className="text-white/80 block truncate">
            {media.originalName}
          </Typography>
          <Box className="flex justify-between items-center">
            <Typography variant="caption" className="text-white/60">
              {formatFileSize(media.size)}
            </Typography>
            <Typography variant="caption" className="text-white/50">
              {formatDate(media.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 预览模态框 */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: "bg-black/90 backdrop-blur-md border border-white/10"
        }}
      >
        <DialogTitle className="flex justify-between items-center text-white">
          <Box>
            <Typography variant="h6">{media.originalName}</Typography>
            <Typography variant="caption" className="text-white/60">
              {media.mimeType} • {formatFileSize(media.size)} • {formatDate(media.createdAt)}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            className="text-white/70 hover:text-white"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-0">
          {isImage && (
            <Box className="relative w-full" style={{ minHeight: '400px' }}>
              <Image
                src={media.url}
                alt={media.alt || media.originalName}
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '70vh' }}
              />
            </Box>
          )}
          {isVideo && (
            <video
              controls
              className="w-full h-auto"
              style={{ maxHeight: '70vh' }}
            >
              <source src={media.url} type={media.mimeType} />
              您的浏览器不支持视频播放。
            </video>
          )}
          {isPDF && (
            <iframe
              src={media.url}
              className="w-full"
              style={{ height: '70vh' }}
              title={media.originalName}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
