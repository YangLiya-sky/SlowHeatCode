// 前台API客户端 - 用于与后台管理系统数据同步

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // 文章相关API
  async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    featured?: boolean;
    status?: 'PUBLISHED';
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/api/posts${query ? `?${query}` : ''}`);
  }

  async getPost(slug: string) {
    return this.request(`/api/posts/${slug}`);
  }

  async getFeaturedPosts() {
    return this.request('/api/posts?featured=true&status=PUBLISHED&limit=6');
  }

  async getRecentPosts(limit = 5) {
    return this.request(`/api/posts?status=PUBLISHED&limit=${limit}&sort=createdAt:desc`);
  }

  // 项目相关API
  async getProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: 'COMPLETED' | 'ACTIVE';
    featured?: boolean;
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/api/projects${query ? `?${query}` : ''}`);
  }

  async getProject(slug: string) {
    return this.request(`/api/projects/${slug}`);
  }

  async getFeaturedProjects() {
    return this.request('/api/projects?featured=true&limit=6');
  }

  // 分类相关API
  async getCategories() {
    return this.request('/api/categories');
  }

  async getCategory(slug: string) {
    return this.request(`/api/categories/${slug}`);
  }

  // 标签相关API
  async getTags() {
    return this.request('/api/tags');
  }

  async getTag(slug: string) {
    return this.request(`/api/tags/${slug}`);
  }

  // 评论相关API
  async getComments(postId: string) {
    return this.request(`/api/posts/${postId}/comments`);
  }

  async createComment(postId: string, data: {
    content: string;
    author: string;
    email: string;
    website?: string;
  }) {
    return this.request(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 统计相关API
  async getStats() {
    return this.request('/api/stats');
  }

  // 搜索API
  async search(query: string, type?: 'posts' | 'projects') {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);

    return this.request(`/api/search?${params.toString()}`);
  }

  // 增加浏览量
  async incrementViews(type: 'post' | 'project', id: string) {
    return this.request(`/api/${type}s/${id}/views`, {
      method: 'POST',
    });
  }

  // 点赞
  async toggleLike(type: 'post' | 'project', id: string) {
    return this.request(`/api/${type}s/${id}/like`, {
      method: 'POST',
    });
  }

  // 用户相关API (公开信息)
  async getUsers() {
    return this.request('/api/users/public');
  }

  async getUser(id: string) {
    return this.request(`/api/users/public/${id}`);
  }

  // 媒体相关API
  async getMedia() {
    return this.request('/api/media');
  }

  async getMediaItem(id: string) {
    return this.request(`/api/media/${id}`);
  }

  // 系统设置API (公开设置)
  async getPublicSettings() {
    return this.request('/api/settings/public');
  }

  // 数据统计API (公开统计)
  async getPublicStats() {
    return this.request('/api/analytics/public');
  }

  // 健康检查API
  async getHealth() {
    return this.request('/api/health');
  }

  // 归档相关API
  async getArchive(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const query = params.toString();
    return this.request(`/api/archive${query ? `?${query}` : ''}`);
  }

  // 站点地图API
  async getSitemap() {
    return this.request('/api/sitemap');
  }

  // RSS订阅API
  async getRSSFeed() {
    return this.request('/api/rss');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
