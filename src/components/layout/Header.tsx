'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/common/SearchBar';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

export interface HeaderProps {
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onThemeToggle,
  isDarkMode = false,
  user,
  className,
}) => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { getSuggestions, addToHistory } = useSearchSuggestions();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    onSearch?.(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addToHistory(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleThemeToggle = () => {
    onThemeToggle?.();
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  // Mock notifications data
  const notifications = [
    { id: 1, title: 'New trending article', message: 'AI Revolution is trending now', time: '2m ago', unread: true },
    { id: 2, title: 'Content update', message: 'Your feed has been refreshed', time: '5m ago', unread: true },
    { id: 3, title: 'Weekly summary', message: 'Your content digest is ready', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      {/* Backdrop Blur Overlay */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}

      <header className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        'border-b border-gray-200/50 dark:border-gray-700/50',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
        'shadow-sm hover:shadow-md',
        className
      )}>
        {/* Animated Border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          {/* Enhanced Logo */}
          <div className="flex items-center group">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 group-hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <span className="text-white font-bold text-lg">✨</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Dashboard
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  AI-Powered
                </div>
              </div>
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-lg mx-6 lg:mx-12 relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <SearchBar
                  onSearch={handleSearch}
                  onSuggestionClick={handleSuggestionClick}
                  placeholder="Search anything..."
                  className="w-full bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all duration-300"
                  showSuggestions={true}
                  suggestions={getSuggestions('')}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle with Enhanced Animation */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="group relative p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                aria-label="Toggle theme"
              >
                <div className="relative z-10">
                  {isDarkMode ? (
                    <svg className="h-5 w-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Enhanced Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotificationToggle}
                className="group relative p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                aria-label="Notifications"
              >
                <div className="relative z-10">
                  <svg className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white flex items-center justify-center font-bold animate-pulse shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              {/* Enhanced Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 z-40 animate-in slide-in-from-top-2 duration-300">
                  <div className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
                    
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full border-0">
                          {unreadCount} new
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-200 ${notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                      <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                        View All Notifications
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="group flex items-center space-x-2 rounded-xl p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-9 w-9 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all duration-300 shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-64 z-40 animate-in slide-in-from-top-2 duration-300">
                    <div className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
                      
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-lg object-cover" />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Premium Member</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        {[
                          { icon: '👤', label: 'Profile', action: () => router.push('/profile') },
                          { icon: '⚙️', label: 'Settings', action: () => router.push('/settings') },
                          { icon: '📊', label: 'Analytics', action: () => router.push('/analytics') },
                          { icon: '💎', label: 'Upgrade', action: () => router.push('/upgrade') },
                        ].map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              item.action();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                        
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        
                        <button 
                          onClick={() => {
                            console.log('Sign out clicked');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                        >
                          <span className="text-lg">🚪</span>
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/auth/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <span className="text-lg">✨</span>
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Subtle bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </header>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-in {
          animation: animate-in 0.2s ease-out;
        }
        
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.3s ease-out;
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;