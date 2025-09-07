export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export interface NewsApiResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    source: {
      name: string;
    };
    author?: string;
    content?: string;
  }>;
  totalResults: number;
  status: string;
}

export interface TMDBResponse {
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    backdrop_path?: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
  }>;
  page: number;
  total_pages: number;
  total_results: number;
}

export interface SocialApiResponse {
  posts: Array<{
    id: string;
    text: string;
    author: {
      name: string;
      username: string;
      avatar?: string;
    };
    created_at: string;
    likes: number;
    shares: number;
    comments: number;
    hashtags: string[];
    media?: Array<{
      type: 'image' | 'video';
      url: string;
    }>;
  }>;
  meta: {
    total: number;
    page: number;
    has_more: boolean;
  };
}
