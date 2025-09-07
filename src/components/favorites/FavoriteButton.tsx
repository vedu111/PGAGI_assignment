'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToFavorites, removeFromFavorites } from '@/store/slices/contentSlice';
import { ContentItem } from '@/types/content';
import { cn } from '@/utils/helpers';

export interface FavoriteButtonProps {
  item: ContentItem;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'text';
  showCount?: boolean;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  item,
  size = 'md',
  variant = 'icon',
  showCount = false,
  className
}) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.content);
  
  const isFavorite = favorites.some(fav => fav.id === item.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFromFavorites(item.id));
    } else {
      dispatch(addToFavorites(item));
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  const getButtonSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  if (variant === 'text') {
    return (
      <button
        onClick={handleToggleFavorite}
        className={cn(
          'flex items-center space-x-1 transition-colors',
          isFavorite
            ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
            : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400',
          getTextSizeClasses(),
          className
        )}
      >
        <svg className={getSizeClasses()} fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
        {showCount && (
          <span className="text-xs text-gray-400">
            ({favorites.length})
          </span>
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggleFavorite}
        className={cn(
          'flex items-center space-x-2 px-3 py-1.5 rounded-md border transition-colors',
          isFavorite
            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30'
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700',
          getTextSizeClasses(),
          className
        )}
      >
        <svg className={getSizeClasses()} fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
      </button>
    );
  }

  // Default icon variant
  return (
    <button
      onClick={handleToggleFavorite}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200',
        isFavorite
          ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
          : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400',
        getButtonSizeClasses(),
        className
      )}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg className={getSizeClasses()} fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
