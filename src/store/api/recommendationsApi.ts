import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TMDBResponse } from '@/types/api';
import { RecommendationItem } from '@/types/content';
import { API_CONFIG } from '@/config/api';

// Transform TMDB response to our ContentItem format
const transformRecommendationItem = (item: any): RecommendationItem => ({
  id: `rec-${item.id}`,
  title: item.title || item.name || 'No title',
  description: item.overview || '',
  imageUrl: item.poster_path ? `${API_CONFIG.TMDB_API.IMAGE_BASE_URL}/w500${item.poster_path}` : undefined,
  source: 'TMDB',
  category: 'entertainment',
  publishedAt: new Date(item.release_date || item.first_air_date || Date.now()),
  url: `https://www.themoviedb.org/movie/${item.id}`,
  type: 'recommendation',
  rating: item.vote_average,
  genre: item.genre_ids?.join(', ') || '',
  year: new Date(item.release_date || item.first_air_date || Date.now()).getFullYear(),
});

export const recommendationsApi = createApi({
  reducerPath: 'recommendationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.TMDB_API.BASE_URL,
    prepareHeaders: (headers) => {
      if (API_CONFIG.TMDB_API.API_KEY) {
        headers.set('Authorization', `Bearer ${API_CONFIG.TMDB_API.API_KEY}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Recommendations'],
  endpoints: (builder) => ({
    // Get popular movies
    getPopularMovies: builder.query<RecommendationItem[], {
      page?: number;
    }>({
      query: ({ page = 1 }) => ({
        url: '/movie/popular',
        params: {
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: ['Recommendations'],
    }),

    // Get top rated movies
    getTopRatedMovies: builder.query<RecommendationItem[], {
      page?: number;
    }>({
      query: ({ page = 1 }) => ({
        url: '/movie/top_rated',
        params: {
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: ['Recommendations'],
    }),

    // Get now playing movies
    getNowPlayingMovies: builder.query<RecommendationItem[], {
      page?: number;
    }>({
      query: ({ page = 1 }) => ({
        url: '/movie/now_playing',
        params: {
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: ['Recommendations'],
    }),

    // Get upcoming movies
    getUpcomingMovies: builder.query<RecommendationItem[], {
      page?: number;
    }>({
      query: ({ page = 1 }) => ({
        url: '/movie/upcoming',
        params: {
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: ['Recommendations'],
    }),

    // Search movies
    searchMovies: builder.query<RecommendationItem[], {
      query: string;
      page?: number;
    }>({
      query: ({ query, page = 1 }) => ({
        url: '/search/movie',
        params: {
          query,
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: ['Recommendations'],
    }),

    // Get movie details
    getMovieDetails: builder.query<RecommendationItem, {
      movieId: number;
    }>({
      query: ({ movieId }) => ({
        url: `/movie/${movieId}`,
      }),
      transformResponse: (response: any) => transformRecommendationItem(response),
      providesTags: (result, error, { movieId }) => [
        { type: 'Recommendations', id: movieId },
      ],
    }),

    // Get movie recommendations
    getMovieRecommendations: builder.query<RecommendationItem[], {
      movieId: number;
      page?: number;
    }>({
      query: ({ movieId, page = 1 }) => ({
        url: `/movie/${movieId}/recommendations`,
        params: {
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: (result, error, { movieId }) => [
        { type: 'Recommendations', id: `recommendations-${movieId}` },
      ],
    }),

    // Get trending movies
    getTrendingMovies: builder.query<RecommendationItem[], {
      timeWindow?: 'day' | 'week';
      page?: number;
    }>({
      query: ({ timeWindow = 'week', page = 1 }) => ({
        url: `/trending/movie/${timeWindow}`,
        params: {
          page,
        },
      }),
      transformResponse: (response: TMDBResponse) => 
        response.results?.map(transformRecommendationItem) || [],
      providesTags: ['Recommendations'],
    }),
  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetUpcomingMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieRecommendationsQuery,
  useGetTrendingMoviesQuery,
} = recommendationsApi;
