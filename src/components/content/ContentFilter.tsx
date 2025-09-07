'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setActiveFilters, clearFilters } from '@/store/slices/contentSlice';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface ContentFilterProps {
  className?: string;
}

const ContentFilter: React.FC<ContentFilterProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { activeFilters } = useAppSelector((state) => state.content);
  const { categories } = useAppSelector((state) => state.userPreferences.preferences);
  const [showFilters, setShowFilters] = useState(false);

  const contentTypes = [
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'recommendation', label: 'Recommendations', icon: '🎬' },
    { id: 'social', label: 'Social', icon: '💬' },
  ];

  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter(id => id !== categoryId)
      : [...activeFilters.categories, categoryId];
    
    dispatch(setActiveFilters({ categories: newCategories }));
  };

  const handleTypeToggle = (typeId: string) => {
    const newTypes = activeFilters.types.includes(typeId)
      ? activeFilters.types.filter(id => id !== typeId)
      : [...activeFilters.types, typeId];
    
    dispatch(setActiveFilters({ types: newTypes }));
  };

  const handleDateRangeChange = (dateRange: string) => {
    dispatch(setActiveFilters({ dateRange }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = 
    activeFilters.categories.length > 0 || 
    activeFilters.types.length > 0 || 
    activeFilters.dateRange !== 'all';

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {activeFilters.categories.length + activeFilters.types.length + (activeFilters.dateRange !== 'all' ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter(cat => cat.enabled)
                  .map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeFilters.categories.includes(category.id)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Content Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Content Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeToggle(type.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                      activeFilters.types.includes(type.id)
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Date Range
              </h3>
              <div className="flex flex-wrap gap-2">
                {dateRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => handleDateRangeChange(range.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilters.dateRange === range.id
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {activeFilters.categories.map((categoryId) => {
              const category = categories.find(cat => cat.id === categoryId);
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{category?.name}</span>
                  <button
                    onClick={() => handleCategoryToggle(categoryId)}
                    className="ml-1 hover:text-red-500"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              );
            })}
            
            {activeFilters.types.map((typeId) => {
              const type = contentTypes.find(t => t.id === typeId);
              return (
                <Badge
                  key={typeId}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{type?.icon}</span>
                  <span>{type?.label}</span>
                  <button
                    onClick={() => handleTypeToggle(typeId)}
                    className="ml-1 hover:text-red-500"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              );
            })}
            
            {activeFilters.dateRange !== 'all' && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{dateRanges.find(r => r.id === activeFilters.dateRange)?.label}</span>
                <button
                  onClick={() => handleDateRangeChange('all')}
                  className="ml-1 hover:text-red-500"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFilter;
