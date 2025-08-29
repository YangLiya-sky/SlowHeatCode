// 简单的内存缓存实现
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // 清理过期缓存
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// 全局缓存实例
export const cache = new MemoryCache();

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000); // 每10分钟清理一次
}

// 缓存装饰器函数
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);

    if (cached) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttl);
    return result;
  }) as T;
}

// API缓存工具
export class ApiCache {
  private static instance: ApiCache;
  private cache = new MemoryCache();

  static getInstance() {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  async fetch(url: string, options?: RequestInit, ttl: number = 5 * 60 * 1000) {
    const key = `${url}_${JSON.stringify(options)}`;
    const cached = this.cache.get(key);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url, options);

      // 对于404等客户端错误，返回null而不是抛出异常
      if (response.status === 404) {
        console.warn(`Resource not found: ${url}`);
        return null;
      }

      // 对于其他客户端错误（400-499），也返回null
      if (response.status >= 400 && response.status < 500) {
        console.warn(`Client error ${response.status} for: ${url}`);
        return null;
      }

      // 对于服务器错误（500+），仍然抛出异常
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
      }

      const data = await response.json();
      this.cache.set(key, data, ttl);
      return data;
    } catch (error) {
      // 网络错误或JSON解析错误
      if (error instanceof TypeError || error.message.includes('Failed to fetch')) {
        console.warn(`Network error for ${url}:`, error.message);
        return null;
      }

      console.error('API fetch error:', error);
      throw error;
    }
  }

  invalidate(pattern: string) {
    // 删除匹配模式的缓存
    for (const key of this.cache['cache'].keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

// 导出单例实例
export const apiCache = ApiCache.getInstance();

// 简单的缓存获取函数（不使用React hooks）
export async function getCachedData<T>(
  url: string,
  options?: RequestInit,
  ttl?: number
): Promise<T> {
  return apiCache.fetch(url, options, ttl);
}

// 预加载函数
export function preloadData(url: string, options?: RequestInit, ttl?: number) {
  return apiCache.fetch(url, options, ttl);
}
