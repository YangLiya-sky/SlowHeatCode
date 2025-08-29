'use client';

import React, { useRef, useState } from 'react';
import { Box, Button, Typography, Alert, LinearProgress } from '@mui/material';
import { CloudUpload, Description, CheckCircle, Error } from '@mui/icons-material';

interface MarkdownFileUploadProps {
  onFileContent: (content: string, filename: string) => void;
  disabled?: boolean;
}

export function MarkdownFileUpload({ onFileContent, disabled = false }: MarkdownFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // 检查文件类型
    const validExtensions = ['.md', '.markdown', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus('error');
      setUploadMessage('请选择 .md, .markdown 或 .txt 格式的文件');
      return;
    }

    // 检查文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setUploadMessage('文件大小不能超过 5MB');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setUploadMessage('');

    try {
      const content = await readFileContent(file);

      // 简单验证是否为有效的文本内容
      if (typeof content !== 'string') {
        throw new (Error as any)('文件内容格式不正确');
      }

      // 提取文件名（不含扩展名）作为可能的标题
      const filename = file.name.replace(/\.[^/.]+$/, '');

      onFileContent(content, filename);

      setUploadStatus('success');
      setUploadMessage(`成功导入文件：${file.name}`);

      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('error');
      setUploadMessage((error as any)?.message || String(error) || '文件读取失败');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          resolve(content);
        } else {
          reject(new (Error as any)('文件读取结果格式错误'));
        }
      };

      reader.onerror = () => {
        reject(new (Error as any)('文件读取失败'));
      };

      // 使用 UTF-8 编码读取文本文件
      reader.readAsText(file, 'UTF-8');
    });
  };

  return (
    <Box className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.markdown,.txt"
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        sx={{
          border: `2px dashed ${isDragOver ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
          borderRadius: 2,
          padding: 3,
          textAlign: 'center',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragOver
            ? 'rgba(99, 102, 241, 0.1)'
            : 'rgba(255, 255, 255, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: disabled || uploading
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.1)',
            borderColor: disabled || uploading
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.5)',
          },
        }}
      >
        <Box className="flex flex-col items-center gap-2">
          {uploading ? (
            <Description sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.5)' }} />
          ) : (
            <CloudUpload sx={{ fontSize: 48, color: isDragOver ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.5)' }} />
          )}

          <Typography variant="h6" className="text-white font-medium">
            {uploading ? '正在读取文件...' : isDragOver ? '释放文件以上传' : '导入 Markdown 文件'}
          </Typography>

          <Typography variant="body2" className="text-white/60">
            {uploading ? '请稍候...' : '点击选择文件或拖拽文件到此处'}
          </Typography>
        </Box>
      </Box>

      {uploading && (
        <Box className="mt-2">
          <LinearProgress
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
              },
            }}
          />
        </Box>
      )}

      {uploadStatus !== 'idle' && (
        <Box className="mt-2">
          <Alert
            severity={uploadStatus === 'success' ? 'success' : 'error'}
            icon={uploadStatus === 'success' ? <CheckCircle /> : <Error />}
            sx={{
              backgroundColor: uploadStatus === 'success'
                ? 'rgba(76, 175, 80, 0.1)'
                : 'rgba(244, 67, 54, 0.1)',
              color: uploadStatus === 'success'
                ? 'rgba(76, 175, 80, 0.9)'
                : 'rgba(244, 67, 54, 0.9)',
              border: `1px solid ${uploadStatus === 'success'
                ? 'rgba(76, 175, 80, 0.3)'
                : 'rgba(244, 67, 54, 0.3)'}`,
              '& .MuiAlert-icon': {
                color: uploadStatus === 'success'
                  ? 'rgba(76, 175, 80, 0.9)'
                  : 'rgba(244, 67, 54, 0.9)',
              },
            }}
          >
            {uploadMessage}
          </Alert>
        </Box>
      )}

      <Typography variant="caption" className="text-white/50 mt-2 block">
        支持 .md, .markdown, .txt 格式，最大 5MB
      </Typography>
    </Box>
  );
}

// 辅助函数：从Markdown内容中提取标题
export function extractTitleFromMarkdown(content: string): string {
  const lines = content.split('\n');

  // 查找第一个 # 标题
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim();
    }
  }

  // 查找第二级标题
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      return trimmed.substring(3).trim();
    }
  }

  // 如果没有找到标题，返回空字符串
  return '';
}

// 辅助函数：从Markdown内容中提取摘要
export function extractExcerptFromMarkdown(content: string, maxLength: number = 200): string {
  // 移除标题行
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim();
    return !trimmed.startsWith('#') && trimmed.length > 0;
  });

  // 合并非空行
  const text = lines.join(' ').trim();

  // 移除Markdown语法
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1')     // 斜体
    .replace(/`(.*?)`/g, '$1')       // 行内代码
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接
    .replace(/!\[.*?\]\(.*?\)/g, '')    // 图片
    .replace(/>/g, '')                  // 引用
    .trim();

  // 截取指定长度
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return cleanText.substring(0, maxLength).trim() + '...';
}
