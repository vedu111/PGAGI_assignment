'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { FavoritesList } from '@/components/favorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/hooks/redux';

export default function FavoritesPage() {
  const { favorites } = useAppSelector((state) => state.content);

  const handleItemClick = (item: any) => {
    console.log('Clicked favorite item:', item.title);
    // Navigate to item details or open modal
  };

  const handleExportFavorites = () => {
    console.log('Exporting favorites...');
    // Implement export functionality
  };

  const handleShareCollection = () => {
    console.log('Sharing collection...');
    // Implement share functionality
  };

  const handleClearAll = () => {
    console.log('Clearing all favorites...');
    // Implement clear all functionality
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length} saved items
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Sort by Date
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>

        {/* Favorites List */}
        <FavoritesList
          showFilters={true}
          showStats={true}
          layout="grid"
          onItemClick={handleItemClick}
        />

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleExportFavorites}>
                  Export Favorites
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareCollection}>
                  Share Collection
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}