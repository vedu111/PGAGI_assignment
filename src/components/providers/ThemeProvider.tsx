'use client';

import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (isDark: boolean) => {
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      apply(media.matches);
      const listener = (e: MediaQueryListEvent) => apply(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }

    apply(theme === 'dark');
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;


