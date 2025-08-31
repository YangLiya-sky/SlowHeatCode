// 数据同步Hook - 管理前台与后台数据同步
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseDataSyncOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface DataSyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useDataSync<T>(
  fetchFn: () => Promise<T>,
  options: UseDataSyncOptions = {}
) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [state, setState] = useState<DataSyncState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchDataRef = useRef(fetchFn);
  fetchDataRef.current = fetchFn;

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetchDataRef.current();
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    ...state,
    refresh,
  };
}

// 专用Hooks
export function usePosts(params?: Parameters<typeof apiClient.getPosts>[0]) {
  return useDataSync(() => apiClient.getPosts(params));
}

export function usePost(slug: string) {
  return useDataSync(() => apiClient.getPost(slug));
}

export function useFeaturedPosts() {
  return useDataSync(() => apiClient.getFeaturedPosts());
}

export function useRecentPosts(limit?: number) {
  return useDataSync(() => apiClient.getRecentPosts(limit));
}

export function useProjects(params?: Parameters<typeof apiClient.getProjects>[0]) {
  return useDataSync(() => apiClient.getProjects(params));
}

export function useProject(slug: string) {
  return useDataSync(() => apiClient.getProject(slug));
}

export function useFeaturedProjects() {
  return useDataSync(() => apiClient.getFeaturedProjects());
}

export function useCategories() {
  return useDataSync(() => apiClient.getCategories());
}

export function useCategory(slug: string) {
  return useDataSync(() => apiClient.getCategory(slug));
}

export function useTags() {
  return useDataSync(() => apiClient.getTags());
}

export function useTag(slug: string) {
  return useDataSync(() => apiClient.getTag(slug));
}

export function useComments(postId: string) {
  return useDataSync(() => apiClient.getComments(postId));
}

export function useStats() {
  return useDataSync(() => apiClient.getStats(), {
    autoRefresh: true,
    refreshInterval: 60000, // 每分钟刷新一次统计数据
  });
}

export function useSearch(query: string, type?: 'posts' | 'projects') {
  return useDataSync(() => {
    if (!query.trim()) return Promise.resolve([]);
    return apiClient.search(query, type);
  });
}

// 用户相关Hooks
export function useUsers() {
  return useDataSync(() => apiClient.getUsers());
}

export function useUser(id: string) {
  return useDataSync(() => apiClient.getUser(id));
}

// 媒体相关Hooks
export function useMedia() {
  return useDataSync(() => apiClient.getMedia());
}

export function useMediaItem(id: string) {
  return useDataSync(() => apiClient.getMediaItem(id));
}

// 系统设置Hooks
export function usePublicSettings() {
  return useDataSync(() => apiClient.getPublicSettings(), {
    autoRefresh: true,
    refreshInterval: 300000, // 每5分钟刷新一次设置
  });
}

// 公开统计Hooks
export function usePublicStats() {
  return useDataSync(() => apiClient.getPublicStats(), {
    autoRefresh: true,
    refreshInterval: 60000, // 每分钟刷新一次统计数据
  });
}

// 健康检查Hooks
export function useHealth() {
  return useDataSync(() => apiClient.getHealth(), {
    autoRefresh: true,
    refreshInterval: 30000, // 每30秒检查一次健康状态
  });
}

// 归档相关Hooks
export function useArchive(year?: number, month?: number) {
  return useDataSync(() => apiClient.getArchive(year, month));
}

// 站点地图Hooks
export function useSitemap() {
  return useDataSync(() => apiClient.getSitemap());
}

// RSS订阅Hooks
export function useRSSFeed() {
  return useDataSync(() => apiClient.getRSSFeed());
}
