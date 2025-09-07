'use client';

import React, { useState, useEffect } from 'react';
import { TrendingItem } from '@/types/content';
import TrendingCard from './TrendingCard';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { cn } from '@/utils/helpers';
import { computeTrending, TrendingPeriod } from '@/utils/trending';
import { getRandomMockData } from '@/utils/mockData';
import { useAppSelector } from '@/hooks/redux';

export interface TrendingSectionProps {
  category?: string;
  timeRange?: 'hour' | 'day' | 'week' | 'month';
  limit?: number;
  showCategoryFilter?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  category,
  timeRange = 'day',
  limit = 10,
  showCategoryFilter = true,
  onViewAll,
  className
}) => {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange === 'month' ? 'week' : (timeRange as TrendingPeriod));

  const feedItems = useAppSelector((state) => state.content.feed.items);

  const categories = [
    { id: 'all', name: 'All', icon: '🔥' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'politics', name: 'Politics', icon: '🏛️' },
    { id: 'environment', name: 'Environment', icon: '🌱' },
    // Content types as categories
    { id: 'news', name: 'News', icon: '📰' },
    { id: 'recommendation', name: 'Recommendations', icon: '🎧' },
    { id: 'social', name: 'Social', icon: '💬' },
  ];

  const timeRanges = [
    { id: 'hour', name: '1 Hour', icon: '⏰' },
    { id: 'day', name: '24 Hours', icon: '📅' },
    { id: 'week', name: '7 Days', icon: '📊' },
    { id: 'month', name: '30 Days', icon: '📈' },
  ];

  useEffect(() => {
    const fetchTrendingData = async () => {
      setIsLoading(true);
      // If no feed items available (user opened trending first), synthesize mock items
      const baseItems = (feedItems && feedItems.length > 0) ? feedItems : getRandomMockData(30);

      // Derive trending from items
      let derived = computeTrending(baseItems, {
        period: selectedTimeRange,
        category: selectedCategory,
        limit,
      });
      // Fallback: if empty, relax category then period
      if (derived.length === 0) {
        derived = computeTrending(baseItems, {
          period: selectedTimeRange,
          category: 'all',
          limit,
        });
      }
      if (derived.length === 0) {
        const fallbackPeriod: TrendingPeriod = selectedTimeRange === 'hour' ? 'day' : 'week';
        derived = computeTrending(baseItems, {
          period: fallbackPeriod,
          category: 'all',
          limit,
        });
      }
      setTrendingItems(derived);
      setIsLoading(false);
    };

    fetchTrendingData();
  }, [selectedCategory, selectedTimeRange, limit, feedItems]);

  const handleViewDetails = (item: TrendingItem) => {
    // Navigate to item details or open modal
    console.log('View details for:', item.title);
  };

  const handleAddToFavorites = (item: TrendingItem) => {
    // Add to favorites
    console.log('Add to favorites:', item.title);
  };

  if (isLoading) {
    return (
      <Card className={cn('p-8', className)}>
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading trending content...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>🔥</span>
            <span>Trending</span>
          </h2>
          <Badge variant="secondary" className="text-xs">
            {selectedTimeRange === 'hour' ? 'Last Hour' : 
             selectedTimeRange === 'day' ? '24 Hours' :
             selectedTimeRange === 'week' ? '7 Days' : '30 Days'}
          </Badge>
        </div>
        {onViewAll && (
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>

      {/* Filters */}
      {showCategoryFilter && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setSelectedTimeRange(range.id as any)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedTimeRange === range.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <span className="mr-1">{range.icon}</span>
                  {range.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingItems.map((item, index) => (
          <TrendingCard
            key={item.id}
            item={item}
            rank={index + 1}
            onViewDetails={handleViewDetails}
            onAddToFavorites={handleAddToFavorites}
          />
        ))}
      </div>

      {/* Empty State */}
      {trendingItems.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No trending content found</h3>
            <p className="text-sm">
              Try adjusting your filters or check back later for new trending content.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrendingSection;
