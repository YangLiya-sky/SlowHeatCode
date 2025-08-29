import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用ESLint和TypeScript检查以确保代码质量
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // 编译器配置
  compiler: {
    // 移除console.log在生产环境
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 简化实验性功能配置
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // 构建优化配置
  webpack: (config, { dev }) => {
    // 优化构建性能
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // 解决SWC DLL问题的fallback配置
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
  },

  // 压缩配置
  compress: true,

  // 静态文件优化
  poweredByHeader: false,

  // Vercel部署配置
  // output: 'standalone', // Vercel会自动处理

  // 重定向和重写
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/uploads/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
