'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setPreferences, toggleCategory } from '@/store/slices/userPreferencesSlice';
import { setTheme } from '@/store/slices/uiSlice';
import { UserPreferences } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/helpers';

export interface PreferencesPanelProps {
  className?: string;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.userPreferences);
  const { theme } = useAppSelector((state) => state.ui);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Persist current redux preferences (already updated via toggle handlers)
    dispatch(setPreferences(preferences));
  };

  const handleCategoryToggle = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(newTheme));
  };

  const getCategoryIcon = (categoryId: string) => {
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
    return icons[categoryId] || '📰';
  };

  const getCategoryColor = (categoryId: string) => {
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
    return colors[categoryId] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const enabledCategories = preferences.categories.filter(cat => cat.enabled);
  const disabledCategories = preferences.categories.filter(cat => !cat.enabled);
  const notifications = Array.isArray((preferences as any).notifications)
    ? (preferences as any).notifications
    : [];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quick Settings</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                </span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Theme
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {theme} mode
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {(['light', 'dark', 'system'] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={cn(
                      'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                      theme === themeOption
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Categories Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Active Categories
                  </div>
                  <div className="text-sm text-gray-500">
                    {enabledCategories.length} of {preferences.categories.length} enabled
                  </div>
                </div>
              </div>
              <Badge variant="success">
                {enabledCategories.length} Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Save / Reset */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>

      {/* Enabled Categories */}
      {enabledCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enabledCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getCategoryIcon(category.id)}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Weight: {Number((category as any).weight ?? (category as any).priority ?? 3)}/10
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleCategoryToggle(category.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disabled Categories */}
      {disabledCategories.length > 0 && isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Available Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {disabledCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getCategoryIcon(category.id)}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Click to enable
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCategoryToggle(category.id)}
                    className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <div
                key={notification.type}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {notification.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {notification.description}
                  </div>
                </div>
                <Badge variant={notification.enabled ? 'success' : 'secondary'}>
                  {notification.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesPanel;
