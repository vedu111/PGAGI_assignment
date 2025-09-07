'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFeedItems, addFeedItems, setLoading, setError, reorderFeedItems } from '@/store/slices/contentSlice';
import { useGetTopHeadlinesQuery } from '@/store/api/newsApi';
import { useGetPopularMoviesQuery } from '@/store/api/recommendationsApi';
import { useGetSocialPostsQuery } from '@/store/api/socialApi';
import DraggableContentCard from './DraggableContentCard';
import ContentCard from './ContentCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ContentItem } from '@/types/content';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getRandomMockData, getMockDataByCategory, generateMoreMockData } from '@/utils/mockData';
import { getApiKeyStatus } from '@/config/api';
import { cn } from '@/utils/helpers';

export interface DraggableContentFeedProps {
  className?: string;
  viewMode?: 'grid' | 'list';
  itemsPerPage?: number;
  enableDragDrop?: boolean;
  enableAutoScroll?: boolean;
}

const DraggableContentFeed: React.FC<DraggableContentFeedProps> = ({
  className,
  viewMode = 'grid',
  itemsPerPage = 20,
  enableDragDrop = true,
  enableAutoScroll = true,
}) => {
  const dispatch = useAppDispatch();
  const { feed, isLoading, hasMore, activeFilters } = useAppSelector((state) => state.content);
  const { categories } = useAppSelector((state) => state.userPreferences.preferences);

  const [currentPage, setCurrentPage] = useState(1);
  const [allContent, setAllContent] = useState<ContentItem[]>(() => {
    // Initialize with mock data to ensure content is always available
    return getRandomMockData(itemsPerPage);
  });
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const [isAnyAutoScrolling, setIsAnyAutoScrolling] = useState(false);

  // Get enabled categories
  const enabledCategories = categories.filter(cat => cat.enabled).map(cat => cat.id);
  
  // Check if APIs are configured
  const apiStatus = getApiKeyStatus();
  const hasValidApiKeys = apiStatus.newsApi && apiStatus.tmdbApi;

  // Fetch data from APIs (only if APIs are configured)
  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = useGetTopHeadlinesQuery({
    category: enabledCategories.includes('technology') ? 'technology' : undefined,
    page: currentPage,
    pageSize: Math.ceil(itemsPerPage / 3), // Split between content types
  }, {
    skip: !hasValidApiKeys, // Skip API call if APIs are not configured
  });

  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
  } = useGetPopularMoviesQuery({
    page: currentPage,
  }, {
    skip: !hasValidApiKeys, // Skip API call if APIs are not configured
  });

  const {
    data: socialData,
    isLoading: socialLoading,
    error: socialError,
  } = useGetSocialPostsQuery({
    page: currentPage,
    pageSize: Math.ceil(itemsPerPage / 3),
  }, {
    skip: !hasValidApiKeys, // Skip API call if APIs are not configured
  });

  // Combine and process data
  useEffect(() => {
    let newContent: ContentItem[] = [];

    if (!hasValidApiKeys) {
      // Use mock data when APIs are not configured
      if (currentPage === 1) {
        newContent = getRandomMockData(itemsPerPage, currentPage);
      } else {
        // Generate more mock data for infinite scrolling
        newContent = generateMoreMockData(itemsPerPage, currentPage);
      }
    } else {
      // Add news items
      if (newsData && newsData.length > 0) {
        newContent.push(...newsData);
      }

      // Add movie recommendations
      if (moviesData && moviesData.length > 0) {
        newContent.push(...moviesData);
      }

      // Add social posts
      if (socialData && socialData.length > 0) {
        newContent.push(...socialData);
      }

      // If APIs are configured but return no data, fall back to mock data
      if (newContent.length === 0 && !newsLoading && !moviesLoading && !socialLoading) {
        if (currentPage === 1) {
          newContent = getRandomMockData(itemsPerPage, currentPage);
        } else {
          newContent = generateMoreMockData(itemsPerPage, currentPage);
        }
      }
    }

    // Sort by published date (newest first)
    newContent.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

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
  }, [newsData, moviesData, socialData, currentPage, activeFilters, dispatch, hasValidApiKeys, itemsPerPage, newsLoading, moviesLoading, socialLoading]);

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

  // Handle drag and drop reordering
  const handleMove = (dragIndex: number, hoverIndex: number) => {
    if (!enableDragDrop) return;

    setAllContent(prevContent => {
      const newContent = [...prevContent];
      const draggedItem = newContent[dragIndex];
      
      // Remove the dragged item
      newContent.splice(dragIndex, 1);
      // Insert it at the new position
      newContent.splice(hoverIndex, 0, draggedItem);
      
      return newContent;
    });

    // Update Redux state
    dispatch(reorderFeedItems({ dragIndex, hoverIndex }));
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
      {/* Global Auto-scroll Indicator */}
      {isAnyAutoScrolling && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-sm font-medium">Auto-scrolling</span>
        </div>
      )}

      {/* Drag and Drop Instructions */}
      {enableDragDrop && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            <span className="text-sm font-medium">
              Drag and drop is active - hover over cards to see drag handles
            </span>
          </div>
          {enableAutoScroll && (
            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
              💡 Tip: Drag near the top or bottom edge of the screen to auto-scroll
            </div>
          )}
        </div>
      )}

      {/* Content Grid/List */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4',
          enableDragDrop && 'transition-all duration-200'
        )}
      >
        {allContent.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            ref={index === allContent.length - 1 && !enableDragDrop ? lastElementRef : null}
          >
            {enableDragDrop ? (
              <DraggableContentCard
                item={item}
                index={index}
                onMove={handleMove}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onReadMore={handleReadMore}
                enableAutoScroll={enableAutoScroll}
              />
            ) : (
              <div className="relative group">
                <ContentCard
                  item={item}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                  onReadMore={handleReadMore}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Separate infinite scroll trigger when drag and drop is enabled */}
        {enableDragDrop && (
          <div ref={lastElementRef} className="h-1" />
        )}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isLoading && allContent.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" text="Loading more content..." />
        </div>
      )}
    </div>
  );
};

export default DraggableContentFeed;
