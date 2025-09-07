'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { ContentItem } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FavoriteButton from './FavoriteButton';
import { cn } from '@/utils/helpers';

export interface FavoritesListProps {
  showFilters?: boolean;
  showStats?: boolean;
  layout?: 'grid' | 'list';
  limit?: number;
  onItemClick?: (item: ContentItem) => void;
  className?: string;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  showFilters = true,
  showStats = true,
  layout = 'grid',
  limit,
  onItemClick,
  className
}) => {
  const { favorites } = useAppSelector((state) => state.content);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter favorites based on selected filters
  const filteredFavorites = favorites.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return categoryMatch && typeMatch;
  });

  // Apply limit if specified
  const displayFavorites = limit ? filteredFavorites.slice(0, limit) : filteredFavorites;

  // Get unique categories and types for filters
  const categories = ['all', ...Array.from(new Set(favorites.map(item => item.category)))];
  const types = ['all', ...Array.from(new Set(favorites.map(item => item.type)))];

  // Calculate stats
  const stats = {
    total: favorites.length,
    byCategory: categories.reduce((acc, cat) => {
      if (cat !== 'all') {
        acc[cat] = favorites.filter(item => item.category === cat).length;
      }
      return acc;
    }, {} as Record<string, number>),
    byType: types.reduce((acc, type) => {
      if (type !== 'all') {
        acc[type] = favorites.filter(item => item.type === type).length;
      }
      return acc;
    }, {} as Record<string, number>),
  };

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      social: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      recommendation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (favorites.length === 0) {
    return (
      <Card className={cn('p-8 text-center', className)}>
        <div className="text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-sm mb-4">
            Start adding content to your favorites by clicking the heart icon on any content item.
          </p>
          <Button variant="outline">
            Browse Content
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-red-600">saved items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(stats.byCategory).length > 0 
                  ? Object.entries(stats.byCategory).sort(([,a], [,b]) => b - a)[0][0]
                  : 'None'
                }
              </div>
              <p className="text-xs text-blue-600">most favorited</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Content Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.byType).length}</div>
              <p className="text-xs text-purple-600">different types</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <span className="mr-1">{category === 'all' ? '📂' : getCategoryIcon(category)}</span>
                  {category === 'all' ? 'All' : category}
                  {category !== 'all' && (
                    <span className="ml-1 text-xs opacity-75">
                      ({stats.byCategory[category] || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedType === type
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {type === 'all' ? 'All Types' : type}
                  {type !== 'all' && (
                    <span className="ml-1 text-xs opacity-75">
                      ({stats.byType[type] || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Grid/List */}
      <div className={cn(
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      )}>
        {displayFavorites.map((item) => (
          <Card
            key={item.id}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {getCategoryIcon(item.category)} {item.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <FavoriteButton item={item} size="sm" />
              </div>

              {/* Image */}
              {item.imageUrl && (
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.source}</span>
                  <span>{new Date(item.publishedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {limit && filteredFavorites.length > limit && (
        <div className="text-center">
          <Button variant="outline">
            Show More ({filteredFavorites.length - limit} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
