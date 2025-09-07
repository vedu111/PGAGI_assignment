'use client';

import React from 'react';
import { useAppSelector } from '@/hooks/redux';
import { ContentItem } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FavoriteButton from './FavoriteButton';
import { cn } from '@/utils/helpers';

export interface FavoritesSidebarProps {
  title?: string;
  limit?: number;
  showStats?: boolean;
  onViewAll?: () => void;
  onItemClick?: (item: ContentItem) => void;
  className?: string;
}

const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({
  title = 'Recent Favorites',
  limit = 5,
  showStats = true,
  onViewAll,
  onItemClick,
  className
}) => {
  const { favorites } = useAppSelector((state) => state.content);
  
  const recentFavorites = favorites.slice(0, limit);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      technology: '💻',
      sports: '⚽',
      finance: '💰',
      entertainment: '🎬',
      health: '🏥',
      science: '🔬',
      politics: '🏛️',
      environment: '🌱',
    };
    return icons[category] || '📰';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      science: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      politics: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      environment: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>❤️</span>
            <span>{title}</span>
          </h3>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{favorites.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {new Set(favorites.map(fav => fav.category)).size}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {new Set(favorites.map(fav => fav.type)).size}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Types</div>
            </div>
          </div>
        )}

        {/* Favorites List */}
        <div className="space-y-3">
          {recentFavorites.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {/* Image */}
                {item.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Category Badge */}
                  <div className="mb-1">
                    <Badge className={getCategoryColor(item.category)}>
                      {getCategoryIcon(item.category)} {item.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {item.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.source}
                    </span>
                    <FavoriteButton item={item} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-6">
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-sm">No favorites yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Start adding content to your favorites
              </p>
            </div>
          </div>
        )}

        {/* View All Button */}
        {favorites.length > limit && onViewAll && (
          <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm" onClick={onViewAll}>
              View All {favorites.length} Favorites
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FavoritesSidebar;
