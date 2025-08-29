'use client';

import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, LinearProgress } from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
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
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = media.mimeType.startsWith('image/');

  return (
    <Box
      className="aspect-square rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer relative group overflow-hidden"
      onClick={() => onSelect?.(media)}
    >
      {isImage ? (
        <Image
          src={media.url}
          alt={media.alt || media.originalName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          loading="lazy"
        />
      ) : (
        <Box className="w-full h-full flex items-center justify-center">
          <ImageIcon className="text-white/40 text-4xl" />
        </Box>
      )}

      <Box className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          size="small"
          className="text-white/70 hover:text-red-400 bg-black/50 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(media.id);
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>

      <Box className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <Typography variant="caption" className="text-white/80 block truncate">
          {media.originalName}
        </Typography>
        <Typography variant="caption" className="text-white/60 block">
          {formatFileSize(media.size)}
        </Typography>
      </Box>
    </Box>
  );
};
