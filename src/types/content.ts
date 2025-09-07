export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  category: string;
  publishedAt: Date;
  url: string;
  type: ContentType;
  isFavorite?: boolean;
  isRead?: boolean;
  metadata?: Record<string, any>;
}

export type ContentType = 'news' | 'recommendation' | 'social';

export interface NewsItem extends ContentItem {
  type: 'news';
  author?: string;
  content?: string;
  tags?: string[];
}

export interface RecommendationItem extends ContentItem {
  type: 'recommendation';
  rating?: number;
  genre?: string;
  duration?: string;
  year?: number;
}

export interface SocialItem extends ContentItem {
  type: 'social';
  author: string;
  likes?: number;
  shares?: number;
  comments?: number;
  hashtags?: string[];
}

export interface SocialPost extends SocialItem {
  platform: string;
  verified?: boolean;
}

export interface ContentFeed {
  items: ContentItem[];
  hasMore: boolean;
  nextPage?: number;
  totalCount?: number;
}

export interface SearchResult {
  query: string;
  results: ContentItem[];
  totalResults: number;
  searchTime: number;
}

export interface TrendingItem {
  id: string;
  title: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: 'hour' | 'day' | 'week';
}
