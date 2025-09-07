import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'category';
  count?: number;
}

interface UseSearchSuggestionsOptions {
  maxHistoryItems?: number;
  maxSuggestions?: number;
}

interface UseSearchSuggestionsReturn {
  suggestions: SearchSuggestion[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  getSuggestions: (query: string) => SearchSuggestion[];
}

export function useSearchSuggestions(
  options: UseSearchSuggestionsOptions = {}
): UseSearchSuggestionsReturn {
  const { maxHistoryItems = 10, maxSuggestions = 8 } = options;
  
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('search_history', []);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // Popular/trending searches (could be fetched from API)
  const trendingSearches: SearchSuggestion[] = [
    { id: 'trending-1', text: 'Artificial Intelligence', type: 'trending', count: 1250 },
    { id: 'trending-2', text: 'Climate Change', type: 'trending', count: 980 },
    { id: 'trending-3', text: 'Space Exploration', type: 'trending', count: 750 },
    { id: 'trending-4', text: 'Cryptocurrency', type: 'trending', count: 650 },
    { id: 'trending-5', text: 'Health & Wellness', type: 'trending', count: 580 },
    { id: 'trending-6', text: 'Entertainment News', type: 'trending', count: 520 },
    { id: 'trending-7', text: 'Sports Updates', type: 'trending', count: 480 },
    { id: 'trending-8', text: 'Technology Trends', type: 'trending', count: 420 },
  ];

  // Category suggestions
  const categorySuggestions: SearchSuggestion[] = [
    { id: 'cat-1', text: 'Technology News', type: 'category' },
    { id: 'cat-2', text: 'Sports Highlights', type: 'category' },
    { id: 'cat-3', text: 'Financial Markets', type: 'category' },
    { id: 'cat-4', text: 'Entertainment', type: 'category' },
    { id: 'cat-5', text: 'Health & Science', type: 'category' },
  ];

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    const trimmedQuery = query.trim().toLowerCase();
    
    setSearchHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.toLowerCase() !== trimmedQuery);
      // Add to beginning
      const updated = [trimmedQuery, ...filtered];
      // Limit to max items
      return updated.slice(0, maxHistoryItems);
    });
  }, [setSearchHistory, maxHistoryItems]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  const getSuggestions = useCallback((query: string): SearchSuggestion[] => {
    if (!query.trim()) {
      // Return trending and recent history when no query
      const historySuggestions: SearchSuggestion[] = searchHistory
        .slice(0, 5)
        .map((item, index) => ({
          id: `history-${index}`,
          text: item,
          type: 'history' as const,
        }));

      return [
        ...historySuggestions,
        ...trendingSearches.slice(0, maxSuggestions - historySuggestions.length),
      ];
    }

    const trimmedQuery = query.trim().toLowerCase();
    const allSuggestions: SearchSuggestion[] = [];

    // Add matching history items
    const matchingHistory = searchHistory
      .filter(item => item.toLowerCase().includes(trimmedQuery))
      .map((item, index) => ({
        id: `history-${index}`,
        text: item,
        type: 'history' as const,
      }));

    // Add matching trending items
    const matchingTrending = trendingSearches
      .filter(item => item.text.toLowerCase().includes(trimmedQuery))
      .map(item => ({ ...item }));

    // Add matching category items
    const matchingCategories = categorySuggestions
      .filter(item => item.text.toLowerCase().includes(trimmedQuery))
      .map(item => ({ ...item }));

    // Combine and prioritize
    allSuggestions.push(...matchingHistory);
    allSuggestions.push(...matchingTrending);
    allSuggestions.push(...matchingCategories);

    // Remove duplicates and limit results
    const uniqueSuggestions = allSuggestions.filter(
      (suggestion, index, self) =>
        index === self.findIndex(s => s.text.toLowerCase() === suggestion.text.toLowerCase())
    );

    return uniqueSuggestions.slice(0, maxSuggestions);
  }, [searchHistory, maxSuggestions]);

  // Update suggestions when query changes
  useEffect(() => {
    const newSuggestions = getSuggestions('');
    setSuggestions(newSuggestions);
  }, [getSuggestions]);

  return {
    suggestions,
    addToHistory,
    clearHistory,
    getSuggestions,
  };
}
