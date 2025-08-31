'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Avatar, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { Send, Reply, MoreVert, ThumbUp, ThumbDown } from '@mui/icons-material';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  parentId?: string;
}

interface CommentSystemProps {
  postId: string;
  postType: 'post' | 'project';
}

export function CommentSystem({ postId, postType }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?${postType}Id=${postId}&status=APPROVED`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Load comments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (content: string, parentId?: string) => {
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          [postType + 'Id']: postId,
          parentId,
          // 这里应该包含用户认证信息
          author: {
            name: '访客', // 临时使用访客，实际应该从认证系统获取
            email: 'guest@example.com'
          }
        }),
      });

      if (response.ok) {
        // 重新加载评论
        await loadComments();
        setNewComment('');
        setReplyContent('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Submit comment error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string, type: 'like' | 'dislike') => {
    try {
      const response = await fetch(`/api/comments/${commentId}/${type}`, {
        method: 'POST',
      });
      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error('Like comment error:', error);
    }
  };

  const CommentItem = ({ comment, level = 0 }: { comment: Comment; level?: number }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
      <Box className={`${level > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
        <GlassCard className="p-4">
          <Box className="flex items-start gap-3">
            <Avatar className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500">
              {comment.author.name.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box className="flex-1">
              <Box className="flex items-center justify-between mb-2">
                <Box>
                  <Typography variant="subtitle2" className="text-white font-semibold">
                    {comment.author.name}
                  </Typography>
                  <Typography variant="caption" className="text-white/60">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  className="text-white/60"
                >
                  <MoreVert fontSize="small" />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => {
                    setReplyTo(comment.id);
                    setAnchorEl(null);
                  }}>
                    回复
                  </MenuItem>
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    举报
                  </MenuItem>
                </Menu>
              </Box>
              
              <Typography variant="body2" className="text-white/80 mb-3 leading-relaxed">
                {comment.content}
              </Typography>
              
              <Box className="flex items-center gap-4">
                <Box className="flex items-center gap-1">
                  <IconButton
                    size="small"
                    onClick={() => handleLike(comment.id, 'like')}
                    className="text-white/60 hover:text-green-400"
                  >
                    <ThumbUp fontSize="small" />
                  </IconButton>
                  <Typography variant="caption" className="text-white/60">
                    {comment.likes || 0}
                  </Typography>
                </Box>
                
                <Box className="flex items-center gap-1">
                  <IconButton
                    size="small"
                    onClick={() => handleLike(comment.id, 'dislike')}
                    className="text-white/60 hover:text-red-400"
                  >
                    <ThumbDown fontSize="small" />
                  </IconButton>
                  <Typography variant="caption" className="text-white/60">
                    {comment.dislikes || 0}
                  </Typography>
                </Box>
                
                <GlassButton
                  size="small"
                  variant="outlined"
                  startIcon={<Reply />}
                  onClick={() => setReplyTo(comment.id)}
                  className="text-xs"
                >
                  回复
                </GlassButton>
              </Box>
            </Box>
          </Box>
          
          {/* 回复表单 */}
          {replyTo === comment.id && (
            <Box className="mt-4 ml-11">
              <TextField
                fullWidth
                multiline
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`回复 ${comment.author.name}...`}
                className="bg-white/5 rounded-lg mb-3"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    color: 'white'
                  }
                }}
              />
              <Box className="flex gap-2">
                <GlassButton
                  size="small"
                  variant="contained"
                  onClick={() => submitComment(replyContent, comment.id)}
                  disabled={!replyContent.trim() || submitting}
                >
                  发送回复
                </GlassButton>
                <GlassButton
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                >
                  取消
                </GlassButton>
              </Box>
            </Box>
          )}
        </GlassCard>
        
        {/* 递归渲染回复 */}
        {comment.replies && comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} level={level + 1} />
        ))}
      </Box>
    );
  };

  return (
    <Box className="mt-12">
      <Typography variant="h5" className="text-white font-bold mb-6">
        评论 ({comments.length})
      </Typography>
      
      {/* 评论表单 */}
      <GlassCard className="p-6 mb-8">
        <Typography variant="h6" className="text-white font-semibold mb-4">
          发表评论
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的想法..."
          className="bg-white/5 rounded-lg mb-4"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              color: 'white'
            }
          }}
        />
        <Box className="flex justify-end">
          <GlassButton
            variant="contained"
            startIcon={<Send />}
            onClick={() => submitComment(newComment)}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? '发送中...' : '发表评论'}
          </GlassButton>
        </Box>
      </GlassCard>
      
      {/* 评论列表 */}
      {loading ? (
        <Box className="text-center py-8">
          <Box className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></Box>
          <Typography variant="body2" className="text-white/70">
            加载评论中...
          </Typography>
        </Box>
      ) : comments.length > 0 ? (
        <Box>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </Box>
      ) : (
        <Box className="text-center py-12">
          <Typography variant="h6" className="text-white/70 mb-2">
            暂无评论
          </Typography>
          <Typography variant="body2" className="text-white/50">
            成为第一个评论的人吧！
          </Typography>
        </Box>
      )}
    </Box>
  );
}
