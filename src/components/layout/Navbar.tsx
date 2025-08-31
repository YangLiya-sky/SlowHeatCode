'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Home, Person, Article, Work, Build, ContactMail, Archive, Search, AdminPanelSettings, Login, RssFeed } from '@mui/icons-material';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import GlobalSearch from '@/components/layout/GlobalSearch';

const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: '关于我', href: '/about', icon: Person },
  { name: '博客', href: '/blog', icon: Article },
  { name: '项目', href: '/projects', icon: Work },
  { name: '技能', href: '/skills', icon: Build },
  { name: '联系我', href: '/contact', icon: ContactMail },
  { name: '归档', href: '/archive', icon: Archive },
  { name: '搜索', href: '/search', icon: Search },
  { name: 'RSS', href: '/api/rss', icon: RssFeed, external: true },
  { name: '管理', href: '/admin', icon: AdminPanelSettings },
  { name: '登录', href: '/login', icon: Login },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} className="h-full bg-slate-900/95 backdrop-blur-md">
      <Box className="flex justify-between items-center p-4 border-b border-white/20">
        <Box className="flex items-center gap-2">
          <RssFeed className="text-indigo-400 text-xl" />
          <Typography variant="h6" className="gradient-text font-bold">
            杨立雅 - 个人博客
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} className="text-white">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <ListItem key={item.name} className="px-4 py-2">
              {(item as any).external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full text-white/80 hover:text-white transition-colors"
                >
                  <IconComponent className="mr-3 text-xl" />
                  <ListItemText primary={item.name} />
                </a>
              ) : (
                <Link href={item.href} className="flex items-center w-full text-white/80 hover:text-white transition-colors">
                  <IconComponent className="mr-3 text-xl" />
                  <ListItemText primary={item.name} />
                </Link>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        className="bg-transparent shadow-none backdrop-blur-md border-b border-white/10"
        elevation={0}
      >
        <Toolbar className="px-4 lg:px-8">
          <Box className="flex items-center gap-3">
            <RssFeed className="text-indigo-400 text-2xl" />
            <Typography variant="h6" component="div" className="gradient-text font-bold text-xl">
              <Link href="/" className="no-underline">
                杨立雅 - 个人博客
              </Link>
            </Typography>
          </Box>

          <Box className="flex-grow" />

          {!isMobile && (
            <Box className="hidden md:flex items-center space-x-1">
              {navItems.filter(item => item.name !== '搜索').map((item) => {
                const IconComponent = item.icon;
                const linkContent = (
                  <Box className={cn(
                    "flex items-center px-4 py-2 rounded-xl transition-all duration-300",
                    "text-white/80 hover:text-white",
                    "hover:bg-white/10 hover:backdrop-blur-md"
                  )}>
                    <IconComponent className="mr-2 text-lg" />
                    <Typography variant="body2" className="font-medium">
                      {item.name}
                    </Typography>
                  </Box>
                );

                return (item as any).external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkContent}
                  </a>
                ) : (
                  <Link key={item.name} href={item.href}>
                    {linkContent}
                  </Link>
                );
              })}
            </Box>
          )}

          {/* 全局搜索 */}
          <GlobalSearch className="mr-2" />

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="text-white"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'transparent',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer for fixed navbar */}
      <Toolbar />
    </>
  );
}
