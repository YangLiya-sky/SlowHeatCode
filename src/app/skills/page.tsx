'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, LinearProgress, Chip } from '@mui/material';
import { Code, Palette, Storage, Cloud, Security, Speed, School, EmojiEvents, TrendingUp } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const skillCategories = [
  {
    id: 'frontend',
    name: '前端开发',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', level: 95, experience: '4年', description: '熟练掌握React生态系统，包括Hooks、Context、Redux等' },
      { name: 'TypeScript', level: 90, experience: '3年', description: '类型安全开发，大型项目架构设计' },
      { name: 'Next.js', level: 88, experience: '2年', description: 'SSR/SSG、API Routes、性能优化' },
      { name: 'Vue.js', level: 85, experience: '3年', description: 'Vue 2/3、Vuex、Vue Router、Composition API' },
      { name: 'JavaScript', level: 92, experience: '5年', description: 'ES6+、异步编程、函数式编程' },
      { name: 'HTML/CSS', level: 90, experience: '5年', description: '语义化HTML、CSS3、Flexbox、Grid' }
    ]
  },
  {
    id: 'backend',
    name: '后端开发',
    icon: Storage,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', level: 85, experience: '3年', description: 'Express、Koa、微服务架构' },
      { name: 'Python', level: 80, experience: '2年', description: 'Django、Flask、数据分析' },
      { name: 'MongoDB', level: 75, experience: '2年', description: 'NoSQL数据库设计、聚合查询' },
      { name: 'PostgreSQL', level: 70, experience: '2年', description: 'SQL优化、数据库设计' },
      { name: 'Redis', level: 65, experience: '1年', description: '缓存策略、会话管理' },
      { name: 'GraphQL', level: 60, experience: '1年', description: 'API设计、查询优化' }
    ]
  },
  {
    id: 'design',
    name: 'UI/UX设计',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Figma', level: 85, experience: '3年', description: '界面设计、原型制作、设计系统' },
      { name: 'Adobe XD', level: 75, experience: '2年', description: '交互设计、用户流程设计' },
      { name: 'Sketch', level: 70, experience: '2年', description: '界面设计、图标设计' },
      { name: '用户体验', level: 80, experience: '3年', description: '用户研究、可用性测试' },
      { name: '响应式设计', level: 90, experience: '4年', description: '移动优先、跨设备适配' },
      { name: '设计系统', level: 75, experience: '2年', description: '组件库设计、设计规范' }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & 工具',
    icon: Cloud,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Git', level: 90, experience: '5年', description: '版本控制、分支管理、协作开发' },
      { name: 'Docker', level: 75, experience: '2年', description: '容器化部署、微服务' },
      { name: 'AWS', level: 65, experience: '1年', description: 'EC2、S3、Lambda、CloudFront' },
      { name: 'Vercel', level: 80, experience: '2年', description: '前端部署、Serverless函数' },
      { name: 'GitHub Actions', level: 70, experience: '1年', description: 'CI/CD、自动化部署' },
      { name: 'Webpack', level: 75, experience: '3年', description: '构建优化、代码分割' }
    ]
  }
];

const achievements = [
  {
    icon: EmojiEvents,
    title: '技术认证',
    items: ['AWS Certified Developer', 'Google Analytics认证', 'MongoDB认证开发者']
  },
  {
    icon: School,
    title: '学习经历',
    items: ['计算机科学学士学位', '在线课程完成超过50门', '技术会议演讲3次']
  },
  {
    icon: TrendingUp,
    title: '项目成果',
    items: ['开源项目1000+ Stars', '技术博客10万+阅读', '团队技术负责人']
  }
];

const learningGoals = [
  { name: 'Rust', progress: 30, description: '系统编程语言，WebAssembly开发' },
  { name: 'Kubernetes', progress: 45, description: '容器编排，微服务部署' },
  { name: 'Machine Learning', progress: 25, description: 'TensorFlow，深度学习' },
  { name: 'Web3', progress: 20, description: '区块链开发，智能合约' }
];

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('frontend');

  const currentCategory = skillCategories.find(cat => cat.id === selectedCategory);

  return (
    <Box className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Box className="relative py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Typography variant="h2" className="text-white font-bold mb-4">
              技能展示
            </Typography>
            <Typography variant="h6" className="text-white/70 max-w-2xl mx-auto mb-8">
              展示我的技术技能、工具掌握程度和持续学习的成长历程
            </Typography>
            
            {/* 技能概览 */}
            <Box className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {skillCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <GlassCard key={category.id} className="p-4 text-center">
                    <IconComponent className="text-3xl mb-2 text-white" />
                    <Typography variant="body2" className="text-white/70">
                      {category.name}
                    </Typography>
                    <Typography variant="h6" className="text-white font-bold">
                      {category.skills.length}
                    </Typography>
                  </GlassCard>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 技能分类导航 */}
      <Box className="py-8 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Box className="flex flex-wrap justify-center gap-4 mb-12">
            {skillCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Chip
                  key={category.id}
                  icon={<IconComponent />}
                  label={category.name}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`cursor-pointer transition-all duration-300 px-6 py-3 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white border-0`
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                />
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* 技能详情 */}
      <Box className="py-12 px-4 lg:px-8">
        <Container maxWidth="lg">
          {currentCategory && (
            <GlassCard className="p-8">
              <Box className="flex items-center mb-8">
                <Box className={`p-3 rounded-xl bg-gradient-to-r ${currentCategory.color} mr-4`}>
                  <currentCategory.icon className="text-white text-2xl" />
                </Box>
                <Box>
                  <Typography variant="h4" className="text-white font-bold">
                    {currentCategory.name}
                  </Typography>
                  <Typography variant="body1" className="text-white/70">
                    {currentCategory.skills.length} 项技能
                  </Typography>
                </Box>
              </Box>

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCategory.skills.map((skill, index) => (
                  <Box key={index} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <Box className="flex justify-between items-center mb-3">
                      <Typography variant="h6" className="text-white font-semibold">
                        {skill.name}
                      </Typography>
                      <Box className="flex items-center gap-2">
                        <Typography variant="body2" className="text-white/70">
                          {skill.level}%
                        </Typography>
                        <Chip
                          label={skill.experience}
                          size="small"
                          className="bg-white/10 text-white border-white/20"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={skill.level}
                      className="h-3 rounded-full bg-white/10 mb-3"
                      sx={{
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${currentCategory.color.replace('from-', '').replace(' to-', ', ')})`,
                          borderRadius: '6px',
                        }
                      }}
                    />
                    
                    <Typography variant="body2" className="text-white/70 leading-relaxed">
                      {skill.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </GlassCard>
          )}
        </Container>
      </Box>

      {/* 成就展示 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-white font-bold text-center mb-12">
            成就与认证
          </Typography>
          
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <GlassCard key={index} className="p-8 text-center glass-hover">
                  <Box className="mb-6">
                    <IconComponent className="text-5xl text-yellow-400" />
                  </Box>
                  <Typography variant="h5" className="text-white font-bold mb-4">
                    {achievement.title}
                  </Typography>
                  <Box className="space-y-2">
                    {achievement.items.map((item, itemIndex) => (
                      <Typography 
                        key={itemIndex} 
                        variant="body2" 
                        className="text-white/70 leading-relaxed"
                      >
                        • {item}
                      </Typography>
                    ))}
                  </Box>
                </GlassCard>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* 学习目标 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-white font-bold text-center mb-4">
            持续学习
          </Typography>
          <Typography variant="h6" className="text-white/70 text-center mb-12">
            当前正在学习的新技术和目标
          </Typography>
          
          <Box className="max-w-3xl mx-auto">
            <GlassCard className="p-8">
              <Box className="space-y-6">
                {learningGoals.map((goal, index) => (
                  <Box key={index}>
                    <Box className="flex justify-between items-center mb-2">
                      <Typography variant="h6" className="text-white font-semibold">
                        {goal.name}
                      </Typography>
                      <Typography variant="body2" className="text-white/70">
                        {goal.progress}%
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress}
                      className="h-3 rounded-full bg-white/10 mb-2"
                      sx={{
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                          borderRadius: '6px',
                        }
                      }}
                    />
                    
                    <Typography variant="body2" className="text-white/70">
                      {goal.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Box>
        </Container>
      </Box>

      {/* 技能云图 */}
      <Box className="py-20 px-4 lg:px-8">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-white font-bold text-center mb-12">
            技能云图
          </Typography>
          
          <GlassCard className="p-12">
            <Box className="flex flex-wrap justify-center items-center gap-4">
              {skillCategories.flatMap(category => 
                category.skills.map(skill => (
                  <Chip
                    key={skill.name}
                    label={skill.name}
                    className={`transition-all duration-300 hover:scale-110 cursor-pointer ${
                      skill.level >= 90 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-lg px-6 py-3'
                        : skill.level >= 80
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-base px-4 py-2'
                        : skill.level >= 70
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1'
                        : 'bg-white/10 text-white border-white/20 px-2 py-1'
                    }`}
                    style={{
                      fontSize: skill.level >= 90 ? '1.1rem' : skill.level >= 80 ? '1rem' : '0.9rem'
                    }}
                  />
                ))
              )}
            </Box>
            
            <Box className="mt-8 flex justify-center gap-6 text-sm">
              <Box className="flex items-center gap-2">
                <Box className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-500"></Box>
                <Typography variant="body2" className="text-white/70">专家级 (90%+)</Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Box className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-cyan-500"></Box>
                <Typography variant="body2" className="text-white/70">熟练 (80-89%)</Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Box className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500"></Box>
                <Typography variant="body2" className="text-white/70">良好 (70-79%)</Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Box className="w-4 h-4 rounded bg-white/20"></Box>
                <Typography variant="body2" className="text-white/70">基础 (60-69%)</Typography>
              </Box>
            </Box>
          </GlassCard>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
