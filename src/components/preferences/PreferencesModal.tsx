'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
  setPreferences, 
  toggleCategory, 
  setNotifications 
} from '@/store/slices/userPreferencesSlice';
import { setTheme } from '@/store/slices/uiSlice';
import { UserPreferences } from '@/types/user';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DragDropSettings from './DragDropSettings';
import { cn } from '@/utils/helpers';

export interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.userPreferences);
  const { theme } = useAppSelector((state) => state.ui);
  
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark' | 'system'>(theme);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when Redux state changes
  useEffect(() => {
    setLocalPreferences(preferences);
    setLocalTheme(theme);
    setHasChanges(false);
  }, [preferences, theme]);

  // Check for changes
  useEffect(() => {
    const preferencesChanged = JSON.stringify(localPreferences) !== JSON.stringify(preferences);
    const themeChanged = localTheme !== theme;
    setHasChanges(preferencesChanged || themeChanged);
  }, [localPreferences, localTheme, preferences, theme]);

  const handleCategoryToggle = (categoryId: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    }));
  };

  const handleCategoryWeightChange = (categoryId: string, weight: number) => {
    setLocalPreferences(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, weight: Math.max(1, Math.min(10, weight)) }
          : cat
      )
    }));
  };

  const handleNotificationToggle = (type: string) => {
    setLocalPreferences(prev => {
      if (!Array.isArray((prev as any).notifications)) return prev;
      const updated = (prev as any).notifications.map((notif: any) =>
        notif.type === type ? { ...notif, enabled: !notif.enabled } : notif
      );
      return { ...prev, notifications: updated } as UserPreferences as any;
    });
  };

  const handleSave = () => {
    dispatch(setPreferences(localPreferences));
    dispatch(setTheme(localTheme));
    onClose();
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setLocalTheme(theme);
    setHasChanges(false);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Preferences
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span>Theme</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light', icon: '☀️' },
                { id: 'dark', label: 'Dark', icon: '🌙' },
                { id: 'system', label: 'System', icon: '💻' },
              ].map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => setLocalTheme(themeOption.id as 'light' | 'dark' | 'system')}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all duration-200',
                    localTheme === themeOption.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="text-2xl mb-2">{themeOption.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {themeOption.label}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Content Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localPreferences.categories.map((category: any) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleCategoryToggle(category.id)}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                        category.enabled
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      )}
                    >
                      {category.enabled && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getCategoryIcon(category.id)}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getCategoryColor(category.id)}>
                      {category.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    {category.enabled && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Weight:</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={Number(category.weight ?? category.priority ?? 3)}
                          onChange={(e) => handleCategoryWeightChange(category.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
              </svg>
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(Array.isArray((localPreferences as any).notifications) ? (localPreferences as any).notifications : []).map((notification: any) => (
                <div
                  key={notification.type}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {notification.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {notification.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(notification.type)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      notification.enabled
                        ? 'bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                        notification.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Drag & Drop Settings */}
        <DragDropSettings />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            Reset
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PreferencesModal;
