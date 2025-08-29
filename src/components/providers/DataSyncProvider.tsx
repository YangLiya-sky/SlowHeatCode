'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dataSync, startGlobalSync, stopGlobalSync } from '@/lib/dataSync';

interface DataSyncContextType {
  isOnline: boolean;
  lastSyncTime: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  forcSync: () => void;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

export function useDataSyncContext() {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSyncContext must be used within DataSyncProvider');
  }
  return context;
}

interface DataSyncProviderProps {
  children: React.ReactNode;
  syncInterval?: number;
  enableAutoSync?: boolean;
}

export function DataSyncProvider({ 
  children, 
  syncInterval = 30000, // 30秒
  enableAutoSync = true 
}: DataSyncProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  useEffect(() => {
    // 监听网络状态
    const handleOnline = () => {
      setIsOnline(true);
      if (enableAutoSync) {
        startGlobalSync(syncInterval);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      stopGlobalSync();
    };

    // 设置网络状态监听
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // 启动自动同步
    if (enableAutoSync && isOnline) {
      startGlobalSync(syncInterval);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      stopGlobalSync();
    };
  }, [syncInterval, enableAutoSync, isOnline]);

  // 监听数据同步事件
  useEffect(() => {
    const handleSyncStart = () => {
      setSyncStatus('syncing');
    };

    const handleSyncSuccess = () => {
      setSyncStatus('idle');
      setLastSyncTime(new Date());
    };

    const handleSyncError = () => {
      setSyncStatus('error');
    };

    // 这里可以添加事件监听器
    // 由于我们的dataSync类没有事件系统，我们可以扩展它

    return () => {
      // 清理事件监听器
    };
  }, []);

  const forceSync = async () => {
    if (!isOnline) return;
    
    setSyncStatus('syncing');
    try {
      // 强制同步所有关键数据
      await dataSync.updateMultipleData([
        'posts',
        'admin-posts',
        'categories',
        'tags',
        'comments',
        'users',
        'media',
        'settings'
      ]);
      setSyncStatus('idle');
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Force sync failed:', error);
      setSyncStatus('error');
    }
  };

  const value: DataSyncContextType = {
    isOnline,
    lastSyncTime,
    syncStatus,
    forcSync: forceSync,
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
}

// 数据同步状态指示器组件
export function SyncStatusIndicator() {
  const { isOnline, syncStatus, lastSyncTime, forcSync } = useDataSyncContext();

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        离线状态
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
        syncStatus === 'syncing' 
          ? 'bg-blue-500/20 text-blue-300'
          : syncStatus === 'error'
          ? 'bg-red-500/20 text-red-300'
          : 'bg-green-500/20 text-green-300'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          syncStatus === 'syncing' 
            ? 'bg-blue-500 animate-pulse'
            : syncStatus === 'error'
            ? 'bg-red-500'
            : 'bg-green-500'
        }`}></div>
        {syncStatus === 'syncing' && '同步中...'}
        {syncStatus === 'error' && '同步失败'}
        {syncStatus === 'idle' && '已同步'}
      </div>
      
      {lastSyncTime && (
        <span className="text-xs text-white/60">
          {lastSyncTime.toLocaleTimeString()}
        </span>
      )}
      
      <button
        onClick={forcSync}
        disabled={syncStatus === 'syncing'}
        className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors disabled:opacity-50"
      >
        刷新
      </button>
    </div>
  );
}

// 实时数据组件包装器
export function withRealTimeData<T extends object>(
  Component: React.ComponentType<T>,
  dataKeys: string[]
) {
  return function WrappedComponent(props: T) {
    useEffect(() => {
      // 当组件挂载时，确保相关数据是最新的
      dataSync.updateMultipleData(dataKeys);
    }, []);

    return <Component {...props} />;
  };
}
