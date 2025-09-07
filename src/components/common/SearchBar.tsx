'use client';

import React, { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/helpers';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'category';
  count?: number;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
  showSuggestions?: boolean;
  suggestions?: SearchSuggestion[];
  onSuggestionClick?: (suggestion: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  debounceDelay = 300,
  className,
  showSuggestions = false,
  suggestions = [],
  onSuggestionClick,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const debouncedQuery = useDebounce(query, debounceDelay);

  // Trigger search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestionsList(showSuggestions && value.length > 0);
  }, [showSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestionsList(false);
    onSuggestionClick?.(suggestion.text);
    onSearch(suggestion.text);
  }, [onSuggestionClick, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestionsList(false);
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (showSuggestions && query.length > 0) {
      setShowSuggestionsList(true);
    }
  }, [showSuggestions, query]);

  const handleBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestionsList(false), 200);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        rightIcon={
          isLoading ? (
            <svg
              className="h-4 w-4 animate-spin text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-gray-400"
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
          )
        }
        fullWidth
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestionsList && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center justify-between"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center space-x-2">
                  {suggestion.type === 'history' && (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {suggestion.type === 'trending' && (
                    <svg className="h-4 w-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {suggestion.type === 'category' && (
                    <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                  <span>{suggestion.text}</span>
                </div>
                {suggestion.count && (
                  <span className="text-xs text-gray-500">{suggestion.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
