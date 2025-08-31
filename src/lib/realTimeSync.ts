'use client';

import React from 'react';

// 实时数据同步系统 - 使用 Server-Sent Events (SSE)
export class RealTimeSync {
  private static instance: RealTimeSync;
  private eventSource: EventSource | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  static getInstance(): RealTimeSync {
    if (!RealTimeSync.instance) {
      RealTimeSync.instance = new RealTimeSync();
    }
    return RealTimeSync.instance;
  }

  // 连接到 SSE 端点
  connect() {
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return;
    }

    try {
      this.eventSource = new EventSource('/api/realtime');

      this.eventSource.onopen = () => {
        console.log('Real-time connection established');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionListeners(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.isConnected = false;
        this.notifyConnectionListeners(false);
        this.handleReconnect();
      };

      // 监听特定事件类型
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      this.handleReconnect();
    }
  }

  // 设置事件监听器
  private setupEventListeners() {
    if (!this.eventSource) return;

    // 数据更新事件
    this.eventSource.addEventListener('data-update', (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data.payload);
    });

    // 统计数据更新
    this.eventSource.addEventListener('stats-update', (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers('analytics', data);
    });

    // 媒体文件更新
    this.eventSource.addEventListener('media-update', (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers('media', data);
    });

    // 文章更新
    this.eventSource.addEventListener('post-update', (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers('posts', data);
    });

    // 项目更新
    this.eventSource.addEventListener('project-update', (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers('projects', data);
    });

    // 评论更新
    this.eventSource.addEventListener('comment-update', (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers('comments', data);
    });
  }

  // 处理消息
  private handleMessage(data: any) {
    const { type, payload } = data;
    this.notifySubscribers(type, payload);
  }

  // 处理重连
  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // 订阅数据类型
  subscribe(dataType: string, callback: (data: any) => void) {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set());
    }
    this.subscribers.get(dataType)!.add(callback);

    // 返回取消订阅函数
    return () => {
      const callbacks = this.subscribers.get(dataType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(dataType);
        }
      }
    };
  }

  // 通知订阅者
  private notifySubscribers(dataType: string, data: any) {
    const callbacks = this.subscribers.get(dataType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in subscriber callback for ${dataType}:`, error);
        }
      });
    }
  }

  // 监听连接状态
  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionListeners.add(callback);
    // 立即调用一次当前状态
    callback(this.isConnected);

    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  // 通知连接状态监听器
  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  // 断开连接
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    this.notifyConnectionListeners(false);
  }

  // 获取连接状态
  getConnectionStatus() {
    return this.isConnected;
  }

  // 手动触发数据刷新
  async triggerRefresh(dataType: string) {
    try {
      const response = await fetch('/api/realtime/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: dataType }),
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger refresh: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to trigger refresh:', error);
    }
  }
}

// 导出单例实例
export const realTimeSync = RealTimeSync.getInstance();

// React Hook for real-time data

export function useRealTimeData<T>(
  dataType: string,
  initialData?: T
) {
  const [data, setData] = React.useState<T | null>(initialData || null);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    // 订阅数据更新
    const unsubscribeData = realTimeSync.subscribe(dataType, (newData) => {
      setData(newData);
    });

    // 订阅连接状态
    const unsubscribeConnection = realTimeSync.onConnectionChange(setConnected);

    // 确保连接已建立
    if (!realTimeSync.getConnectionStatus()) {
      realTimeSync.connect();
    }

    return () => {
      unsubscribeData();
      unsubscribeConnection();
    };
  }, [dataType]);

  const refresh = React.useCallback(() => {
    realTimeSync.triggerRefresh(dataType);
  }, [dataType]);

  return { data, connected, refresh };
}

// 实时统计数据 Hook
export function useRealTimeAnalytics() {
  return useRealTimeData('analytics');
}

// 实时媒体数据 Hook
export function useRealTimeMedia() {
  return useRealTimeData('media');
}

// 实时文章数据 Hook
export function useRealTimePosts() {
  return useRealTimeData('posts');
}

// 实时项目数据 Hook
export function useRealTimeProjects() {
  return useRealTimeData('projects');
}
