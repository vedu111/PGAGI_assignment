'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { TrendingSection, TrendingSidebar } from '@/components/trending';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAppSelector } from '@/hooks/redux';
import { computeTrending } from '@/utils/trending';

const TrendingPage: React.FC = () => {
  const feedItems = useAppSelector((s) => s.content.feed.items);
  const sidebarTrendingData = computeTrending(feedItems, { period: 'day', category: 'all', limit: 8 });

  const handleViewAll = () => {
    console.log('View all trending content');
  };

  const handleItemClick = (item: TrendingItem) => {
    console.log('Clicked trending item:', item.title);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover what's trending across all categories
            </p>
          </div>
        </div>

        {/* Trending Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <TrendingSection
              timeRange="day"
              limit={6}
              showCategoryFilter={true}
              onViewAll={handleViewAll}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Now Sidebar */}
            <TrendingSidebar
              items={sidebarTrendingData}
              title="Trending Now"
              showRank={true}
              compact={true}
              onViewAll={handleViewAll}
              onItemClick={handleItemClick}
            />

            {/* Top Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Categories
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Technology</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    45%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Sports</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    32%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Finance</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    28%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Entertainment</span>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    67%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Environment</span>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    41%
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Trending Topics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trending Topics
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">#1</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">#AIRevolution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">#2</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">#SportsUpdate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">#3</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">#MarketRally</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">#4</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">#MovieBlockbuster</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">#5</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">#GreenTech</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrendingPage;