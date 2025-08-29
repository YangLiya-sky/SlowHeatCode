// 环境变量验证和配置
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ 缺少必需的环境变量:', missingVars);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`生产环境缺少必需的环境变量: ${missingVars.join(', ')}`);
    } else {
      console.warn('⚠️ 开发环境缺少环境变量，使用默认值');
    }
  }

  // 验证数据库URL格式
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgresql://')) {
    console.warn('⚠️ DATABASE_URL 应该是 PostgreSQL 连接字符串');
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    SETUP_KEY: process.env.SETUP_KEY || 'admin-setup-2025',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

// 在应用启动时验证环境变量
export const env = validateEnvironment();
