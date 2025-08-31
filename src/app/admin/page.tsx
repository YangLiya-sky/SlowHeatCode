'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Container, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Switch, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { Dashboard, Article, Visibility, Edit, Delete, Add, TrendingUp, People, Settings, Logout, Analytics, Schedule, Save, Cancel, Category, Label, Comment, PhotoLibrary, Web } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarkdownEditor } from '@/components/ui/MarkdownEditor';
import { useDataSync, notifyDataChange } from '@/lib/dataSync';
import { SyncStatusIndicator } from '@/components/providers/DataSyncProvider';
import { useRealTimeAnalytics, useRealTimeMedia } from '@/lib/realTimeSync';
import { notifyDataUpdate } from '@/lib/realTimeNotify';
import { MediaGrid } from '@/components/ui/MediaGrid';

// 动态导入重型组件
const FileUpload = dynamic(() => import('@/components/ui/FileUpload').then(mod => ({ default: mod.FileUpload })), {
  loading: () => <Box className="p-4 text-center text-white/70">加载中...</Box>,
  ssr: false
});

const MediaPreview = dynamic(() => import('@/components/ui/FileUpload').then(mod => ({ default: mod.MediaPreview })), {
  loading: () => <Box className="p-4 text-center text-white/70">加载中...</Box>,
  ssr: false
});

// 这些模拟数据将被真实数据替换

const menuItems = [
  { id: 'dashboard', label: '仪表板', icon: Dashboard },
  { id: 'posts', label: '文章管理', icon: Article },
  { id: 'projects', label: '项目管理', icon: Web },
  { id: 'categories', label: '分类管理', icon: Category },
  { id: 'tags', label: '标签管理', icon: Label },
  { id: 'comments', label: '评论管理', icon: Comment },
  { id: 'media', label: '媒体库', icon: PhotoLibrary },
  { id: 'users', label: '用户管理', icon: People },
  { id: 'analytics', label: '数据分析', icon: Analytics },
  { id: 'settings', label: '系统设置', icon: Settings }
];

export default function AdminPage() {
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [replyingComment, setReplyingComment] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [deletingMediaIds, setDeletingMediaIds] = useState<Set<string>>(new Set());

  // 使用数据同步hooks
  const { data: syncedPosts, refresh: refreshPosts } = useDataSync('admin-posts');
  const { data: syncedProjects, refresh: refreshProjects } = useDataSync('admin-projects');
  const { data: syncedCategories, refresh: refreshCategories } = useDataSync('categories');
  const { data: syncedTags, refresh: refreshTags } = useDataSync('tags');
  const { data: syncedComments, refresh: refreshComments } = useDataSync('comments');
  const { data: syncedUsers, refresh: refreshUsers } = useDataSync('users');
  const { data: syncedMedia, refresh: refreshMedia } = useDataSync('media');
  const { data: syncedSettings, refresh: refreshSettings } = useDataSync('settings');

  // 使用实时数据同步hooks
  const { data: realTimeAnalytics, connected: analyticsConnected } = useRealTimeAnalytics();
  const { data: realTimeMedia, connected: mediaConnected } = useRealTimeMedia();

  // 当实时数据更新时，更新本地状态
  useEffect(() => {
    if (realTimeAnalytics) {
      setAnalytics(realTimeAnalytics);
    }
  }, [realTimeAnalytics]);

  useEffect(() => {
    if (realTimeMedia && Array.isArray(realTimeMedia)) {
      setMedia(realTimeMedia);
    }
  }, [realTimeMedia]);

  // 自动清除消息
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // 新建/编辑文章表单数据
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    featured: false,
    category: '',
    tags: [] as string[],
  });

  // 新建/编辑项目表单数据
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    technologies: '',
    category: '',
    githubUrl: '',
    liveUrl: '',
    status: 'DRAFT',
    featured: false,
    startDate: '',
    endDate: ''
  });

  const [editingProject, setEditingProject] = useState<any>(null);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);

  // 检查认证状态
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  // 加载数据
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      switch (activeTab) {
        case 'dashboard':
          loadAnalytics();
          loadPosts();
          break;
        case 'posts':
          loadPosts();
          loadCategories();
          loadTags();
          break;
        case 'projects':
          loadProjects();
          break;
        case 'categories':
          loadCategories();
          break;
        case 'tags':
          loadTags();
          break;
        case 'comments':
          loadComments();
          break;
        case 'media':
          loadMedia();
          break;
        case 'users':
          loadUsers();
          break;
        case 'analytics':
          loadAnalytics();
          break;
        case 'website':
        case 'settings':
          loadSettings();
          break;
      }
    }
  }, [activeTab, isAuthenticated, isAdmin]);



  const loadPosts = async () => {
    try {
      setLoadingData(true);
      await refreshPosts();
      if (syncedPosts && Array.isArray(syncedPosts)) {
        setPosts(syncedPosts);
      } else if (syncedPosts && typeof syncedPosts === 'object' && 'posts' in syncedPosts) {
        setPosts((syncedPosts as any).posts);
      }
    } catch (error) {
      console.error('Load posts error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoadingData(true);
      await refreshProjects();
      if (syncedProjects && Array.isArray(syncedProjects)) {
        setProjects(syncedProjects);
      } else if (syncedProjects && typeof syncedProjects === 'object' && 'projects' in syncedProjects) {
        setProjects((syncedProjects as any).projects);
      }
    } catch (error) {
      console.error('Load projects error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoadingData(true);
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Load analytics error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadCategories = async () => {
    try {
      await refreshCategories();
      if (syncedCategories && Array.isArray(syncedCategories)) {
        setCategories(syncedCategories);
      } else if (syncedCategories && typeof syncedCategories === 'object' && 'categories' in syncedCategories) {
        setCategories((syncedCategories as any).categories);
      }
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const loadTags = async () => {
    try {
      await refreshTags();
      if (syncedTags && Array.isArray(syncedTags)) {
        setTags(syncedTags);
      } else if (syncedTags && typeof syncedTags === 'object' && 'tags' in syncedTags) {
        setTags((syncedTags as any).tags);
      }
    } catch (error) {
      console.error('Load tags error:', error);
    }
  };

  const loadComments = async () => {
    try {
      await refreshComments();
      if (syncedComments && Array.isArray(syncedComments)) {
        setComments(syncedComments);
      } else if (syncedComments && typeof syncedComments === 'object' && 'comments' in syncedComments) {
        setComments((syncedComments as any).comments);
      }
    } catch (error) {
      console.error('Load comments error:', error);
    }
  };

  const loadMedia = async () => {
    try {
      await refreshMedia();
      if (syncedMedia && Array.isArray(syncedMedia)) {
        setMedia(syncedMedia);
      } else if (syncedMedia && typeof syncedMedia === 'object' && 'media' in syncedMedia) {
        setMedia((syncedMedia as any).media);
      }
    } catch (error) {
      console.error('Load media error:', error);
    }
  };

  const loadUsers = async () => {
    try {
      await refreshUsers();
      if (syncedUsers && Array.isArray(syncedUsers)) {
        setUsers(syncedUsers);
      } else if (syncedUsers && typeof syncedUsers === 'object' && 'users' in syncedUsers) {
        setUsers((syncedUsers as any).users);
      }
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Load settings error:', error);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      status: post.status,
      featured: post.featured,
      category: post.category?.id || '',
      tags: post.tags?.map((tag: any) => tag.id) || [],
    });
    setOpenDialog(true);
  };

  // 分类管理函数
  const handleCreateCategory = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        setSuccess('分类创建成功');
        loadCategories();
        // 通知前台数据变化
        notifyDataChange('categories', null);
        notifyDataChange('posts', null);
      } else {
        const data = await response.json();
        setError(data.error || '创建分类失败');
      }
    } catch (error) {
      setError('创建分类失败');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('分类删除成功');
        loadCategories();
        // 通知前台数据变化
        notifyDataChange('categories', null);
      } else {
        const data = await response.json();
        setError(data.error || '删除分类失败');
      }
    } catch (error) {
      setError('删除分类失败');
    }
  };

  // 标签管理函数
  const handleCreateTag = async (name: string) => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setSuccess('标签创建成功');
        loadTags();
        // 通知前台数据变化
        notifyDataChange('tags', null);
      } else {
        const data = await response.json();
        setError(data.error || '创建标签失败');
      }
    } catch (error) {
      setError('创建标签失败');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('确定要删除这个标签吗？')) return;

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('标签删除成功');
        loadTags();
        // 通知前台数据变化
        notifyDataChange('tags', null);
      } else {
        const data = await response.json();
        setError(data.error || '删除标签失败');
      }
    } catch (error) {
      setError('删除标签失败');
    }
  };

  // 评论管理函数
  const handleApproveComment = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (response.ok) {
        setSuccess('评论审核通过');
        loadComments();
        // 通知前台数据变化
        notifyDataChange('comments', null);
      } else {
        setError('审核失败');
      }
    } catch (error) {
      setError('审核失败');
    }
  };

  const handleRejectComment = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (response.ok) {
        setSuccess('评论已拒绝');
        loadComments();
        // 通知前台数据变化
        notifyDataChange('comments', null);
      } else {
        setError('拒绝失败');
      }
    } catch (error) {
      setError('拒绝失败');
    }
  };

  const handleReplyComment = async (id: string, content: string) => {
    try {
      const response = await fetch(`/api/comments/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setSuccess('回复成功');
        loadComments();
        // 通知前台数据变化
        notifyDataChange('comments', null);
      } else {
        const data = await response.json();
        setError(data.error || '回复失败');
      }
    } catch (error) {
      setError('回复失败');
    }
  };

  // 项目管理函数
  const handleNewProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      slug: '',
      description: '',
      content: '',
      technologies: '',
      category: '',
      githubUrl: '',
      liveUrl: '',
      status: 'DRAFT',
      featured: false,
      startDate: '',
      endDate: ''
    });
    setOpenProjectDialog(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content || '',
      technologies: project.technologies || '',
      category: project.category || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      status: project.status,
      featured: project.featured,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : ''
    });
    setOpenProjectDialog(true);
  };

  const handleSaveProject = async () => {
    try {
      setLoadingData(true);
      setError('');

      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const projectData = {
        title: projectForm.title,
        slug: projectForm.slug || undefined,
        description: projectForm.description,
        content: projectForm.content,
        technologies: projectForm.technologies,
        category: projectForm.category,
        githubUrl: projectForm.githubUrl || null,
        liveUrl: projectForm.liveUrl || null,
        status: projectForm.status,
        featured: projectForm.featured,
        startDate: projectForm.startDate || null,
        endDate: projectForm.endDate || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingProject ? '项目更新成功' : '项目创建成功');
        setOpenProjectDialog(false);
        setEditingProject(null);
        setProjectForm({
          title: '',
          slug: '',
          description: '',
          content: '',
          technologies: '',
          category: '',
          githubUrl: '',
          liveUrl: '',
          status: 'DRAFT',
          featured: false,
          startDate: '',
          endDate: ''
        });
        loadProjects();
        // 通知前台数据变化
        notifyDataChange('projects', null);
        notifyDataChange('admin-projects', null);
      } else {
        setError(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Save project error:', error);
      setError('保存失败，请稍后重试');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    try {
      setLoadingData(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('项目删除成功');
        loadProjects();
        // 通知前台数据变化
        notifyDataChange('projects', null);
        notifyDataChange('admin-projects', null);
      } else {
        const data = await response.json();
        setError(data.error || '删除失败');
      }
    } catch (error) {
      setError('删除失败，请稍后重试');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('评论删除成功');
        loadComments();
        // 通知前台数据变化
        notifyDataChange('comments', null);
      } else {
        setError('删除评论失败');
      }
    } catch (error) {
      setError('删除评论失败');
    }
  };

  // 媒体库函数
  const handleUploadMedia = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 确保发送cookies
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('文件上传成功');
        loadMedia();
      } else {
        const data = await response.json();
        setError(data.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('上传失败');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('确定要删除这个文件吗？')) return;

    // 防止重复删除
    if (deletingMediaIds.has(id)) {
      setError('文件正在删除中，请稍候...');
      return;
    }

    try {
      setDeletingMediaIds(prev => new Set(prev).add(id));

      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('文件删除成功');
        // 立即从本地状态中移除文件，避免重复删除
        setMedia(prev => prev.filter(item => item.id !== id));
        // 通知前台数据变化
        notifyDataChange('media', null);
      } else {
        const data = await response.json();
        if (response.status === 404) {
          setError('文件不存在，可能已被删除');
          // 如果文件不存在，也从本地状态中移除
          setMedia(prev => prev.filter(item => item.id !== id));
        } else {
          setError(data.error || '删除文件失败');
        }
      }
    } catch (error) {
      setError('删除文件失败');
    } finally {
      setDeletingMediaIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // 用户管理函数
  const handleCreateUser = async (userData: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSuccess('用户创建成功');
        loadUsers();
        // 通知前台数据变化
        notifyDataChange('users', null);
      } else {
        const data = await response.json();
        setError(data.error || '创建用户失败');
      }
    } catch (error) {
      setError('创建用户失败');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('确定要删除这个用户吗？')) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('用户删除成功');
        loadUsers();
        // 通知前台数据变化
        notifyDataChange('users', null);
      } else {
        const data = await response.json();
        setError(data.error || '删除用户失败');
      }
    } catch (error) {
      setError('删除用户失败');
    }
  };

  // 设置管理函数
  const handleSaveSettings = async (newSettings: any) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        setSuccess('设置保存成功');
        setSettings({ ...settings, ...newSettings });
      } else {
        const data = await response.json();
        setError(data.error || '保存设置失败');
      }
    } catch (error) {
      setError('保存设置失败');
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'DRAFT',
      featured: false,
      category: '',
      tags: [],
    });
    setOpenDialog(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('文章删除成功');
        loadPosts();
      } else {
        const data = await response.json();
        setError(data.error || '删除失败');
      }
    } catch (error) {
      setError('删除失败，请稍后重试');
    }
  };

  const handleSavePost = async () => {
    try {
      setLoadingData(true);
      setError('');

      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      // 准备发送的数据
      const postData = {
        title: postForm.title,
        slug: postForm.slug || undefined,
        excerpt: postForm.excerpt,
        content: postForm.content,
        status: postForm.status,
        featured: postForm.featured,
        categoryId: postForm.category || null,
        tags: Array.isArray(postForm.tags) ? postForm.tags : []
      };

      console.log('Sending post data:', postData); // 调试日志

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      console.log('Response data:', data); // 调试日志

      if (response.ok) {
        setSuccess(editingPost ? '文章更新成功' : '文章创建成功');
        setOpenDialog(false);
        setEditingPost(null);
        setPostForm({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          status: 'DRAFT',
          featured: false,
          category: '',
          tags: []
        });
        loadPosts();
        // 通知前台数据变化
        notifyDataChange('posts', null);
        notifyDataChange('admin-posts', null);
        if (activeTab === 'dashboard') {
          loadAnalytics();
        }
      } else {
        setError(data.error || '保存失败');
        console.error('Save error:', data);
      }
    } catch (error) {
      console.error('Save post error:', error);
      setError('保存失败，请稍后重试');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* 消息提示 */}
      {error && (
        <Box className="fixed top-20 right-4 z-50">
          <Alert severity="error" onClose={() => setError('')} sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}>
            {error}
          </Alert>
        </Box>
      )}

      {success && (
        <Box className="fixed top-20 right-4 z-50">
          <Alert severity="success" onClose={() => setSuccess('')} sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}>
            {success}
          </Alert>
        </Box>
      )}

      {/* 管理员头部 */}
      <Box className="relative py-12 px-4 lg:px-8">
        <Container maxWidth="xl">
          <Box className="flex items-center justify-between mb-8">
            <Box>
              <Typography variant="h3" className="text-white font-bold mb-2">
                管理后台
              </Typography>
              <Typography variant="h6" className="text-white/70">
                欢迎回来，{user?.name || user?.username}
              </Typography>
            </Box>
            <Box className="flex items-center gap-4">
              <SyncStatusIndicator />
              <GlassButton glassVariant="outline" onClick={handleLogout}>
                <Logout className="mr-2" />
                退出登录
              </GlassButton>
            </Box>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 侧边栏 */}
            <Box className="lg:col-span-1">
              <GlassCard className="p-6">
                <Typography variant="h6" className="text-white font-semibold mb-4">
                  导航菜单
                </Typography>
                <Box className="space-y-2">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Box
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === item.id
                          ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        <IconComponent />
                        <Typography variant="body1" className="font-medium">
                          {item.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </GlassCard>
            </Box>

            {/* 主内容区 */}
            <Box className="lg:col-span-3">
              {/* 仪表板 */}
              {activeTab === 'dashboard' && (
                <Box className="space-y-8">
                  {/* 实时连接状态指示器 */}
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h4" className="text-white font-bold">
                      仪表板
                    </Typography>
                    <Box className="flex items-center gap-4">
                      <Box className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${analyticsConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${analyticsConnected ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        {analyticsConnected ? '实时连接' : '连接断开'}
                      </Box>
                      <SyncStatusIndicator />
                    </Box>
                  </Box>

                  {/* 统计卡片 */}
                  <Box className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {analytics && [
                      { title: '总文章数', value: analytics.overview.totalPosts, icon: Article, color: 'from-blue-500 to-cyan-500', change: `+${analytics.overview.thisMonthPosts} 本月` },
                      { title: '总访问量', value: analytics.overview.totalViews.toLocaleString(), icon: Visibility, color: 'from-green-500 to-emerald-500', change: '+12% 本月' },
                      { title: '已发布', value: analytics.overview.publishedPosts, icon: TrendingUp, color: 'from-purple-500 to-pink-500', change: `${analytics.overview.draftPosts} 草稿` },
                      { title: '平均阅读时间', value: `${analytics.overview.avgReadTime}分钟`, icon: Schedule, color: 'from-orange-500 to-red-500', change: '+0.3分钟' }
                    ].map((stat, index) => {
                      const IconComponent = stat.icon;
                      return (
                        <GlassCard key={index} className="p-6">
                          <Box className="flex items-center justify-between mb-4">
                            <Box className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                              <IconComponent className="text-white text-xl" />
                            </Box>
                            <TrendingUp className="text-green-400" />
                          </Box>
                          <Typography variant="h4" className="text-white font-bold mb-1">
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" className="text-white/70 mb-2">
                            {stat.title}
                          </Typography>
                          <Typography variant="body2" className="text-green-400">
                            {stat.change}
                          </Typography>
                        </GlassCard>
                      );
                    })}
                  </Box>

                  {/* 最近文章 */}
                  <GlassCard className="p-6">
                    <Box className="flex items-center justify-between mb-6">
                      <Typography variant="h5" className="text-white font-bold">
                        最近文章
                      </Typography>
                      <GlassButton glassVariant="primary" size="small" onClick={handleNewPost}>
                        <Add className="mr-1" />
                        新建文章
                      </GlassButton>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-white/70 border-white/10">标题</TableCell>
                            <TableCell className="text-white/70 border-white/10">状态</TableCell>
                            <TableCell className="text-white/70 border-white/10">访问量</TableCell>
                            <TableCell className="text-white/70 border-white/10">日期</TableCell>
                            <TableCell className="text-white/70 border-white/10">操作</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {posts.slice(0, 5).map((post) => (
                            <TableRow key={post.id} className="hover:bg-white/5">
                              <TableCell className="text-white border-white/10">
                                <Typography variant="body1" className="font-medium">
                                  {post.title}
                                </Typography>
                                <Typography variant="body2" className="text-white/60">
                                  {typeof post.category === 'object' ? post.category?.name : post.category || '未分类'}
                                </Typography>
                              </TableCell>
                              <TableCell className="border-white/10">
                                <Chip
                                  label={getStatusText(post.status)}
                                  size="small"
                                  className={getStatusColor(post.status)}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell className="text-white border-white/10">
                                {post.views.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-white/70 border-white/10">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="border-white/10">
                                <Box className="flex gap-1">
                                  <IconButton
                                    size="small"
                                    className="text-white/70 hover:text-white"
                                    onClick={() => handleEditPost(post)}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    className="text-white/70 hover:text-red-400"
                                    onClick={() => handleDeletePost(post.id)}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </GlassCard>
                </Box>
              )}

              {/* 项目管理 */}
              {activeTab === 'projects' && (
                <GlassCard className="p-6">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="text-white font-bold">
                      项目管理
                    </Typography>
                    <GlassButton glassVariant="primary" onClick={handleNewProject}>
                      <Add className="mr-2" />
                      新建项目
                    </GlassButton>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-white/70">标题</TableCell>
                          <TableCell className="text-white/70">状态</TableCell>
                          <TableCell className="text-white/70">技术栈</TableCell>
                          <TableCell className="text-white/70">浏览量</TableCell>
                          <TableCell className="text-white/70">创建时间</TableCell>
                          <TableCell className="text-white/70">操作</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="text-white">
                              <Box>
                                <Typography variant="body1" className="font-medium">
                                  {project.title}
                                </Typography>
                                <Typography variant="body2" className="text-white/60">
                                  {project.description.substring(0, 50)}...
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={project.status}
                                size="small"
                                color={
                                  project.status === 'ACTIVE' ? 'success' :
                                    project.status === 'COMPLETED' ? 'primary' :
                                      project.status === 'ARCHIVED' ? 'default' : 'warning'
                                }
                              />
                            </TableCell>
                            <TableCell className="text-white/70">
                              {project.technologies || '-'}
                            </TableCell>
                            <TableCell className="text-white/70">
                              {project.views || 0}
                            </TableCell>
                            <TableCell className="text-white/70">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Box className="flex gap-2">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditProject(project)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassCard>
              )}

              {/* 文章管理 */}
              {activeTab === 'posts' && (
                <GlassCard className="p-6">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="text-white font-bold">
                      文章管理
                    </Typography>
                    <GlassButton glassVariant="primary" onClick={handleNewPost}>
                      <Add className="mr-2" />
                      新建文章
                    </GlassButton>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-white/70 border-white/10">标题</TableCell>
                          <TableCell className="text-white/70 border-white/10">状态</TableCell>
                          <TableCell className="text-white/70 border-white/10">分类</TableCell>
                          <TableCell className="text-white/70 border-white/10">访问量</TableCell>
                          <TableCell className="text-white/70 border-white/10">创建时间</TableCell>
                          <TableCell className="text-white/70 border-white/10">操作</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id} className="hover:bg-white/5">
                            <TableCell className="text-white border-white/10">
                              <Typography variant="body1" className="font-medium">
                                {post.title}
                              </Typography>
                              <Typography variant="body2" className="text-white/60">
                                {post.excerpt?.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell className="border-white/10">
                              <Chip
                                label={getStatusText(post.status)}
                                size="small"
                                className={getStatusColor(post.status)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell className="text-white/70 border-white/10">
                              {typeof post.category === 'object' ? post.category?.name : post.category || '未分类'}
                            </TableCell>
                            <TableCell className="text-white border-white/10">
                              {post.views.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-white/70 border-white/10">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="border-white/10">
                              <Box className="flex gap-1">
                                <IconButton
                                  size="small"
                                  className="text-white/70 hover:text-white"
                                  onClick={() => handleEditPost(post)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  className="text-white/70 hover:text-red-400"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassCard>
              )}

              {/* 数据分析 */}
              {activeTab === 'analytics' && analytics && (
                <Box className="space-y-8">
                  {/* 实时连接状态 */}
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h4" className="text-white font-bold">
                      数据分析
                    </Typography>
                    <Box className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${analyticsConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${analyticsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                      {analyticsConnected ? '实时更新中' : '数据静态'}
                    </Box>
                  </Box>

                  {/* 概览统计 */}
                  <GlassCard className="p-6">
                    <Typography variant="h5" className="text-white font-bold mb-6">
                      数据概览
                    </Typography>

                    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Box className="text-center">
                        <Typography variant="h3" className="gradient-text font-bold mb-2">
                          {analytics.overview.totalPosts}
                        </Typography>
                        <Typography variant="body1" className="text-white/70">
                          总文章数
                        </Typography>
                      </Box>
                      <Box className="text-center">
                        <Typography variant="h3" className="gradient-text font-bold mb-2">
                          {analytics.overview.totalViews.toLocaleString()}
                        </Typography>
                        <Typography variant="body1" className="text-white/70">
                          总访问量
                        </Typography>
                      </Box>
                      <Box className="text-center">
                        <Typography variant="h3" className="gradient-text font-bold mb-2">
                          {analytics.overview.publishedPosts}
                        </Typography>
                        <Typography variant="body1" className="text-white/70">
                          已发布文章
                        </Typography>
                      </Box>
                      <Box className="text-center">
                        <Typography variant="h3" className="gradient-text font-bold mb-2">
                          {analytics.overview.draftPosts}
                        </Typography>
                        <Typography variant="body1" className="text-white/70">
                          草稿文章
                        </Typography>
                      </Box>
                    </Box>
                  </GlassCard>

                  {/* 热门文章 */}
                  <GlassCard className="p-6">
                    <Typography variant="h5" className="text-white font-bold mb-6">
                      热门文章
                    </Typography>

                    <Box className="space-y-4">
                      {analytics.popularPosts.map((post: any, index: number) => (
                        <Box key={post.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                          <Box className="flex items-center gap-4">
                            <Box className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold">
                              {index + 1}
                            </Box>
                            <Typography variant="body1" className="text-white font-medium">
                              {post.title}
                            </Typography>
                          </Box>
                          <Box className="flex items-center gap-4 text-white/70">
                            <Box className="flex items-center gap-1">
                              <Visibility fontSize="small" />
                              <span>{post.views.toLocaleString()}</span>
                            </Box>
                            <Box className="flex items-center gap-1">
                              <TrendingUp fontSize="small" />
                              <span>{post.likes}</span>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </GlassCard>

                  {/* 分类统计 */}
                  <GlassCard className="p-6">
                    <Typography variant="h5" className="text-white font-bold mb-6">
                      分类统计
                    </Typography>

                    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analytics.categoryStats.map((stat: any, index: number) => (
                        <Box key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <Typography variant="h6" className="text-white font-semibold mb-2">
                            {typeof stat.category === 'object' ? stat.category?.name : stat.category || '未分类'}
                          </Typography>
                          <Typography variant="h4" className="gradient-text font-bold">
                            {stat.count}
                          </Typography>
                          <Typography variant="body2" className="text-white/60">
                            篇文章
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </GlassCard>
                </Box>
              )}

              {/* 分类管理 */}
              {activeTab === 'categories' && (
                <GlassCard className="p-6">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="text-white font-bold">
                      分类管理
                    </Typography>
                    <GlassButton
                      glassVariant="primary"
                      onClick={() => {
                        const name = prompt('请输入分类名称:');
                        if (name) {
                          const description = prompt('请输入分类描述 (可选):') || '';
                          handleCreateCategory(name, description);
                        }
                      }}
                    >
                      <Add className="mr-2" />
                      新建分类
                    </GlassButton>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-white/70 border-white/10">分类名称</TableCell>
                          <TableCell className="text-white/70 border-white/10">描述</TableCell>
                          <TableCell className="text-white/70 border-white/10">文章数量</TableCell>
                          <TableCell className="text-white/70 border-white/10">创建时间</TableCell>
                          <TableCell className="text-white/70 border-white/10">操作</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category.id} className="hover:bg-white/5">
                            <TableCell className="text-white border-white/10">
                              <Typography variant="body1" className="font-medium">
                                {category.name}
                              </Typography>
                            </TableCell>
                            <TableCell className="text-white/70 border-white/10">
                              {category.description || `${category.name}相关的技术文章和教程`}
                            </TableCell>
                            <TableCell className="text-white border-white/10">
                              {category.postCount || 0}
                            </TableCell>
                            <TableCell className="text-white/70 border-white/10">
                              {new Date(category.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="border-white/10">
                              <Box className="flex gap-1">
                                <IconButton
                                  size="small"
                                  className="text-white/70 hover:text-white"
                                  onClick={() => {
                                    const newName = prompt('请输入新的分类名称:', category.name);
                                    const newDescription = prompt('请输入新的分类描述:', category.description);
                                    if (newName) {
                                      handleCreateCategory(newName, newDescription || '');
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  className="text-white/70 hover:text-red-400"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassCard>
              )}

              {/* 标签管理 */}
              {activeTab === 'tags' && (
                <GlassCard className="p-6">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="text-white font-bold">
                      标签管理
                    </Typography>
                    <GlassButton
                      glassVariant="primary"
                      onClick={() => {
                        const name = prompt('请输入标签名称:');
                        if (name) {
                          handleCreateTag(name);
                        }
                      }}
                    >
                      <Add className="mr-2" />
                      新建标签
                    </GlassButton>
                  </Box>

                  <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tags.map((tag) => (
                      <Box key={tag.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Box className="flex items-center justify-between mb-2">
                          <Chip
                            label={tag.name}
                            size="small"
                            className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-0"
                          />
                          <Box className="flex gap-1">
                            <IconButton
                              size="small"
                              className="text-white/70 hover:text-white"
                              onClick={() => {
                                const newName = prompt('请输入新的标签名称:', tag.name);
                                if (newName) {
                                  handleCreateTag(newName);
                                }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              className="text-white/70 hover:text-red-400"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" className="text-white/60">
                          {tag.postCount || 0} 篇文章
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </GlassCard>
              )}

              {/* 评论管理 */}
              {activeTab === 'comments' && (
                <GlassCard className="p-6">
                  <Typography variant="h5" className="text-white font-bold mb-6">
                    评论管理
                  </Typography>

                  <Box className="space-y-4">
                    {comments.map((comment) => (
                      <Box key={comment.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <Box className="flex items-start justify-between mb-3">
                          <Box>
                            <Typography variant="body1" className="text-white font-medium">
                              {comment.guestName || comment.author?.name || '匿名用户'}
                            </Typography>
                            <Typography variant="body2" className="text-white/60">
                              评论于《{comment.post?.title}》
                            </Typography>
                          </Box>
                          <Box className="flex items-center gap-2">
                            <Chip
                              label={comment.status === 'APPROVED' ? '已审核' : comment.status === 'PENDING' ? '待审核' : '已拒绝'}
                              size="small"
                              className={
                                comment.status === 'APPROVED'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : comment.status === 'PENDING'
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }
                              variant="outlined"
                            />
                            <Typography variant="body2" className="text-white/60">
                              {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" className="text-white/80 mb-3">
                          {comment.content}
                        </Typography>
                        <Box className="flex gap-2">
                          {comment.status === 'PENDING' && (
                            <>
                              <GlassButton
                                glassVariant="primary"
                                size="small"
                                onClick={() => handleApproveComment(comment.id)}
                              >
                                审核通过
                              </GlassButton>
                              <GlassButton
                                glassVariant="ghost"
                                size="small"
                                onClick={() => handleRejectComment(comment.id)}
                              >
                                拒绝
                              </GlassButton>
                            </>
                          )}
                          <GlassButton
                            glassVariant="ghost"
                            size="small"
                            onClick={() => setReplyingComment(comment.id)}
                          >
                            回复
                          </GlassButton>
                          <GlassButton
                            glassVariant="ghost"
                            size="small"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            删除
                          </GlassButton>
                        </Box>

                        {/* 回复对话框 */}
                        {replyingComment === comment.id && (
                          <Box className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                            <Typography variant="body2" className="text-white/80 mb-2">
                              回复评论：
                            </Typography>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="输入回复内容..."
                              variant="outlined"
                              className="mb-3"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  color: 'white',
                                  '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.7)',
                                  },
                                },
                                '& .MuiInputLabel-root': {
                                  color: 'rgba(255, 255, 255, 0.7)',
                                },
                              }}
                            />
                            <Box className="flex gap-2">
                              <GlassButton
                                glassVariant="primary"
                                size="small"
                                onClick={() => {
                                  if (replyContent.trim()) {
                                    handleReplyComment(comment.id, replyContent);
                                    setReplyingComment(null);
                                    setReplyContent('');
                                  }
                                }}
                              >
                                发送回复
                              </GlassButton>
                              <GlassButton
                                glassVariant="ghost"
                                size="small"
                                onClick={() => {
                                  setReplyingComment(null);
                                  setReplyContent('');
                                }}
                              >
                                取消
                              </GlassButton>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </GlassCard>
              )}

              {/* 媒体库 */}
              {activeTab === 'media' && (
                <GlassCard className="p-6">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="text-white font-bold">
                      媒体库
                    </Typography>
                    <Box className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${mediaConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${mediaConnected ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      {mediaConnected ? '实时同步' : '同步断开'}
                    </Box>
                  </Box>

                  <Box className="mb-8">
                    <FileUpload
                      onUpload={handleUploadMedia}
                      accept="image/*,video/*,application/pdf"
                      maxSize={10}
                      multiple
                    />
                  </Box>

                  {/* 使用新的媒体网格组件 */}
                  <MediaGrid
                    media={media || []}
                    onDeleteMedia={handleDeleteMedia}
                    onSelectMedia={(media) => {
                      console.log('Selected media:', media);
                    }}
                    showRealTimeStatus={false}
                  />
                </GlassCard>
              )}

              {/* 用户管理 */}
              {activeTab === 'users' && (
                <GlassCard className="p-6">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="text-white font-bold">
                      用户管理
                    </Typography>
                    <GlassButton
                      glassVariant="primary"
                      onClick={() => {
                        const email = prompt('请输入用户邮箱:');
                        if (email) {
                          const username = prompt('请输入用户名:');
                          const password = prompt('请输入密码:');
                          const name = prompt('请输入姓名 (可选):') || username;
                          const role = confirm('是否设为管理员？') ? 'ADMIN' : 'USER';

                          if (username && password) {
                            handleCreateUser({ email, username, password, name, role });
                          }
                        }
                      }}
                    >
                      <Add className="mr-2" />
                      新建用户
                    </GlassButton>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-white/70 border-white/10">用户名</TableCell>
                          <TableCell className="text-white/70 border-white/10">邮箱</TableCell>
                          <TableCell className="text-white/70 border-white/10">角色</TableCell>
                          <TableCell className="text-white/70 border-white/10">状态</TableCell>
                          <TableCell className="text-white/70 border-white/10">注册时间</TableCell>
                          <TableCell className="text-white/70 border-white/10">操作</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-white/5">
                            <TableCell className="text-white border-white/10">
                              <Typography variant="body1" className="font-medium">
                                {user.name || user.username}
                              </Typography>
                            </TableCell>
                            <TableCell className="text-white/70 border-white/10">
                              {user.email}
                            </TableCell>
                            <TableCell className="border-white/10">
                              <Chip
                                label={user.role === 'ADMIN' ? '管理员' : '用户'}
                                size="small"
                                className={user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell className="border-white/10">
                              <Chip
                                label="活跃"
                                size="small"
                                className="bg-green-500/20 text-green-400 border-green-500/30"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell className="text-white/70 border-white/10">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="border-white/10">
                              <Box className="flex gap-1">
                                <IconButton
                                  size="small"
                                  className="text-white/70 hover:text-white"
                                  onClick={() => {
                                    // 这里可以添加编辑用户的逻辑
                                    console.log('Edit user:', user);
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                {user.role !== 'ADMIN' && (
                                  <IconButton
                                    size="small"
                                    className="text-white/70 hover:text-red-400"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GlassCard>
              )}

              {/* 网站设置 */}
              {activeTab === 'website' && (
                <GlassCard className="p-6">
                  <Typography variant="h5" className="text-white font-bold mb-6">
                    网站设置
                  </Typography>

                  <Box className="space-y-6">
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        label="网站标题"
                        value={settings.site_title || ''}
                        onChange={(e) => setSettings((prev: any) => ({ ...prev, site_title: e.target.value }))}
                        variant="outlined"
                        InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                        InputProps={{ style: { color: 'white' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="网站副标题"
                        value={settings.site_subtitle || ''}
                        onChange={(e) => setSettings((prev: any) => ({ ...prev, site_subtitle: e.target.value }))}
                        variant="outlined"
                        InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                        InputProps={{ style: { color: 'white' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="网站描述"
                      multiline
                      rows={3}
                      value={settings.site_description || ''}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, site_description: e.target.value }))}
                      variant="outlined"
                      InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      InputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    />

                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        fullWidth
                        label="联系邮箱"
                        value={settings.contact_email || ''}
                        onChange={(e) => setSettings((prev: any) => ({ ...prev, contact_email: e.target.value }))}
                        variant="outlined"
                        InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                        InputProps={{ style: { color: 'white' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="GitHub 链接"
                        value={settings.github_url || ''}
                        onChange={(e) => setSettings((prev: any) => ({ ...prev, github_url: e.target.value }))}
                        variant="outlined"
                        InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                        InputProps={{ style: { color: 'white' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        }}
                      />
                    </Box>

                    <Box className="flex justify-end">
                      <GlassButton
                        glassVariant="primary"
                        onClick={() => handleSaveSettings({
                          site_title: settings.site_title,
                          site_subtitle: settings.site_subtitle,
                          site_description: settings.site_description,
                          contact_email: settings.contact_email,
                          github_url: settings.github_url
                        })}
                      >
                        <Save className="mr-2" />
                        保存设置
                      </GlassButton>
                    </Box>
                  </Box>
                </GlassCard>
              )}

              {/* 系统设置 */}
              {activeTab === 'settings' && (
                <GlassCard className="p-6">
                  <Typography variant="h5" className="text-white font-bold mb-6">
                    系统设置
                  </Typography>

                  <Box className="space-y-6">
                    {/* 评论功能 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          评论功能
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          允许访客在文章下方发表评论
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.enable_comments || false}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, enable_comments: newValue }));
                          await handleSaveSettings({ enable_comments: newValue });
                          // 通知实时数据更新
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* 访问统计 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          访问统计
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          记录文章访问量和用户行为数据
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.enable_analytics || false}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, enable_analytics: newValue }));
                          await handleSaveSettings({ enable_analytics: newValue });
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* 评论审核 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          评论审核
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          新评论需要管理员审核后才能显示
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.comment_moderation || false}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, comment_moderation: newValue }));
                          await handleSaveSettings({ comment_moderation: newValue });
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* 自动备份 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          自动备份
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          每日自动备份数据库和媒体文件
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.auto_backup || false}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, auto_backup: newValue }));
                          await handleSaveSettings({ auto_backup: newValue });
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* SEO 优化 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          SEO 优化
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          自动生成 sitemap 和 robots.txt
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.seo_optimization || false}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, seo_optimization: newValue }));
                          await handleSaveSettings({ seo_optimization: newValue });
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* 媒体文件实时预览 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          媒体实时预览
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          启用媒体文件的实时预览功能
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.enable_media_preview || true}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, enable_media_preview: newValue }));
                          await handleSaveSettings({ enable_media_preview: newValue });
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* 实时数据同步 */}
                    <Box className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <Box>
                        <Typography variant="body1" className="text-white font-medium">
                          实时数据同步
                        </Typography>
                        <Typography variant="body2" className="text-white/60">
                          启用仪表板和数据分析的实时更新
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.enable_realtime_sync || true}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings((prev: any) => ({ ...prev, enable_realtime_sync: newValue }));
                          await handleSaveSettings({ enable_realtime_sync: newValue });
                          await notifyDataUpdate('settings');
                        }}
                      />
                    </Box>

                    {/* 文件上传限制 */}
                    <Box className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <Typography variant="body1" className="text-white font-medium mb-3">
                        文件上传设置
                      </Typography>
                      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                          label="最大文件大小 (MB)"
                          type="number"
                          value={settings.max_file_size || 10}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 10;
                            setSettings((prev: any) => ({ ...prev, max_file_size: newValue }));
                          }}
                          onBlur={async () => {
                            await handleSaveSettings({ max_file_size: settings.max_file_size });
                            await notifyDataUpdate('settings');
                          }}
                          variant="outlined"
                          size="small"
                          InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                          InputProps={{ style: { color: 'white' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }
                          }}
                        />
                        <TextField
                          label="允许的文件类型"
                          value={settings.allowed_file_types || 'jpg,jpeg,png,gif,pdf,mp4,webm'}
                          onChange={(e) => {
                            setSettings((prev: any) => ({ ...prev, allowed_file_types: e.target.value }));
                          }}
                          onBlur={async () => {
                            await handleSaveSettings({ allowed_file_types: settings.allowed_file_types });
                            await notifyDataUpdate('settings');
                          }}
                          variant="outlined"
                          size="small"
                          placeholder="jpg,jpeg,png,gif,pdf,mp4"
                          InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                          InputProps={{ style: { color: 'white' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </GlassCard>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 编辑文章对话框 */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle className="text-white">
          {editingPost ? '编辑文章' : '新建文章'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="文章标题"
                value={postForm.title}
                onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                variant="outlined"
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ style: { color: 'white' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />

              <TextField
                fullWidth
                label="URL别名 (可选)"
                value={postForm.slug}
                onChange={(e) => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                variant="outlined"
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ style: { color: 'white' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="文章摘要"
              value={postForm.excerpt}
              onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
              multiline
              rows={2}
              variant="outlined"
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            />

            <Box className="mb-4">
              <Typography variant="body2" className="text-white/70 mb-2">
                文章内容 (支持Markdown格式)
              </Typography>
              <MarkdownEditor
                value={postForm.content}
                onChange={(value) => setPostForm(prev => ({ ...prev, content: value }))}
                placeholder="请输入文章内容，支持Markdown格式..."
                height={500}
                showFileUpload={true}
                onFileImport={(content, title, excerpt) => {
                  setPostForm(prev => ({
                    ...prev,
                    content,
                    title: prev.title || title, // 只有当标题为空时才自动填充
                    excerpt: prev.excerpt || excerpt // 只有当摘要为空时才自动填充
                  }));
                }}
              />
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl fullWidth>
                <InputLabel style={{ color: 'rgba(255, 255, 255, 0.7)' }}>状态</InputLabel>
                <Select
                  value={postForm.status}
                  onChange={(e) => setPostForm(prev => ({ ...prev, status: e.target.value }))}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <MenuItem value="DRAFT">草稿</MenuItem>
                  <MenuItem value="PUBLISHED">已发布</MenuItem>
                  <MenuItem value="ARCHIVED">已归档</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel style={{ color: 'rgba(255, 255, 255, 0.7)' }}>分类</InputLabel>
                <Select
                  value={postForm.category}
                  onChange={(e) => setPostForm(prev => ({ ...prev, category: e.target.value }))}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <MenuItem value="">
                    <em>无分类</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel style={{ color: 'rgba(255, 255, 255, 0.7)' }}>标签</InputLabel>
                <Select
                  multiple
                  value={postForm.tags}
                  onChange={(e) => setPostForm(prev => ({
                    ...prev,
                    tags: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                  }))}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99, 102, 241, 0.8)' },
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const tag = tags.find(t => t.id === value);
                        return (
                          <Chip
                            key={value}
                            label={tag?.name || value}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(99, 102, 241, 0.2)',
                              color: 'white',
                              '& .MuiChip-deleteIcon': { color: 'rgba(255, 255, 255, 0.7)' }
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={postForm.featured}
                  onChange={(e) => setPostForm(prev => ({ ...prev, featured: e.target.checked }))}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              }
              label="设为精选文章"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <GlassButton glassVariant="ghost" onClick={() => setOpenDialog(false)}>
            <Cancel className="mr-1" />
            取消
          </GlassButton>
          <GlassButton
            glassVariant="primary"
            onClick={handleSavePost}
            disabled={loadingData}
          >
            {loadingData ? (
              <>
                <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Box>
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-1" />
                保存
              </>
            )}
          </GlassButton>
        </DialogActions>
      </Dialog>

      {/* 项目编辑对话框 */}
      <Dialog
        open={openProjectDialog}
        onClose={() => setOpenProjectDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: 'bg-black/90 backdrop-blur-xl border border-white/10'
        }}
      >
        <DialogTitle className="text-white border-b border-white/10">
          {editingProject ? '编辑项目' : '新建项目'}
        </DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="项目标题"
            value={projectForm.title}
            onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
            variant="outlined"
            className="mb-4"
            InputLabelProps={{ className: 'text-white/70' }}
            InputProps={{ className: 'text-white' }}
          />

          <TextField
            fullWidth
            label="URL别名"
            value={projectForm.slug}
            onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value }))}
            variant="outlined"
            className="mb-4"
            InputLabelProps={{ className: 'text-white/70' }}
            InputProps={{ className: 'text-white' }}
            helperText="留空将自动生成"
          />

          <TextField
            fullWidth
            label="项目描述"
            value={projectForm.description}
            onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
            variant="outlined"
            multiline
            rows={3}
            className="mb-4"
            InputLabelProps={{ className: 'text-white/70' }}
            InputProps={{ className: 'text-white' }}
          />

          <TextField
            fullWidth
            label="技术栈"
            value={projectForm.technologies}
            onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
            variant="outlined"
            className="mb-4"
            InputLabelProps={{ className: 'text-white/70' }}
            InputProps={{ className: 'text-white' }}
            helperText="用逗号分隔，如：React, TypeScript, Node.js"
          />

          <TextField
            fullWidth
            label="项目分类"
            value={projectForm.category}
            onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
            variant="outlined"
            className="mb-4"
            InputLabelProps={{ className: 'text-white/70' }}
            InputProps={{ className: 'text-white' }}
            helperText="如：Web应用, 移动应用, AI/ML, 开源工具"
          />

          <Box className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="GitHub链接"
              value={projectForm.githubUrl}
              onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ className: 'text-white/70' }}
              InputProps={{ className: 'text-white' }}
            />

            <TextField
              fullWidth
              label="演示链接"
              value={projectForm.liveUrl}
              onChange={(e) => setProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ className: 'text-white/70' }}
              InputProps={{ className: 'text-white' }}
            />
          </Box>

          <Box className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="开始日期"
              type="date"
              value={projectForm.startDate}
              onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ className: 'text-white/70', shrink: true }}
              InputProps={{ className: 'text-white' }}
            />

            <TextField
              fullWidth
              label="结束日期"
              type="date"
              value={projectForm.endDate}
              onChange={(e) => setProjectForm(prev => ({ ...prev, endDate: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ className: 'text-white/70', shrink: true }}
              InputProps={{ className: 'text-white' }}
            />
          </Box>

          <FormControl fullWidth className="mb-4">
            <InputLabel className="text-white/70">状态</InputLabel>
            <Select
              value={projectForm.status}
              onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
              className="text-white"
            >
              <MenuItem value="DRAFT">草稿</MenuItem>
              <MenuItem value="ACTIVE">进行中</MenuItem>
              <MenuItem value="COMPLETED">已完成</MenuItem>
              <MenuItem value="ARCHIVED">已归档</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={projectForm.featured}
                onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                className="text-blue-400"
              />
            }
            label="特色项目"
            className="text-white"
          />

          <MarkdownEditor
            value={projectForm.content}
            onChange={(value) => setProjectForm(prev => ({ ...prev, content: value }))}
            placeholder="请输入项目详细内容，支持Markdown格式..."
            height={300}
            showFileUpload={false}
          />
        </DialogContent>
        <DialogActions className="border-t border-white/10 p-4">
          <GlassButton
            glassVariant="secondary"
            onClick={() => setOpenProjectDialog(false)}
          >
            <Cancel className="mr-1" />
            取消
          </GlassButton>
          <GlassButton
            glassVariant="primary"
            onClick={handleSaveProject}
            disabled={loadingData}
          >
            {loadingData ? (
              <>
                <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Box>
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-1" />
                保存
              </>
            )}
          </GlassButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}
