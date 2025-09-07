import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsApiResponse } from '@/types/api';
import { NewsItem } from '@/types/content';
import { API_CONFIG } from '@/config/api';

// Transform NewsAPI response to our ContentItem format
const transformNewsItem = (article: any, forcedCategory?: string): NewsItem => ({
  id: `news-${article.url?.split('/').pop() || Math.random().toString(36).substr(2, 9)}`,
  title: article.title || 'No title',
  description: article.description || '',
  imageUrl: article.urlToImage,
  source: article.source?.name || 'Unknown source',
  // If we requested a specific category (e.g., business), use it so preferences can filter properly
  category: forcedCategory || 'news',
  publishedAt: new Date(article.publishedAt),
  url: article.url,
  type: 'news',
  author: article.author,
  content: article.content,
  tags: article.title?.split(' ').slice(0, 5) || [],
});

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.NEWS_API.BASE_URL,
    prepareHeaders: (headers) => {
      if (API_CONFIG.NEWS_API.API_KEY) {
        // NewsAPI expects 'X-Api-Key'
        headers.set('X-Api-Key', API_CONFIG.NEWS_API.API_KEY);
      }
      return headers;
    },
  }),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    // Get top headlines
    getTopHeadlines: builder.query<NewsItem[], {
      country?: string;
      category?: string;
      page?: number;
      pageSize?: number;
    }>({
      query: ({ country = 'us', category, page = 1, pageSize = 20 }) => ({
        url: '/top-headlines',
        params: {
          country,
          ...(category && { category }),
          page,
          pageSize,
        },
      }),
      // Stamp items with the requested category so downstream filters work
      transformResponse: (response: NewsApiResponse, _meta, arg) =>
        response.articles?.map((a: any) => transformNewsItem(a, arg?.category)) || [],
      providesTags: ['News'],
    }),

    // Get everything (search)
    getEverything: builder.query<NewsItem[], {
      q: string;
      sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
      page?: number;
      pageSize?: number;
      from?: string;
      to?: string;
    }>({
      query: ({ q, sortBy = 'publishedAt', page = 1, pageSize = 20, from, to }) => ({
        url: '/everything',
        params: {
          q,
          sortBy,
          page,
          pageSize,
          ...(from && { from }),
          ...(to && { to }),
        },
      }),
      transformResponse: (response: NewsApiResponse) =>
        response.articles?.map((a: any) => transformNewsItem(a)) || [],
      providesTags: ['News'],
    }),

    // Get sources
    getSources: builder.query<any[], {
      category?: string;
      country?: string;
      language?: string;
    }>({
      query: ({ category, country, language }) => ({
        url: '/sources',
        params: {
          ...(category && { category }),
          ...(country && { country }),
          ...(language && { language }),
        },
      }),
      transformResponse: (response: any) => response.sources || [],
    }),

    // Get news by category
    getNewsByCategory: builder.query<NewsItem[], {
      category: string;
      page?: number;
      pageSize?: number;
    }>({
      query: ({ category, page = 1, pageSize = 20 }) => ({
        url: '/top-headlines',
        params: {
          category,
          page,
          pageSize,
        },
      }),
      transformResponse: (response: NewsApiResponse, _meta, arg) =>
        response.articles?.map((a: any) => transformNewsItem(a, arg?.category)) || [],
      providesTags: (result, error, { category }) => [
        { type: 'News', id: category },
      ],
    }),
  }),
});

export const {
  useGetTopHeadlinesQuery,
  useGetEverythingQuery,
  useGetSourcesQuery,
  useGetNewsByCategoryQuery,
} = newsApi;
