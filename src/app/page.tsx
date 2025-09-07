'use client';

import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DragDropToggle from '@/components/ui/DragDropToggle';
import DraggableContentFeed from '@/components/content/DraggableContentFeed';
import ContentFilter from '@/components/content/ContentFilter';
import { TrendingSidebar } from '@/components/trending';
import { FavoritesSidebar } from '@/components/favorites';
import ApiStatus from '@/components/common/ApiStatus';
import { useAppSelector } from '@/hooks/redux';
import { TrendingItem } from '@/types/content';

export default function Home() {
  const { favorites, feed } = useAppSelector((state) => state.content);
  const { categories } = useAppSelector((state) => state.userPreferences.preferences);
  const activeCategories = categories.filter(cat => cat.enabled);

  // Derive content types present in the current feed
  const presentTypes = Array.from(new Set(feed.items.map((i) => i.type)));
  const presentTypesLabel = presentTypes.length > 0 ? presentTypes
    .map((t) => t === 'recommendation' ? 'Movies' : t === 'news' ? 'News' : 'Social')
    .join(', ') : '—';

  // Mock trending data for dashboard
  const trendingData: TrendingItem[] = [
    {
      id: '1',
      title: 'Revolutionary AI Breakthrough Changes Everything',
      category: 'technology',
      trend: 'up',
      change: 45,
      period: 'hour',
    },
    {
      id: '2',
      title: 'Major Sports League Announces New Season Format',
      category: 'sports',
      trend: 'up',
      change: 32,
      period: 'hour',
    },
    {
      id: '3',
      title: 'Stock Market Reaches New All-Time High',
      category: 'finance',
      trend: 'up',
      change: 28,
      period: 'hour',
    },
  ];

  return (
    <Layout>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Welcome Section */}
        <div className="text-center relative">
          <div className="absolute inset-x-0 -top-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent mb-4 tracking-tight">
              Your Personalized Feed
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 animate-pulse"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover content tailored to your interests with our intelligent curation system
          </p>
          <div className="mt-6 flex justify-center">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-1 text-sm font-medium animate-shimmer">
              ✨ Powered by AI
            </Badge>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Active Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeCategories.length}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                of {categories.length} total categories
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {favorites.length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                saved items in collection
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-500"></div>
                Content Types
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {presentTypes.length}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                {presentTypesLabel}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced API Status */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent dark:via-gray-800 rounded-xl opacity-50"></div>
          <div className="relative backdrop-blur-sm">
            <ApiStatus />
          </div>
        </div>

        {/* Enhanced Content Filter */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl opacity-30"></div>
          <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-1">
            <ContentFilter />
          </div>
        </div>

        {/* Enhanced Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Content Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Latest Content
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <DragDropToggle size="sm" showLabel={false} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">View:</span>
                  <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white dark:bg-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Grid
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl"></div>
              <div className="relative backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4">
                <DraggableContentFeed enableDragDrop={true} enableAutoScroll={true} />
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Trending Sidebar */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-t-xl"></div>
                <TrendingSidebar
                  items={trendingData}
                  title="🔥 Trending Now"
                  showRank={true}
                  compact={true}
                  onViewAll={() => console.log('View all trending')}
                  onItemClick={(item) => console.log('Clicked trending item:', item.title)}
                />
              </div>
            </div>

            {/* Enhanced Favorites Sidebar */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-xl"></div>
                <FavoritesSidebar
                  title="⭐ Recent Favorites"
                  limit={3}
                  showStats={true}
                  onViewAll={() => console.log('View all favorites')}
                  onItemClick={(item) => console.log('Clicked favorite item:', item.title)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes animate-spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -200% 0;
          }
        }
        
        .animate-spin-slow {
          animation: animate-spin-slow 20s linear infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
          background-size: 400% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
}