'use client';

import { createTheme } from '@mui/material/styles';

// 创建 Material UI 主题，支持玻璃拟态设计
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: 'rgba(15, 23, 42, 0.95)', // Dark slate with transparency
      paper: 'rgba(30, 41, 59, 0.8)', // Lighter slate with transparency
    },
    text: {
      primary: 'rgba(248, 250, 252, 0.95)',
      secondary: 'rgba(203, 213, 225, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
          backdropFilter: 'blur(20px)',
        },
        contained: {
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(236, 72, 153, 0.8))',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(236, 72, 153, 0.9))',
          },
        },
        outlined: {
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
  },
});
