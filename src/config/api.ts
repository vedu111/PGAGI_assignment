// API Configuration
export const API_CONFIG = {
  // News API Configuration
  NEWS_API: {
    BASE_URL: process.env.NEXT_PUBLIC_NEWS_API_BASE_URL || 'https://newsapi.org/v2',
    API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
    ENDPOINTS: {
      EVERYTHING: '/everything',
      TOP_HEADLINES: '/top-headlines',
      SOURCES: '/sources',
    },
  },
  
  // TMDB API Configuration
  TMDB_API: {
    BASE_URL: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3',
    API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    ENDPOINTS: {
      SEARCH_MOVIE: '/search/movie',
      DISCOVER_MOVIE: '/discover/movie',
      TRENDING_MOVIE: '/trending/movie/day',
      MOVIE_DETAILS: '/movie',
      GENRES: '/genre/movie/list',
    },
  },
  
  // Mock Social Media API Configuration
  SOCIAL_API: {
    BASE_URL: process.env.NEXT_PUBLIC_SOCIAL_API_BASE_URL || 'http://localhost:3001/api',
    ENDPOINTS: {
      POSTS: '/posts',
      SEARCH_POSTS: '/posts/search',
      TRENDING_POSTS: '/posts/trending',
      USER_POSTS: '/posts/user',
    },
  },
  
  // Request Configuration
  REQUEST: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
};

// API Key Validation
export const validateApiKeys = () => {
  const missingKeys: string[] = [];
  
  if (!API_CONFIG.NEWS_API.API_KEY) {
    missingKeys.push('NEXT_PUBLIC_NEWS_API_KEY');
  }
  
  if (!API_CONFIG.TMDB_API.API_KEY) {
    missingKeys.push('NEXT_PUBLIC_TMDB_API_KEY');
  }
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
};

// Get API Key Status
export const getApiKeyStatus = () => {
  const newsApiKey = API_CONFIG.NEWS_API.API_KEY;
  const tmdbApiKey = API_CONFIG.TMDB_API.API_KEY;
  
  return {
    newsApi: !!(newsApiKey && newsApiKey !== 'your_news_api_key_here' && newsApiKey.length > 10),
    tmdbApi: !!(tmdbApiKey && tmdbApiKey !== 'your_tmdb_api_key_here' && tmdbApiKey.length > 10),
    socialApi: true, // Mock API doesn't need key
  };
};
