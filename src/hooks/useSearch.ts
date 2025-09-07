import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { useAppDispatch, useAppSelector } from './redux';
import { setSearchQuery, setSearchResults, setSearching } from '@/store/slices/contentSlice';
import { useGetEverythingQuery } from '@/store/api/newsApi';
import { useSearchMoviesQuery } from '@/store/api/recommendationsApi';
import { useSearchSocialPostsQuery } from '@/store/api/socialApi';
import { ContentItem, SearchResult } from '@/types/content';

interface UseSearchOptions {
  debounceDelay?: number;
  minQueryLength?: number;
  autoSearch?: boolean;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: ContentItem[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  clearSearch: () => void;
  hasSearched: boolean;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceDelay = 300,
    minQueryLength = 2,
    autoSearch = true,
  } = options;

  const dispatch = useAppDispatch();
  const { searchResults, isSearching, searchQuery } = useAppSelector((state) => state.content);
  
  const [query, setQuery] = useState(searchQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(query, debounceDelay);

  // Fetch search results from all APIs
  const {
    data: newsResults,
    isLoading: newsLoading,
    error: newsError,
  } = useGetEverythingQuery(
    { q: debouncedQuery },
    { skip: !debouncedQuery || debouncedQuery.length < minQueryLength }
  );

  const {
    data: movieResults,
    isLoading: movieLoading,
    error: movieError,
  } = useSearchMoviesQuery(
    { query: debouncedQuery },
    { skip: !debouncedQuery || debouncedQuery.length < minQueryLength }
  );

  const {
    data: socialResults,
    isLoading: socialLoading,
    error: socialError,
  } = useSearchSocialPostsQuery(
    { query: debouncedQuery },
    { skip: !debouncedQuery || debouncedQuery.length < minQueryLength }
  );

  // Combine and process search results
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < minQueryLength) {
      return;
    }

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

    // Update Redux state
    const searchResult: SearchResult = {
      query: debouncedQuery,
      results: combinedResults,
      totalResults: combinedResults.length,
      searchTime: Date.now(),
    };

    dispatch(setSearchResults(searchResult));
    setHasSearched(true);
  }, [newsResults, movieResults, socialResults, debouncedQuery, minQueryLength, dispatch]);

  // Handle loading state
  useEffect(() => {
    const loading = newsLoading || movieLoading || socialLoading;
    dispatch(setSearching(loading));
  }, [newsLoading, movieLoading, socialLoading, dispatch]);

  // Update Redux query state
  useEffect(() => {
    if (debouncedQuery !== searchQuery) {
      dispatch(setSearchQuery(debouncedQuery));
    }
  }, [debouncedQuery, searchQuery, dispatch]);

  // Auto-search when query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery && debouncedQuery.length >= minQueryLength) {
      // The search is automatically triggered by the API queries above
    }
  }, [debouncedQuery, autoSearch, minQueryLength]);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    dispatch(setSearchQuery(''));
    dispatch(setSearchResults({
      query: '',
      results: [],
      totalResults: 0,
      searchTime: 0,
    }));
    setHasSearched(false);
  }, [dispatch]);

  const error = newsError || movieError || socialError ? 'Search failed. Please try again.' : null;

  return {
    query,
    setQuery,
    results: searchResults?.results || [],
    isLoading: isSearching,
    error,
    search,
    clearSearch,
    hasSearched,
  };
}
