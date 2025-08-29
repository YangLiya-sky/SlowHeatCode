'use client';

import * as React from 'react';

// 数据同步管理器
class DataSyncManager {
  private static instance: DataSyncManager;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private cache: Map<string, any> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance() {
    if (!DataSyncManager.instance) {
      DataSyncManager.instance = new DataSyncManager();
    }
    return DataSyncManager.instance;
  }

  // 订阅数据变化
  subscribe(key: string, callback: (data: any) => void) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    // 返回取消订阅函数
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  // 通知订阅者数据变化
  notify(key: string, data: any) {
    this.cache.set(key, data);
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // 获取缓存数据
  getCache(key: string) {
    return this.cache.get(key);
  }

  // 设置缓存数据
  setCache(key: string, data: any) {
    this.cache.set(key, data);
  }

  // 清除缓存
  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // 启动定期同步
  startSync(interval: number = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncAllData();
    }, interval);
  }

  // 停止同步
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // 同步所有数据
  private async syncAllData() {
    const syncKeys = Array.from(this.subscribers.keys());

    for (const key of syncKeys) {
      try {
        await this.syncData(key);
      } catch (error) {
        console.error(`Sync error for ${key}:`, error);
      }
    }
  }

  // 同步特定数据（带重试机制）
  async syncData(key: string, retryCount = 0) {
    const endpoint = this.getEndpointForKey(key);
    if (!endpoint) return;

    const maxRetries = 3;
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000); // 指数退避，最大5秒

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        this.notify(key, data);
      } else if (response.status === 404) {
        // 资源不存在，设置为空数据
        console.warn(`Resource not found for ${key}: ${endpoint}`);
        this.notify(key, null);
      } else if (response.status >= 400 && response.status < 500) {
        // 客户端错误，记录警告但不抛出异常
        console.warn(`Client error ${response.status} for ${key}: ${endpoint}`);
      } else if (response.status >= 500 && retryCount < maxRetries) {
        // 服务器错误，重试
        console.warn(`Server error ${response.status} for ${key}, retrying in ${retryDelay}ms...`);
        setTimeout(() => this.syncData(key, retryCount + 1), retryDelay);
      } else {
        console.error(`Server error ${response.status} for ${key}: ${endpoint}`);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`Request timeout for ${key}: ${endpoint}`);
      } else if (retryCount < maxRetries) {
        // 网络错误等，重试
        console.warn(`Failed to sync ${key}, retrying in ${retryDelay}ms...`, error);
        setTimeout(() => this.syncData(key, retryCount + 1), retryDelay);
      } else {
        console.error(`Failed to sync ${key} after ${maxRetries} retries:`, error);
      }
    }
  }

  // 根据key获取对应的API端点
  private getEndpointForKey(key: string): string | null {
    const endpoints: Record<string, string> = {
      'posts': '/api/posts?status=PUBLISHED&limit=20',
      'admin-posts': '/api/posts?limit=20',
      'projects': '/api/projects?status=ACTIVE&limit=20',
      'admin-projects': '/api/projects?limit=20',
      'categories': '/api/categories',
      'tags': '/api/tags',
      'comments': '/api/comments',
      'users': '/api/users',
      'media': '/api/media',
      'settings': '/api/settings',
      'analytics': '/api/analytics',
      'health': '/api/health',
    };

    return endpoints[key] || null;
  }

  // 检查系统健康状态
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // 手动触发数据更新
  async updateData(key: string, data?: any) {
    if (data) {
      this.notify(key, data);
    } else {
      await this.syncData(key);
    }
  }

  // 批量更新多个数据
  async updateMultipleData(keys: string[]) {
    const promises = keys.map(key => this.syncData(key));
    await Promise.allSettled(promises);
  }
}

// 导出单例实例
export const dataSync = DataSyncManager.getInstance();

// React Hook for data synchronization
export function useDataSync<T>(key: string, initialData?: T) {
  const [data, setData] = React.useState<T | null>(initialData || null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 检查缓存
    const cached = dataSync.getCache(key);
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    // 订阅数据变化
    const unsubscribe = dataSync.subscribe(key, (newData) => {
      setData(newData);
      setLoading(false);
      setError(null);
    });

    // 初始加载数据
    if (!cached) {
      dataSync.syncData(key).catch((err) => {
        console.warn(`Failed to load data for ${key}:`, err);
        setError(err.message);
        setLoading(false);
      });
    }

    return unsubscribe;
  }, [key]);

  const refresh = React.useCallback(() => {
    setLoading(true);
    setError(null);
    dataSync.syncData(key).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [key]);

  const update = React.useCallback((newData: T) => {
    dataSync.updateData(key, newData);
  }, [key]);

  return { data, loading, error, refresh, update };
}

// 数据变更通知
export function notifyDataChange(key: string, data: any) {
  dataSync.notify(key, data);
}

// 批量数据同步
export function syncMultipleData(keys: string[]) {
  return dataSync.updateMultipleData(keys);
}

// 启动全局数据同步
export function startGlobalSync(interval?: number) {
  dataSync.startSync(interval);
}

// 停止全局数据同步
export function stopGlobalSync() {
  dataSync.stopSync();
}
