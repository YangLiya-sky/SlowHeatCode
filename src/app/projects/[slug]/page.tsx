'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Chip, Avatar, Divider, IconButton } from '@mui/material';
import { CalendarToday, AccessTime, Visibility, Share, GitHub, Launch, ArrowBack, Code, Work } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CommentSystem } from '@/components/blog/CommentSystem';
import Link from 'next/link';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      setLoading(true);
      const { slug } = await params;
      const response = await fetch(`/api/projects/slug/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else {
        setError('项目未找到');
      }
    } catch (error) {
      console.error('Load project error:', error);
      setError('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Box className="flex items-center justify-center min-h-[60vh]">
          <Box className="text-center">
            <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
            <Typography variant="h6" className="text-white/70">
              加载中...
            </Typography>
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box className="min-h-screen">
        <Navbar />
        <Box className="flex items-center justify-center min-h-[60vh]">
          <Box className="text-center">
            <Work className="text-white/30 mb-4" style={{ fontSize: 64 }} />
            <Typography variant="h6" className="text-white/70 mb-2">
              {error || '项目未找到'}
            </Typography>
            <Link href="/projects">
              <GlassButton variant="contained">
                返回项目列表
              </GlassButton>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }

  const technologies = project.technologies ? project.technologies.split(',') : [];

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* 项目详情 */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          {/* 返回按钮 */}
          <Box className="mb-8">
            <Link href="/projects">
              <GlassButton
                variant="outlined"
                startIcon={<ArrowBack />}
                className="mb-4"
              >
                返回项目列表
              </GlassButton>
            </Link>
          </Box>

          <GlassCard className="p-8 mb-8">
            {/* 项目头部 */}
            <Box className="mb-8">
              <Box className="flex items-center gap-2 mb-4">
                <Chip
                  label={project.category}
                  className="bg-white/10 text-white border-white/20"
                  variant="outlined"
                />
                <Chip
                  label={project.status}
                  className={`border-white/20 ${project.status === 'COMPLETED'
                    ? 'bg-green-500/20 text-green-300'
                    : project.status === 'ACTIVE'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  variant="outlined"
                />
                {project.featured && (
                  <Chip
                    label="精选"
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0"
                  />
                )}
              </Box>

              <Typography variant="h3" className="text-white font-bold mb-4">
                {project.title}
              </Typography>

              <Typography variant="h6" className="text-white/80 mb-6 leading-relaxed">
                {project.description}
              </Typography>

              {/* 项目信息 */}
              <Box className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-6">
                <Box className="flex items-center gap-1">
                  <CalendarToday fontSize="small" />
                  <span>开始时间: {new Date(project.startDate).toLocaleDateString()}</span>
                </Box>
                {project.endDate && (
                  <Box className="flex items-center gap-1">
                    <CalendarToday fontSize="small" />
                    <span>完成时间: {new Date(project.endDate).toLocaleDateString()}</span>
                  </Box>
                )}
                <Box className="flex items-center gap-1">
                  <Visibility fontSize="small" />
                  <span>{project.views || 0} 次浏览</span>
                </Box>
              </Box>

              {/* 技术栈 */}
              {technologies.length > 0 && (
                <Box className="mb-6">
                  <Typography variant="h6" className="text-white font-semibold mb-3">
                    技术栈
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {technologies.map((tech: string, index: number) => (
                      <Chip
                        key={index}
                        label={tech.trim()}
                        className="bg-white/10 text-white border-white/20"
                        variant="outlined"
                        icon={<Code className="text-white/60" />}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* 项目链接 */}
              <Box className="flex flex-wrap gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <GlassButton
                      variant="outlined"
                      startIcon={<GitHub />}
                    >
                      查看源码
                    </GlassButton>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <GlassButton
                      variant="contained"
                      startIcon={<Launch />}
                    >
                      在线预览
                    </GlassButton>
                  </a>
                )}
              </Box>
            </Box>

            <Divider className="border-white/20 my-8" />

            {/* 项目详细内容 */}
            <Box className="prose prose-invert max-w-none">
              <Typography variant="h5" className="text-white font-bold mb-6">
                项目详情
              </Typography>
              <Box
                className="text-white/80 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: project.content?.replace(/\n/g, '<br>') || '暂无详细描述'
                }}
              />
            </Box>
          </GlassCard>

          {/* 分享按钮 */}
          <Box className="text-center">
            <GlassButton
              variant="outlined"
              startIcon={<Share />}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: project.title,
                    text: project.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('链接已复制到剪贴板');
                }
              }}
            >
              分享项目
            </GlassButton>
          </Box>

          {/* 评论系统 */}
          <Container maxWidth="lg" className="mt-12">
            <CommentSystem postId={project.id} postType="project" />
          </Container>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
