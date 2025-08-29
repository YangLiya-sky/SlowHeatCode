'use client';

import React from 'react';
import { Box, Typography, Container, Avatar, Chip, LinearProgress } from '@mui/material';
import { Work, Code, Favorite, Timeline, EmojiEvents } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const skills = [
  { name: 'React', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Next.js', level: 88 },
  { name: 'Node.js', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'UI/UX Design', level: 75 },
];

const experiences = [
  {
    title: '高级前端工程师',
    company: '科技公司',
    period: '2022 - 至今',
    description: '负责大型Web应用的前端架构设计和开发，带领团队完成多个重要项目。'
  },
  {
    title: '全栈开发工程师',
    company: '创业公司',
    period: '2020 - 2022',
    description: '独立负责产品的前后端开发，从零到一构建了完整的SaaS平台。'
  },
  {
    title: '前端开发实习生',
    company: '互联网公司',
    period: '2019 - 2020',
    description: '参与多个项目的前端开发工作，快速学习和掌握现代前端技术栈。'
  }
];

const achievements = [
  '开源项目获得 1000+ GitHub Stars',
  '技术博客累计阅读量超过 10万',
  '参与开发的产品服务用户超过 50万',
  '获得公司年度最佳员工奖'
];

export default function AboutPage() {
  return (
    <Box className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              关于我
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto">
              一名充满热情的全栈开发者，致力于创造优雅、高效的数字体验
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 个人信息卡片 */}
            <Box className="lg:col-span-1">
              <GlassCard className="p-8 text-center">
                <Avatar
                  sx={{ width: 150, height: 150 }}
                  className="mx-auto mb-6 border-4 border-white/20"
                  src="/api/placeholder/150/150"
                  alt="Profile"
                />
                <Typography variant="h5" className="text-white font-bold mb-2">
                  开发者
                </Typography>
                <Typography variant="body1" className="text-white/70 mb-4">
                  全栈开发工程师
                </Typography>
                <Typography variant="body2" className="text-white/60 mb-6 leading-relaxed">
                  专注于现代Web技术，热爱开源，喜欢分享技术见解和开发经验。
                </Typography>
                <Box className="flex flex-wrap gap-2 justify-center">
                  {['React', 'TypeScript', 'Next.js', 'Node.js'].map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      className="bg-white/10 text-white border-white/20"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </GlassCard>
            </Box>

            {/* 详细介绍 */}
            <Box className="lg:col-span-2 space-y-8">
              {/* 个人简介 */}
              <GlassCard className="p-8">
                <Box className="flex items-center mb-6">
                  <Favorite className="text-pink-400 mr-3 text-2xl" />
                  <Typography variant="h5" className="text-white font-semibold">
                    我的故事
                  </Typography>
                </Box>
                <Typography variant="body1" className="text-white/80 leading-relaxed mb-4">
                  我是一名充满激情的全栈开发者，拥有5年的Web开发经验。从大学时期接触编程开始，
                  我就被代码的魅力深深吸引。我相信技术可以改变世界，每一行代码都有其存在的意义。
                </Typography>
                <Typography variant="body1" className="text-white/80 leading-relaxed mb-4">
                  在我的职业生涯中，我参与了从小型创业公司到大型企业的各种项目。这些经历让我不仅
                  掌握了扎实的技术技能，更重要的是学会了如何与团队协作，如何理解用户需求，
                  以及如何在技术和商业之间找到平衡。
                </Typography>
                <Typography variant="body1" className="text-white/80 leading-relaxed">
                  除了编程，我还热爱设计、摄影和旅行。我相信多元化的兴趣爱好能够为我的工作
                  带来更多的创意和灵感。
                </Typography>
              </GlassCard>

              {/* 技能水平 */}
              <GlassCard className="p-8">
                <Box className="flex items-center mb-6">
                  <Code className="text-indigo-400 mr-3 text-2xl" />
                  <Typography variant="h5" className="text-white font-semibold">
                    技能水平
                  </Typography>
                </Box>
                <Box className="space-y-4">
                  {skills.map((skill) => (
                    <Box key={skill.name}>
                      <Box className="flex justify-between items-center mb-2">
                        <Typography variant="body2" className="text-white font-medium">
                          {skill.name}
                        </Typography>
                        <Typography variant="body2" className="text-white/70">
                          {skill.level}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.level}
                        className="h-2 rounded-full bg-white/10"
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                            borderRadius: '4px',
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </GlassCard>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 工作经历 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <Box className="flex items-center justify-center mb-4">
              <Work className="text-indigo-400 mr-3 text-3xl" />
              <Typography variant="h3" className="text-white font-bold">
                工作经历
              </Typography>
            </Box>
            <Typography variant="h6" className="text-white/70">
              我的职业发展历程
            </Typography>
          </Box>

          <Box className="space-y-6">
            {experiences.map((exp, index) => (
              <GlassCard key={index} className="p-8 glass-hover">
                <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <Box>
                    <Typography variant="h6" className="text-white font-semibold mb-1">
                      {exp.title}
                    </Typography>
                    <Typography variant="body1" className="text-indigo-400 font-medium">
                      {exp.company}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="text-white/60 mt-2 md:mt-0">
                    {exp.period}
                  </Typography>
                </Box>
                <Typography variant="body1" className="text-white/80 leading-relaxed">
                  {exp.description}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 成就展示 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <Box className="flex items-center justify-center mb-4">
              <EmojiEvents className="text-yellow-400 mr-3 text-3xl" />
              <Typography variant="h3" className="text-white font-bold">
                主要成就
              </Typography>
            </Box>
            <Typography variant="h6" className="text-white/70">
              一些值得分享的里程碑
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <GlassCard key={index} className="p-6 glass-hover">
                <Box className="flex items-start">
                  <EmojiEvents className="text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                  <Typography variant="body1" className="text-white/80 leading-relaxed">
                    {achievement}
                  </Typography>
                </Box>
              </GlassCard>
            ))}
          </Box>

          <Box className="text-center mt-12">
            <GlassButton glassVariant="primary" size="large">
              <Timeline className="mr-2" />
              查看我的项目
            </GlassButton>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
