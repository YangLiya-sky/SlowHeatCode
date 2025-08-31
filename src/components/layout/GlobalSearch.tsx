'use client';

import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Search } from '@mui/icons-material';
import SearchModal from '@/components/search/SearchModal';

interface GlobalSearchProps {
  className?: string;
}

export default function GlobalSearch({ className = '' }: GlobalSearchProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // 监听键盘快捷键
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K 或 Cmd+K 打开搜索
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      // ESC 关闭搜索
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Tooltip title="搜索 (Ctrl+K)" placement="bottom">
        <IconButton
          onClick={() => setSearchOpen(true)}
          className={`text-white/80 hover:text-white transition-colors ${className}`}
          size="medium"
        >
          <Search />
        </IconButton>
      </Tooltip>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
