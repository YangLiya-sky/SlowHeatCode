'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Divider } from '@mui/material';
import { MarkdownFileUpload, extractTitleFromMarkdown, extractExcerptFromMarkdown } from './MarkdownFileUpload';

// 动态导入Markdown编辑器，避免SSR问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Box className="w-full h-96 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
        <Box className="text-white/70">加载编辑器中...</Box>
      </Box>
    )
  }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  onFileImport?: (content: string, title: string, excerpt: string) => void;
  showFileUpload?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "请输入Markdown内容...",
  height = 400,
  onFileImport,
  showFileUpload = true
}: MarkdownEditorProps) {

  const handleFileContent = (content: string, filename: string) => {
    // 提取标题和摘要
    const title = extractTitleFromMarkdown(content) || filename;
    const excerpt = extractExcerptFromMarkdown(content);

    // 更新编辑器内容
    onChange(content);

    // 如果提供了回调函数，调用它来更新其他字段
    if (onFileImport) {
      onFileImport(content, title, excerpt);
    }
  };

  return (
    <Box className="w-full">
      {showFileUpload && (
        <Box className="mb-4">
          <Typography variant="body2" className="text-white/70 mb-2">
            快速导入
          </Typography>
          <MarkdownFileUpload
            onFileContent={handleFileContent}
            disabled={false}
          />
          <Divider className="border-white/10 mt-4" />
        </Box>
      )}

      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        placeholder={placeholder}
        data-color-mode="dark"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
          },
        }}
        preview="edit"
        hideToolbar={false}
      />

      <style jsx global>{`
        .w-md-editor {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
        }
        
        .w-md-editor-text-container,
        .w-md-editor-text,
        .w-md-editor-text-input,
        .w-md-editor-text-area {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
          border: none !important;
        }
        
        .w-md-editor-toolbar {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .w-md-editor-toolbar-item button {
          color: rgba(255, 255, 255, 0.7) !important;
          background-color: transparent !important;
        }
        
        .w-md-editor-toolbar-item button:hover {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .w-md-editor-preview {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        
        .w-md-editor-preview h1,
        .w-md-editor-preview h2,
        .w-md-editor-preview h3,
        .w-md-editor-preview h4,
        .w-md-editor-preview h5,
        .w-md-editor-preview h6 {
          color: white !important;
        }
        
        .w-md-editor-preview p {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .w-md-editor-preview code {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #a78bfa !important;
          padding: 2px 4px !important;
          border-radius: 4px !important;
        }
        
        .w-md-editor-preview pre {
          background-color: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .w-md-editor-preview blockquote {
          border-left: 4px solid rgba(99, 102, 241, 0.5) !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .w-md-editor-preview table {
          border-collapse: collapse !important;
        }
        
        .w-md-editor-preview table th,
        .w-md-editor-preview table td {
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .w-md-editor-preview table th {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .w-md-editor-preview a {
          color: #60a5fa !important;
        }
        
        .w-md-editor-preview a:hover {
          color: #93c5fd !important;
        }
      `}</style>
    </Box>
  );
}

// 预览组件
export function MarkdownPreview({ content }: { content: string }) {
  const MDPreview = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    {
      ssr: false,
      loading: () => (
        <Box className="w-full h-32 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
          <Box className="text-white/70">加载预览中...</Box>
        </Box>
      )
    }
  );

  return (
    <Box className="w-full">
      <MDPreview
        source={content}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
    </Box>
  );
}
