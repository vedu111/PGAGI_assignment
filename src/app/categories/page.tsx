'use client';

import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleCategory, updateCategoryPriority } from '@/store/slices/userPreferencesSlice';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.userPreferences.preferences);

  const handleToggleCategory = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
  };

  const handlePriorityChange = (categoryId: string, priority: number) => {
    dispatch(updateCategoryPriority({ id: categoryId, priority }));
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons = {
      technology: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      sports: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      finance: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      entertainment: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      health: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      science: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    };
    return icons[categoryId as keyof typeof icons] || icons.technology;
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      science: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[categoryId as keyof typeof colors] || colors.technology;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your content preferences by enabling or disabling categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(category.id)}`}>
                      {getCategoryIcon(category.id)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-gray-500">Priority: {category.priority}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={category.enabled ? 'success' : 'secondary'}>
                      {category.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <button
                      onClick={() => handleToggleCategory(category.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        category.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Priority</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((priority) => (
                        <button
                          key={priority}
                          onClick={() => handlePriorityChange(category.id, priority)}
                          className={`w-6 h-6 rounded-full text-xs font-medium transition-colors ${
                            category.priority === priority
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Category Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {categories.filter(c => c.enabled).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((categories.filter(c => c.enabled).length / categories.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Coverage
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">
            Save Preferences
          </Button>
          <Button variant="outline">
            Reset to Default
          </Button>
          <Button variant="outline">
            Import Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
}
