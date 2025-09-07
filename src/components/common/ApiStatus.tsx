'use client';

import React from 'react';
import { useAppSelector } from '@/hooks/redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getApiKeyStatus } from '@/config/api';

export interface ApiStatusProps {
  className?: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ className }) => {
  const { error } = useAppSelector((state) => state.content);
  const apiStatus = getApiKeyStatus();

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Not Configured';
  };

  if (!apiStatus.newsApi && !apiStatus.tmdbApi) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚠️</span>
            <span>API Configuration Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            To see real content, you need to configure API keys. Currently showing mock data.
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">News API</span>
              <Badge className={getStatusColor(apiStatus.newsApi)}>
                {getStatusText(apiStatus.newsApi)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">TMDB API</span>
              <Badge className={getStatusColor(apiStatus.tmdbApi)}>
                {getStatusText(apiStatus.tmdbApi)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Social API</span>
              <Badge className={getStatusColor(apiStatus.socialApi)}>
                {getStatusText(apiStatus.socialApi)}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-2">Quick Setup:</h4>
            <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>1. Create a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env.local</code> file in your project root</li>
              <li>2. Add your API keys (see API_SETUP.md for instructions)</li>
              <li>3. Restart your development server</li>
            </ol>
          </div>

          {error && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-red-600 dark:text-red-400">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default ApiStatus;