import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SocialPost } from '@/types/content';
import { API_CONFIG } from '@/config/api';

// Mock social media data
const mockSocialPosts: SocialPost[] = [
  {
    id: 'social-1',
    title: 'Breaking: New AI breakthrough in healthcare',
    description: 'Researchers have developed a new AI system that can diagnose diseases with 95% accuracy...',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    source: 'TechNews',
    category: 'technology',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    url: 'https://example.com/ai-breakthrough',
    type: 'social',
    author: 'Dr. Sarah Johnson',
    platform: 'Twitter',
    likes: 1250,
    shares: 89,
    comments: 156,
    hashtags: ['#AI', '#Healthcare', '#Innovation'],
    verified: true,
  },
  {
    id: 'social-2',
    title: 'Climate change summit reaches historic agreement',
    description: 'World leaders have agreed on new measures to combat climate change...',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4466c4e0a1?w=500',
    source: 'ClimateNews',
    category: 'environment',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    url: 'https://example.com/climate-summit',
    type: 'social',
    author: 'Green Earth',
    platform: 'Instagram',
    likes: 3400,
    shares: 234,
    comments: 89,
    hashtags: ['#ClimateChange', '#Environment', '#Sustainability'],
    verified: true,
  },
  {
    id: 'social-3',
    title: 'SpaceX launches new satellite constellation',
    description: 'SpaceX successfully launched 60 new Starlink satellites into orbit...',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500',
    source: 'SpaceNews',
    category: 'science',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    url: 'https://example.com/spacex-launch',
    type: 'social',
    author: 'SpaceX',
    platform: 'Twitter',
    likes: 8900,
    shares: 567,
    comments: 234,
    hashtags: ['#SpaceX', '#Starlink', '#Space'],
    verified: true,
  },
  {
    id: 'social-4',
    title: 'New cryptocurrency reaches all-time high',
    description: 'Bitcoin and other cryptocurrencies are experiencing significant gains...',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500',
    source: 'CryptoNews',
    category: 'finance',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    url: 'https://example.com/crypto-high',
    type: 'social',
    author: 'CryptoAnalyst',
    platform: 'LinkedIn',
    likes: 567,
    shares: 123,
    comments: 45,
    hashtags: ['#Bitcoin', '#Crypto', '#Finance'],
    verified: false,
  },
  {
    id: 'social-5',
    title: 'Olympic Games 2024 preparations underway',
    description: 'Paris is gearing up for the 2024 Olympic Games with new infrastructure...',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    source: 'SportsNews',
    category: 'sports',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    url: 'https://example.com/olympics-2024',
    type: 'social',
    author: 'Olympic Committee',
    platform: 'Facebook',
    likes: 2340,
    shares: 189,
    comments: 78,
    hashtags: ['#Olympics2024', '#Paris', '#Sports'],
    verified: true,
  },
];

// Transform function for consistency
const transformSocialPost = (post: any): SocialPost => ({
  ...post,
  publishedAt: new Date(post.publishedAt),
});

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.SOCIAL_API.BASE_URL,
  }),
  tagTypes: ['Social'],
  endpoints: (builder) => ({
    // Get all social posts
    getSocialPosts: builder.query<SocialPost[], {
      page?: number;
      pageSize?: number;
      platform?: string;
      category?: string;
    }>({
      query: ({ page = 1, pageSize = 20, platform, category }) => {
        // Mock API call - in real implementation, this would be a server endpoint
        return {
          url: API_CONFIG.SOCIAL_API.ENDPOINTS.POSTS,
          params: {
            page,
            pageSize,
            ...(platform && { platform }),
            ...(category && { category }),
          },
        };
      },
      transformResponse: () => {
        // Mock response - return filtered data
        return mockSocialPosts.map(transformSocialPost);
      },
      providesTags: ['Social'],
    }),

    // Search social posts
    searchSocialPosts: builder.query<SocialPost[], {
      query: string;
      page?: number;
      pageSize?: number;
    }>({
      query: ({ query, page = 1, pageSize = 20 }) => ({
        url: API_CONFIG.SOCIAL_API.ENDPOINTS.SEARCH_POSTS,
        params: {
          query,
          page,
          pageSize,
        },
      }),
      transformResponse: (_, __, { query }) => {
        // Mock search - filter posts by query
        const filteredPosts = mockSocialPosts.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description.toLowerCase().includes(query.toLowerCase()) ||
          post.hashtags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
        );
        return filteredPosts.map(transformSocialPost);
      },
      providesTags: ['Social'],
    }),

    // Get trending social posts
    getTrendingSocialPosts: builder.query<SocialPost[], {
      timeWindow?: 'hour' | 'day' | 'week';
      page?: number;
      pageSize?: number;
    }>({
      query: ({ timeWindow = 'day', page = 1, pageSize = 20 }) => ({
        url: API_CONFIG.SOCIAL_API.ENDPOINTS.TRENDING_POSTS,
        params: {
          timeWindow,
          page,
          pageSize,
        },
      }),
      transformResponse: () => {
        // Mock trending - return posts sorted by engagement
        const trendingPosts = [...mockSocialPosts].sort((a, b) => 
          (b.likes + b.shares + b.comments) - (a.likes + a.shares + a.comments)
        );
        return trendingPosts.map(transformSocialPost);
      },
      providesTags: ['Social'],
    }),

    // Get posts by user
    getUserPosts: builder.query<SocialPost[], {
      userId: string;
      page?: number;
      pageSize?: number;
    }>({
      query: ({ userId, page = 1, pageSize = 20 }) => ({
        url: API_CONFIG.SOCIAL_API.ENDPOINTS.USER_POSTS,
        params: {
          userId,
          page,
          pageSize,
        },
      }),
      transformResponse: (_, __, { userId }) => {
        // Mock user posts - filter by author
        const userPosts = mockSocialPosts.filter(post => 
          post.author.toLowerCase().includes(userId.toLowerCase())
        );
        return userPosts.map(transformSocialPost);
      },
      providesTags: (result, error, { userId }) => [
        { type: 'Social', id: userId },
      ],
    }),

    // Get posts by platform
    getPostsByPlatform: builder.query<SocialPost[], {
      platform: string;
      page?: number;
      pageSize?: number;
    }>({
      query: ({ platform, page = 1, pageSize = 20 }) => ({
        url: API_CONFIG.SOCIAL_API.ENDPOINTS.POSTS,
        params: {
          platform,
          page,
          pageSize,
        },
      }),
      transformResponse: (_, __, { platform }) => {
        // Mock platform posts
        const platformPosts = mockSocialPosts.filter(post => 
          post.platform.toLowerCase() === platform.toLowerCase()
        );
        return platformPosts.map(transformSocialPost);
      },
      providesTags: (result, error, { platform }) => [
        { type: 'Social', id: platform },
      ],
    }),
  }),
});

export const {
  useGetSocialPostsQuery,
  useSearchSocialPostsQuery,
  useGetTrendingSocialPostsQuery,
  useGetUserPostsQuery,
  useGetPostsByPlatformQuery,
} = socialApi;