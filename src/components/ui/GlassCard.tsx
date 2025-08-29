'use client';

import React from 'react';
import { Card, CardProps } from '@mui/material';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<CardProps, 'variant'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'subtle';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  blur = 'md',
  ...props
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const variantClasses = {
    default: 'bg-white/10 border-white/20',
    elevated: 'bg-white/15 border-white/30 shadow-2xl',
    subtle: 'bg-white/5 border-white/10',
  };

  return (
    <Card
      className={cn(
        // 基础玻璃拟态样式
        'rounded-2xl border backdrop-blur-md',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'transition-all duration-300 ease-in-out',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]',
        'hover:scale-[1.02] hover:border-white/30',
        // 动态类名
        blurClasses[blur],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
