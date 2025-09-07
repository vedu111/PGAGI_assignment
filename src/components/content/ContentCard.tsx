'use client';

import React from 'react';
import { ContentItem, NewsItem, RecommendationItem, SocialItem } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime, truncateText, getImageUrl } from '@/utils/helpers';
import { useAppDispatch } from '@/hooks/redux';
import { markAsRead } from '@/store/slices/contentSlice';
import { FavoriteButton } from '@/components/favorites';

export interface ContentCardProps {
  item: ContentItem;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  onReadMore?: (item: ContentItem) => void;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  variant = 'default',
  showActions = true,
  onReadMore,
  className,
}) => {
  const dispatch = useAppDispatch();

  const handleReadMore = () => {
    dispatch(markAsRead(item.id));
    onReadMore?.(item);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      science: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      social: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return colors[category as keyof typeof colors] || colors.technology;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      news: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      recommendation: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      social: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    };
    return icons[type as keyof typeof icons] || icons.news;
  };

  const renderContentSpecificInfo = () => {
    switch (item.type) {
      case 'news':
        const newsItem = item as NewsItem;
        return (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {newsItem.author && <span>By {newsItem.author}</span>}
            <span>•</span>
            <span>{newsItem.source}</span>
          </div>
        );
      
      case 'recommendation':
        const recItem = item as RecommendationItem;
        return (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {recItem.rating && (
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{recItem.rating.toFixed(1)}</span>
              </div>
            )}
            {recItem.year && <span>• {recItem.year}</span>}
            {recItem.genre && <span>• {recItem.genre}</span>}
          </div>
        );
      
      case 'social':
        const socialItem = item as SocialItem;
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>@{socialItem.author}</span>
            {socialItem.likes && (
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{socialItem.likes}</span>
              </div>
            )}
            {socialItem.shares && (
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>{socialItem.shares}</span>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (variant === 'compact') {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className || ''}`}>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            {item.imageUrl && (
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
                <div className="flex items-center space-x-1 text-gray-400">
                  {getTypeIcon(item.type)}
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                {truncateText(item.title, 60)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {truncateText(item.description, 80)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(item.publishedAt)}
                </span>
                {showActions && (
                  <div className="flex space-x-1">
                    <FavoriteButton item={item} size="sm" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReadMore}
                      className="p-1 h-6 w-6"
                    >
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${className || ''}`}>
      {item.imageUrl && (
        <div className="relative">
          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 left-2 flex space-x-1">
            <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
              {item.category}
            </Badge>
            <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded px-2 py-1">
              {getTypeIcon(item.type)}
            </div>
          </div>
        </div>
      )}
      
      <CardHeader className={item.imageUrl ? 'pb-3' : ''}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">
              {item.title}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {truncateText(item.description, 120)}
            </p>
          </div>
          {showActions && (
            <FavoriteButton item={item} size="md" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {renderContentSpecificInfo()}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            {formatRelativeTime(item.publishedAt)}
          </span>
          
          {showActions && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReadMore}
              >
                Read More
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
