'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ContentCard from '@/components/content/ContentCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setSearchQuery, setSearchResults, setSearching } from '@/store/slices/contentSlice';
import { useGetEverythingQuery } from '@/store/api/newsApi';
import { useSearchMoviesQuery } from '@/store/api/recommendationsApi';
import { useSearchSocialPostsQuery } from '@/store/api/socialApi';
import { ContentItem } from '@/types/content';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const dispatch = useAppDispatch();
  const { searchResults, isSearching, searchQuery } = useAppSelector((state) => state.content);
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [allResults, setAllResults] = useState<ContentItem[]>([]);

  // Update search query when URL changes
  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchTerm(query);
      dispatch(setSearchQuery(query));
    }
  }, [query, searchQuery, dispatch]);

  // Fetch search results from all APIs
  const {
    data: newsResults,
    isLoading: newsLoading,
    error: newsError,
  } = useGetEverythingQuery(
    { q: searchTerm },
    { skip: !searchTerm || searchTerm.length < 2 }
  );

  const {
    data: movieResults,
    isLoading: movieLoading,
    error: movieError,
  } = useSearchMoviesQuery(
    { query: searchTerm },
    { skip: !searchTerm || searchTerm.length < 2 }
  );

  const {
    data: socialResults,
    isLoading: socialLoading,
    error: socialError,
  } = useSearchSocialPostsQuery(
    { query: searchTerm },
    { skip: !searchTerm || searchTerm.length < 2 }
  );

  // Combine and process search results
  useEffect(() => {
    const combinedResults: ContentItem[] = [];

    if (newsResults) {
      combinedResults.push(...newsResults);
    }
    if (movieResults) {
      combinedResults.push(...movieResults);
    }
    if (socialResults) {
      combinedResults.push(...socialResults);
    }

    // Sort by relevance (you could implement more sophisticated ranking)
    combinedResults.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    setAllResults(combinedResults);

    // Update Redux state
    dispatch(setSearchResults({
      query: searchTerm,
      results: combinedResults,
      totalResults: combinedResults.length,
      searchTime: Date.now(),
    }));
  }, [newsResults, movieResults, socialResults, searchTerm, dispatch]);

  // Handle loading state
  useEffect(() => {
    const loading = newsLoading || movieLoading || socialLoading;
    dispatch(setSearching(loading));
  }, [newsLoading, movieLoading, socialLoading, dispatch]);

  const handleSearch = (newQuery: string) => {
    setSearchTerm(newQuery);
    dispatch(setSearchQuery(newQuery));
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('q', newQuery);
    window.history.pushState({}, '', url.toString());
  };

  const handleReadMore = (item: ContentItem) => {
    window.open(item.url, '_blank');
  };

  const getSearchStats = () => {
    const newsCount = newsResults?.length || 0;
    const movieCount = movieResults?.length || 0;
    const socialCount = socialResults?.length || 0;
    
    return { newsCount, movieCount, socialCount, total: allResults.length };
  };

  const stats = getSearchStats();

  if (isSearching && allResults.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Searching..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Search Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results
          </h1>
          {searchTerm && (
            <p className="text-gray-600 dark:text-gray-400">
              Results for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Search Stats */}
        {searchTerm && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Results</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{stats.newsCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">News</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{stats.movieCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Movies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-pink-600">{stats.socialCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Social</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Search completed in {Date.now() - (searchResults?.searchTime || 0)}ms
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {searchTerm && allResults.length === 0 && !isSearching && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <svg
                  className="h-16 w-16 text-gray-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try different keywords or check your spelling.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Suggestions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch('technology')}
                  >
                    Technology
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch('sports')}
                  >
                    Sports
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch('movies')}
                  >
                    Movies
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {allResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Results ({allResults.length})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Button variant="outline" size="sm">
                  Relevance
                </Button>
                <Button variant="ghost" size="sm">
                  Date
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allResults.map((item, index) => (
                <ContentCard
                  key={`${item.id}-${index}`}
                  item={item}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>

            {/* Load More Button */}
            {allResults.length >= 20 && (
              <div className="text-center mt-8">
                <Button variant="outline">
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Search Suggestions */}
        {!searchTerm && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Artificial Intelligence',
                  'Climate Change',
                  'Space Exploration',
                  'Cryptocurrency',
                  'Health & Wellness',
                  'Entertainment',
                  'Sports News',
                  'Technology Trends'
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(suggestion)}
                    className="justify-start"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
