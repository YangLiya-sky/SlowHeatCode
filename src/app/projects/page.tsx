'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Chip, IconButton } from '@mui/material';
import { GitHub, Launch, Star } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useDataSync } from '@/lib/dataSync';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  // 使用数据同步
  const { data: syncedProjects } = useDataSync('projects');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects?limit=20');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Load projects error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['全部', 'Web应用', '移动应用', 'AI/ML', '开源工具'];
  const statusOptions = ['全部', 'COMPLETED', 'ACTIVE', 'DRAFT'];

  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === '全部' || project.category === selectedCategory;
    const statusMatch = selectedStatus === '全部' || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              项目作品集
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto mb-8">
              展示我的技术项目和创意作品，从Web应用到AI应用的完整开发历程
            </Typography>

            {/* 筛选器 */}
            <Box className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <GlassButton
                  key={category}
                  glassVariant={selectedCategory === category ? 'primary' : 'secondary'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </GlassButton>
              ))}
            </Box>

            <Box className="flex flex-wrap justify-center gap-4">
              {statusOptions.map((status) => (
                <GlassButton
                  key={status}
                  glassVariant={selectedStatus === status ? 'primary' : 'secondary'}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === 'COMPLETED' ? '已完成' : status === 'ACTIVE' ? '进行中' : status === 'DRAFT' ? '草稿' : status}
                </GlassButton>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 项目列表 */}
      <Box className="py-16 px-4 lg:px-8">
        <Container maxWidth="lg">
          {loading ? (
            <Box className="text-center py-12">
              <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
              <Typography variant="body1" className="text-white/70">
                加载中...
              </Typography>
            </Box>
          ) : (
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <GlassCard key={project.id} className="p-6 h-full glass-hover">
                  <Box className="flex items-center justify-between mb-4">
                    <Chip
                      label={project.status === 'COMPLETED' ? '已完成' : project.status === 'ACTIVE' ? '进行中' : '草稿'}
                      size="small"
                      className={`${
                        project.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      } border-0`}
                    />
                    {project.featured && (
                      <Star className="text-yellow-400" fontSize="small" />
                    )}
                  </Box>

                  <Typography variant="h6" className="text-white font-semibold mb-3">
                    {project.title}
                  </Typography>

                  <Typography variant="body2" className="text-white/70 mb-4 line-clamp-3">
                    {project.description}
                  </Typography>

                  {/* 技术栈 */}
                  {project.technologies && (
                    <Box className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.split(',').map((tech: string, index: number) => (
                        <Chip
                          key={index}
                          label={tech.trim()}
                          size="small"
                          className="bg-white/10 text-white/80 border-white/20"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}

                  {/* 项目链接 */}
                  <Box className="flex items-center gap-2 mt-auto">
                    {project.githubUrl && (
                      <IconButton
                        component="a"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white"
                        size="small"
                      >
                        <GitHub fontSize="small" />
                      </IconButton>
                    )}
                    {project.liveUrl && (
                      <IconButton
                        component="a"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white"
                        size="small"
                      >
                        <Launch fontSize="small" />
                      </IconButton>
                    )}
                    <Box className="flex items-center gap-1 ml-auto text-white/60">
                      <Star fontSize="small" />
                      <Typography variant="caption">
                        {project.views || 0}
                      </Typography>
                    </Box>
                  </Box>
                </GlassCard>
              ))}
            </Box>
          )}

          {!loading && filteredProjects.length === 0 && (
            <Box className="text-center py-12">
              <Typography variant="h6" className="text-white/70 mb-4">
                暂无项目
              </Typography>
              <Typography variant="body2" className="text-white/50">
                请尝试调整筛选条件
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
