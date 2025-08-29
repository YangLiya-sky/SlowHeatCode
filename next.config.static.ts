import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages静态部署配置
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  // GitHub Pages路径配置
  basePath: '',
  assetPrefix: '',
  
  // 禁用开发工具面板和指示器
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },

  // 启用实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // 图片优化配置 - 静态导出需要禁用
  images: {
    unoptimized: true,
  },

  // 压缩配置
  compress: true,

  // 静态文件优化
  poweredByHeader: false,

  // 禁用服务器端功能
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
