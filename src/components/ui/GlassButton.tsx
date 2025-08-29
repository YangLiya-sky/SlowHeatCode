'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends ButtonProps {
  children: React.ReactNode;
  glassVariant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  blur?: 'sm' | 'md' | 'lg';
  target?: string;
  rel?: string;
}

export function GlassButton({
  children,
  className,
  glassVariant = 'primary',
  blur = 'md',
  ...props
}: GlassButtonProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-indigo-500/80 to-pink-500/80',
      'border border-white/20',
      'text-white font-medium',
      'hover:from-indigo-600/90 hover:to-pink-600/90',
      'hover:border-white/30',
      'shadow-lg hover:shadow-xl',
    ].join(' '),
    secondary: [
      'bg-white/10 border border-white/20',
      'text-white font-medium',
      'hover:bg-white/20 hover:border-white/30',
      'shadow-md hover:shadow-lg',
    ].join(' '),
    ghost: [
      'bg-transparent border border-transparent',
      'text-white/80 font-medium',
      'hover:bg-white/10 hover:text-white',
      'hover:border-white/20',
    ].join(' '),
    outline: [
      'bg-transparent border-2 border-white/30',
      'text-white font-medium',
      'hover:bg-white/10 hover:border-white/50',
      'shadow-sm hover:shadow-md',
    ].join(' '),
  };

  return (
    <Button
      className={cn(
        // 基础样式
        'rounded-xl px-6 py-3 transition-all duration-300 ease-in-out',
        'transform hover:scale-105 active:scale-95',
        'backdrop-blur-md',
        // 动态类名
        blurClasses[blur],
        variantClasses[glassVariant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
