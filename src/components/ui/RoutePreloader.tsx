'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { preloadData } from '@/lib/cache';

interface RoutePreloaderProps {
  routes?: string[];
}

export function RoutePreloader({ routes = [] }: RoutePreloaderProps) {
  const router = useRouter();

  useEffect(() => {
    // 预加载常用路由的数据
    const preloadRoutes = [
      '/api/posts?status=PUBLISHED&limit=10',
      '/api/categories',
      '/api/tags',
      ...routes
    ];

    // 延迟预加载，避免影响初始页面加载
    const timer = setTimeout(() => {
      preloadRoutes.forEach(route => {
        preloadData(route).catch((error) => {
          // 静默处理预加载错误，只在开发环境输出警告
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Failed to preload ${route}:`, error.message);
          }
        });
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [routes]);

  useEffect(() => {
    // 预加载链接悬停时的页面
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 安全检查closest方法是否存在
      if (!target || typeof target.closest !== 'function') {
        return;
      }

      const link = target.closest('a[href^="/"]') as HTMLAnchorElement;

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const pathname = url.pathname;

          // 预加载对应的API数据
          if (pathname.startsWith('/blog/')) {
            const postId = pathname.split('/').pop();
            if (postId) {
              preloadData(`/api/posts/${postId}`).catch(() => { });
            }
          } else if (pathname === '/blog') {
            preloadData('/api/posts?status=PUBLISHED&limit=10').catch(() => { });
          } else if (pathname === '/projects') {
            // 项目页面没有API，但可以预加载其他资源
          }
        } catch (error) {
          // 静默处理URL解析错误
        }
      }
    };

    // 添加全局鼠标悬停监听
    if (typeof document !== 'undefined') {
      document.addEventListener('mouseenter', handleMouseEnter, true);

      return () => {
        document.removeEventListener('mouseenter', handleMouseEnter, true);
      };
    }
  }, []);

  return null; // 这是一个无UI组件
}

// 页面过渡动画组件
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-300">
      {children}
    </div>
  );
}

// 懒加载组件包装器
export function LazyWrapper({
  children,
  fallback = <div className="animate-pulse bg-white/5 rounded-lg h-32" />
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <div className="transition-all duration-300">
      {children}
    </div>
  );
}
