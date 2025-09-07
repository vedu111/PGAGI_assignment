'use client';

import React from 'react';
import { TrendingItem } from '@/types/content';
import TrendingCard from './TrendingCard';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

export interface TrendingSidebarProps {
  items: TrendingItem[];
  title?: string;
  showRank?: boolean;
  compact?: boolean;
  onViewAll?: () => void;
  onItemClick?: (item: TrendingItem) => void;
  className?: string;
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  items,
  title = 'Trending Now',
  showRank = true,
  compact = false,
  onViewAll,
  onItemClick,
  className
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>🔥</span>
            <span>{title}</span>
          </h3>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>

        {/* Trending Items */}
        <div className="space-y-3">
          {items.slice(0, compact ? 5 : 10).map((item, index) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer',
                'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                compact && 'p-2'
              )}
            >
              <div className="flex items-start space-x-3">
                {/* Rank */}
                {showRank && (
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {getRankIcon(index + 1)}
                    </Badge>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className={cn(
                    'font-medium text-gray-900 dark:text-white line-clamp-2',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {item.title}
                  </h4>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.period}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={cn('text-xs', getTrendColor(item.trend))}>
                        {getTrendIcon(item.trend)}
                      </span>
                      <span className={cn('text-xs font-medium', getTrendColor(item.trend))}>
                        {item.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">No trending content available</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendingSidebar;
