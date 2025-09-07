// API Configuration
export const API_CONFIG = {
  NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
  TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
  NEWS_API_BASE_URL: 'https://newsapi.org/v2',
  TMDB_API_BASE_URL: 'https://api.themoviedb.org/3',
  SOCIAL_API_BASE_URL: '/api/social', // Mock API
} as const;

// App Configuration
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 0.8,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  FAVORITES: 'favorites',
  READ_ITEMS: 'read_items',
  THEME: 'theme',
  SEARCH_HISTORY: 'search_history',
} as const;

// Content Categories
export const CONTENT_CATEGORIES = {
  TECHNOLOGY: 'technology',
  SPORTS: 'sports',
  FINANCE: 'finance',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  SCIENCE: 'science',
} as const;

// Content Types
export const CONTENT_TYPES = {
  NEWS: 'news',
  RECOMMENDATION: 'recommendation',
  SOCIAL: 'social',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;
