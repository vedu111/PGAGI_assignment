'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTheme, toggleSidebar } from '@/store/slices/uiSlice';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showSidebar = true,
  showHeader = true,
}) => {
  const dispatch = useAppDispatch();
  const { sidebarOpen, theme } = useAppSelector((state) => state.ui);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    // Theme applied by ThemeProvider globally
  }, [theme]);

  const handleSearch = (query: string) => {
    // Search is now handled by the Header component directly
    console.log('Search query:', query);
  };

  // Mock user data
  const user = {
    name: 'John Doe',
    avatar: undefined,
  };

  return (
    <div className={cn('min-h-screen bg-white dark:bg-gray-900', className)}>
      {/* Header */}
      {showHeader && (
        <Header
          onSearch={handleSearch}
          onThemeToggle={handleThemeToggle}
          isDarkMode={theme === 'dark'}
          user={user}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => dispatch(toggleSidebar())}
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 transition-all duration-300',
            showSidebar ? 'lg:ml-0' : 'ml-0'
          )}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Button */}
      {showSidebar && (
        <button
          onClick={handleSidebarToggle}
          className="fixed bottom-4 left-4 z-30 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-transform hover:scale-105 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Layout;
