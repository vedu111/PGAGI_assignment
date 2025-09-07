import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, ContentFeed, SearchResult, TrendingItem } from '@/types/content';

interface ContentState {
  // Feed data
  feed: ContentFeed;
  trending: TrendingItem[];
  
  // Search
  searchResults: SearchResult | null;
  searchQuery: string;
  
  // Favorites
  favorites: ContentItem[];
  
  // UI state
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  hasMore: boolean;
  
  // Filters
  activeFilters: {
    categories: string[];
    types: string[];
    dateRange: string;
  };
}

const initialState: ContentState = {
  feed: {
    items: [],
    hasMore: true,
    nextPage: 1,
    totalCount: 0,
  },
  trending: [],
  searchResults: null,
  searchQuery: '',
  favorites: [],
  isLoading: false,
  isSearching: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  activeFilters: {
    categories: [],
    types: [],
    dateRange: 'all',
  },
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Feed actions
    setFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.feed.items = action.payload;
      state.error = null;
    },

    addFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.feed.items = [...state.feed.items, ...action.payload];
    },

    updateFeedItem: (state, action: PayloadAction<{ id: string; updates: Partial<ContentItem> }>) => {
      const { id, updates } = action.payload;
      const index = state.feed.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.feed.items[index] = { ...state.feed.items[index], ...updates };
      }
    },

    removeFeedItem: (state, action: PayloadAction<string>) => {
      state.feed.items = state.feed.items.filter(item => item.id !== action.payload);
    },

    setFeedPagination: (state, action: PayloadAction<{ hasMore: boolean; nextPage?: number; totalCount?: number }>) => {
      const { hasMore, nextPage, totalCount } = action.payload;
      state.feed.hasMore = hasMore;
      state.feed.nextPage = nextPage;
      state.feed.totalCount = totalCount;
    },

    reorderFeedItems: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const items = [...state.feed.items];
      const draggedItem = items[dragIndex];
      
      // Remove the dragged item
      items.splice(dragIndex, 1);
      // Insert it at the new position
      items.splice(hoverIndex, 0, draggedItem);
      
      state.feed.items = items;
    },

    // Trending actions
    setTrendingItems: (state, action: PayloadAction<TrendingItem[]>) => {
      state.trending = action.payload;
    },

    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSearchResults: (state, action: PayloadAction<SearchResult>) => {
      state.searchResults = action.payload;
    },

    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchQuery = '';
    },

    // Favorites actions
    addToFavorites: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      if (!state.favorites.find(fav => fav.id === item.id)) {
        state.favorites.push({ ...item, isFavorite: true });
      }
      // Also update in feed if exists
      const feedIndex = state.feed.items.findIndex(feedItem => feedItem.id === item.id);
      if (feedIndex !== -1) {
        state.feed.items[feedIndex].isFavorite = true;
      }
    },

    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.favorites = state.favorites.filter(item => item.id !== itemId);
      // Also update in feed if exists
      const feedIndex = state.feed.items.findIndex(item => item.id === itemId);
      if (feedIndex !== -1) {
        state.feed.items[feedIndex].isFavorite = false;
      }
    },

    setFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.favorites = action.payload;
    },

    // Mark as read
    markAsRead: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const feedIndex = state.feed.items.findIndex(item => item.id === itemId);
      if (feedIndex !== -1) {
        state.feed.items[feedIndex].isRead = true;
      }
      const favIndex = state.favorites.findIndex(item => item.id === itemId);
      if (favIndex !== -1) {
        state.favorites[favIndex].isRead = true;
      }
    },

    // Filter actions
    setActiveFilters: (state, action: PayloadAction<Partial<ContentState['activeFilters']>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },

    clearFilters: (state) => {
      state.activeFilters = {
        categories: [],
        types: [],
        dateRange: 'all',
      };
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset state
    resetContent: (state) => {
      state.feed = {
        items: [],
        hasMore: true,
        nextPage: 1,
        totalCount: 0,
      };
      state.trending = [];
      state.searchResults = null;
      state.searchQuery = '';
      state.error = null;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setFeedItems,
  addFeedItems,
  updateFeedItem,
  removeFeedItem,
  setFeedPagination,
  reorderFeedItems,
  setTrendingItems,
  setSearchQuery,
  setSearchResults,
  clearSearchResults,
  addToFavorites,
  removeFromFavorites,
  setFavorites,
  markAsRead,
  setActiveFilters,
  clearFilters,
  setLoading,
  setSearching,
  setError,
  resetContent,
} = contentSlice.actions;

export default contentSlice.reducer;
