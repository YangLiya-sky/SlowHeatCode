'use client';

import { notifyDataUpdate } from './realTimeNotify';

// 系统设置管理器
export class SettingsManager {
  private static instance: SettingsManager;
  private settings: Record<string, any> = {};
  private listeners: Set<(settings: Record<string, any>) => void> = new Set();

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  // 获取设置
  async getSettings(): Promise<Record<string, any>> {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        this.settings = data.settings || {};
        this.notifyListeners();
        return this.settings;
      }
    } catch (error) {
      console.error('Failed to get settings:', error);
    }
    return this.settings;
  }

  // 更新设置
  async updateSettings(newSettings: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        // 更新本地设置
        this.settings = { ...this.settings, ...newSettings };
        this.notifyListeners();
        
        // 通知实时数据更新
        await notifyDataUpdate('settings', this.settings);
        
        return true;
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
    return false;
  }

  // 获取单个设置
  getSetting(key: string, defaultValue?: any): any {
    return this.settings[key] ?? defaultValue;
  }

  // 设置单个值
  async setSetting(key: string, value: any): Promise<boolean> {
    return this.updateSettings({ [key]: value });
  }

  // 监听设置变化
  onSettingsChange(callback: (settings: Record<string, any>) => void): () => void {
    this.listeners.add(callback);
    // 立即调用一次当前设置
    callback(this.settings);

    return () => {
      this.listeners.delete(callback);
    };
  }

  // 通知监听器
  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.settings);
      } catch (error) {
        console.error('Error in settings listener:', error);
      }
    });
  }

  // 检查功能是否启用
  isFeatureEnabled(feature: string): boolean {
    switch (feature) {
      case 'comments':
        return this.getSetting('enable_comments', true);
      case 'analytics':
        return this.getSetting('enable_analytics', true);
      case 'media_preview':
        return this.getSetting('enable_media_preview', true);
      case 'realtime_sync':
        return this.getSetting('enable_realtime_sync', true);
      case 'comment_moderation':
        return this.getSetting('comment_moderation', false);
      case 'auto_backup':
        return this.getSetting('auto_backup', false);
      case 'seo_optimization':
        return this.getSetting('seo_optimization', true);
      default:
        return false;
    }
  }

  // 获取文件上传设置
  getUploadSettings() {
    return {
      maxFileSize: this.getSetting('max_file_size', 10), // MB
      allowedTypes: this.getSetting('allowed_file_types', 'jpg,jpeg,png,gif,pdf,mp4,webm').split(','),
      enablePreview: this.getSetting('enable_media_preview', true),
    };
  }

  // 获取网站基本信息
  getSiteInfo() {
    return {
      title: this.getSetting('site_title', 'Vibe Blog'),
      subtitle: this.getSetting('site_subtitle', '分享技术见解和开发经验'),
      description: this.getSetting('site_description', '现代化玻璃拟态博客系统'),
      contactEmail: this.getSetting('contact_email', ''),
      githubUrl: this.getSetting('github_url', ''),
    };
  }
}

// 导出单例实例
export const settingsManager = SettingsManager.getInstance();

// React Hook for settings
import React from 'react';

export function useSettings() {
  const [settings, setSettings] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 初始化设置
    settingsManager.getSettings().then(() => {
      setLoading(false);
    });

    // 监听设置变化
    const unsubscribe = settingsManager.onSettingsChange(setSettings);

    return unsubscribe;
  }, []);

  const updateSettings = React.useCallback(async (newSettings: Record<string, any>) => {
    return settingsManager.updateSettings(newSettings);
  }, []);

  const getSetting = React.useCallback((key: string, defaultValue?: any) => {
    return settingsManager.getSetting(key, defaultValue);
  }, [settings]);

  const isFeatureEnabled = React.useCallback((feature: string) => {
    return settingsManager.isFeatureEnabled(feature);
  }, [settings]);

  return {
    settings,
    loading,
    updateSettings,
    getSetting,
    isFeatureEnabled,
    siteInfo: settingsManager.getSiteInfo(),
    uploadSettings: settingsManager.getUploadSettings(),
  };
}

// 特定功能的 Hooks
export function useFeatureFlag(feature: string) {
  const { isFeatureEnabled } = useSettings();
  return isFeatureEnabled(feature);
}

export function useSiteInfo() {
  const { siteInfo } = useSettings();
  return siteInfo;
}

export function useUploadSettings() {
  const { uploadSettings } = useSettings();
  return uploadSettings;
}
