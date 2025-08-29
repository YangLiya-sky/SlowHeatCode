'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { Refresh, CheckCircle, Error, Warning } from '@mui/icons-material';
import { dataSync } from '@/lib/dataSync';

interface SystemHealth {
  status: 'healthy' | 'unhealthy';
  database: string;
  timestamp: string;
  error?: string;
}

export function ProductionSyncMonitor() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      const isHealthy = await dataSync.checkHealth();
      if (isHealthy) {
        const response = await fetch('/api/health');
        const healthData = await response.json();
        setHealth(healthData);
      } else {
        setHealth({
          status: 'unhealthy',
          database: 'disconnected',
          timestamp: new Date().toISOString(),
          error: 'System health check failed'
        });
      }
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check error:', error);
      setHealth({
        status: 'unhealthy',
        database: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 定期健康检查
  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // 每分钟检查一次
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (loading) return <Refresh className="animate-spin" />;
    if (!health) return <Warning color="warning" />;
    return health.status === 'healthy' ? 
      <CheckCircle color="success" /> : 
      <Error color="error" />;
  };

  const getStatusColor = () => {
    if (!health) return 'warning';
    return health.status === 'healthy' ? 'success' : 'error';
  };

  if (process.env.NODE_ENV !== 'production') {
    return null; // 只在生产环境显示
  }

  return (
    <Box className="fixed bottom-4 right-4 z-50">
      <Alert 
        severity={getStatusColor()}
        icon={getStatusIcon()}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={checkSystemHealth}
            disabled={loading}
          >
            刷新
          </Button>
        }
        className="min-w-[300px]"
      >
        <Typography variant="body2" className="font-medium">
          系统状态: {health?.status === 'healthy' ? '正常' : '异常'}
        </Typography>
        <Typography variant="caption" className="block">
          数据库: {health?.database || '检查中...'}
        </Typography>
        {lastCheck && (
          <Typography variant="caption" className="block text-gray-600">
            最后检查: {lastCheck.toLocaleTimeString()}
          </Typography>
        )}
        {health?.error && (
          <Typography variant="caption" className="block text-red-600">
            错误: {health.error}
          </Typography>
        )}
      </Alert>
    </Box>
  );
}
