'use client';

import React from 'react';
import { TrendingItem } from '@/types/content';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

export interface TrendingCardProps {
  item: TrendingItem;
  rank: number;
  onViewDetails?: (item: TrendingItem) => void;
  onAddToFavorites?: (item: TrendingItem) => void;
  className?: string;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  item,
  rank,
  onViewDetails,
  onAddToFavorites,
  className
}) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (rank === 2) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    if (rank === 3) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

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
    <Card className={cn('group hover:shadow-lg transition-all duration-300', className)}>
      <div className="p-4">
        {/* Header with rank and trend */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Badge className={getRankColor(rank)}>
              <span className="flex items-center space-x-1">
                <span>{getRankIcon(rank)}</span>
                <span className="font-bold">{rank}</span>
              </span>
            </Badge>
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <span className={cn('text-sm', getTrendColor(item.trend))}>
              {getTrendIcon(item.trend)}
            </span>
            <span className={cn('text-sm font-medium', getTrendColor(item.trend))}>
              {item.change}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {item.title}
            </h3>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{item.period}</span>
            </div>
            <span className={cn(getTrendColor(item.trend))}>{getTrendIcon(item.trend)} {item.change}%</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(item)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToFavorites?.(item)}
              className="p-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrendingCard;
