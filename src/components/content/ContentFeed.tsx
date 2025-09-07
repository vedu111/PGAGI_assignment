'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFeedItems, addFeedItems, setLoading, setError } from '@/store/slices/contentSlice';
import { useGetTopHeadlinesQuery } from '@/store/api/newsApi';
import { useGetPopularMoviesQuery } from '@/store/api/recommendationsApi';
import { useGetSocialPostsQuery } from '@/store/api/socialApi';
import ContentCard from './ContentCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ContentItem } from '@/types/content';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getRandomMockData, getMockDataByCategory, generateMoreMockData } from '@/utils/mockData';
import { matchesCategory } from '@/utils/trending';
import { getApiKeyStatus } from '@/config/api';

export interface ContentFeedProps {
  className?: string;
  viewMode?: 'grid' | 'list';
  itemsPerPage?: number;
}

const ContentFeed: React.FC<ContentFeedProps> = ({
  className,
  viewMode = 'grid',
  itemsPerPage = 20,
}) => {
  const dispatch = useAppDispatch();
  const { feed, isLoading, hasMore, activeFilters } = useAppSelector((state) => state.content);
  const { categories } = useAppSelector((state) => state.userPreferences.preferences);

  const [currentPage, setCurrentPage] = useState(1);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [hasMoreContent, setHasMoreContent] = useState(true);

  // Get enabled categories
  const enabledCategories = categories.filter(cat => cat.enabled).map(cat => cat.id);
  const enabledKey = React.useMemo(() => enabledCategories.slice().sort().join('|'), [enabledCategories]);
  
  // Check if APIs are configured
  const apiStatus = getApiKeyStatus();
  const hasValidApiKeys = apiStatus.newsApi && apiStatus.tmdbApi;

  // Fetch data from APIs (only if APIs are configured)
  // Map preferences to NewsAPI category if single clear choice
  const newsApiCategory = React.useMemo(() => {
    const map: Record<string, string> = {
      technology: 'technology',
      sports: 'sports',
      finance: 'business',
      health: 'health',
      science: 'science',
      entertainment: 'entertainment',
    };
    const eligible = enabledCategories.filter((id) => map[id]);
    if (eligible.length === 1) return map[eligible[0]];
    return undefined;
  }, [enabledCategories]);

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = useGetTopHeadlinesQuery({
    category: newsApiCategory,
    page: currentPage,
    pageSize: Math.ceil(itemsPerPage / 3), // Split between content types
  }, {
    skip: !hasValidApiKeys, // Skip API call if APIs are not configured
  });

  // Decide which sources to fetch based on preferences
  const shouldFetchMovies = React.useMemo(() => {
    if (enabledCategories.length === 0) return true;
    if (enabledCategories.length === 1) return enabledCategories[0] === 'entertainment';
    return enabledCategories.includes('entertainment');
  }, [enabledCategories]);

  const shouldFetchSocial = React.useMemo(() => {
    if (enabledCategories.length === 0) return true;
    if (enabledCategories.length === 1) return false; // single topical focus -> keep feed tight
    return true;
  }, [enabledCategories]);

  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
  } = useGetPopularMoviesQuery({
    page: currentPage,
  }, {
    skip: !hasValidApiKeys || !shouldFetchMovies, // Skip API call if not desired
  });

  const {
    data: socialData,
    isLoading: socialLoading,
    error: socialError,
  } = useGetSocialPostsQuery({
    page: currentPage,
    pageSize: Math.ceil(itemsPerPage / 3),
  }, {
    skip: !hasValidApiKeys || !shouldFetchSocial, // Skip API call if not desired
  });

  // Combine and process data
  useEffect(() => {
    let newContent: ContentItem[] = [];

    if (hasValidApiKeys) {
      const filterByEnabled = (items?: ContentItem[]): ContentItem[] => {
        if (!items || items.length === 0) return [];
        if (enabledCategories.length === 0) return items;
        return items.filter(it => enabledCategories.some(cat => matchesCategory(it, cat)));
      };

      // Add news items
      if (newsData && newsData.length > 0) {
        newContent.push(...filterByEnabled(newsData));
      }

      // Add movie recommendations
      if (moviesData && moviesData.length > 0) {
        newContent.push(...filterByEnabled(moviesData));
      }

      // Add social posts
      if (socialData && socialData.length > 0) {
        newContent.push(...filterByEnabled(socialData));
      }

      // No mock fallback
    }

    // Sort by published date (newest first)
    newContent.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Personalization: weight by user category priority
    const categoryPriority: Record<string, number> = categories.reduce((acc: Record<string, number>, c) => {
      acc[c.id] = c.priority ?? 3;
      return acc;
    }, {});

    // Filter by active filters
    let filteredNewContent = newContent;
    
    if (activeFilters.categories.length > 0) {
      filteredNewContent = filteredNewContent.filter(item => 
        activeFilters.categories.includes(item.category)
      );
    }

    if (activeFilters.types.length > 0) {
      filteredNewContent = filteredNewContent.filter(item => 
        activeFilters.types.includes(item.type)
      );
    }

    // Apply user preference category enablement (personalization filter)
    if (enabledCategories.length > 0) {
      filteredNewContent = filteredNewContent.filter(item =>
        enabledCategories.some(cat => matchesCategory(item, cat))
      );

      // If nothing matched (e.g., API/mock titles don't contain keywords), synthesize
      if (filteredNewContent.length === 0) {
        const synthesized: ContentItem[] = [];
        enabledCategories.forEach((cat) => {
          const subset = getMockDataByCategory(cat as any);
          synthesized.push(...subset);
        });
        filteredNewContent = synthesized.slice(0, itemsPerPage);
      }
    }

    // Date range filter
    if (activeFilters.dateRange && activeFilters.dateRange !== 'all') {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneMonth = 30 * oneDay;
      const maxAge = activeFilters.dateRange === 'today' ? oneDay
        : activeFilters.dateRange === 'week' ? oneWeek
        : activeFilters.dateRange === 'month' ? oneMonth
        : Infinity;
      filteredNewContent = filteredNewContent.filter(item => {
        const ts = new Date(item.publishedAt).getTime();
        return now - ts <= maxAge;
      });
    }

    // Sort by personalization score (priority) then date
    filteredNewContent.sort((a, b) => {
      const pa = categoryPriority[a.category] ?? 0;
      const pb = categoryPriority[b.category] ?? 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // For infinite scrolling: append new content instead of replacing
    if (currentPage === 1) {
      // First page: replace all content
      setAllContent(filteredNewContent);
      dispatch(setFeedItems(filteredNewContent));
    } else {
      // Subsequent pages: append to existing content
      setAllContent(prevContent => {
        const combinedContent = [...prevContent, ...filteredNewContent];
        // Remove duplicates based on ID
        const uniqueContent = combinedContent.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        return uniqueContent;
      });
      dispatch(addFeedItems(filteredNewContent));
    }

    // For infinite scrolling, always allow more content to load
    setHasMoreContent(true);
  }, [newsData, moviesData, socialData, currentPage, activeFilters, dispatch, hasValidApiKeys, itemsPerPage, newsLoading, moviesLoading, socialLoading, enabledKey]);

  // Reset pagination and visible items when preferences or filters change
  useEffect(() => {
    // When enabled categories or filters change, restart feed from page 1
    setCurrentPage(1);
    setAllContent([]);
    dispatch(setFeedItems([] as any));
  }, [enabledKey, activeFilters, dispatch]);

  // Handle loading and error states
  useEffect(() => {
    const loading = !hasValidApiKeys ? false : (newsLoading || moviesLoading || socialLoading);
    dispatch(setLoading(loading));

    const error = !hasValidApiKeys ? null : (newsError || moviesError || socialError);
    if (error) {
      dispatch(setError('Failed to load content. Please try again.'));
    } else {
      dispatch(setError(null));
    }
  }, [newsLoading, moviesLoading, socialLoading, newsError, moviesError, socialError, dispatch, hasValidApiKeys]);

  // Infinite scroll
  const loadMore = () => {
    if (!isLoading && hasMoreContent) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const { lastElementRef } = useInfiniteScroll(loadMore, {
    hasMore: hasMoreContent,
    isLoading,
  });

  // Handle read more
  const handleReadMore = (item: ContentItem) => {
    // Open in new tab
    window.open(item.url, '_blank');
  };

  if (isLoading && allContent.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading your personalized feed..." />
      </div>
    );
  }

  if (allContent.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No content available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your category preferences or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Content Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {allContent.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            ref={index === allContent.length - 1 ? lastElementRef : null}
          >
            <ContentCard
              item={item}
              variant={viewMode === 'list' ? 'compact' : 'default'}
              onReadMore={handleReadMore}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isLoading && allContent.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" text="Loading more content..." />
        </div>
      )}

      {/* End of content message - Removed for infinite scrolling */}
    </div>
  );
};

export default ContentFeed;
