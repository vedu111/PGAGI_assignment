import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import userPreferencesReducer from './slices/userPreferencesSlice';
import contentReducer from './slices/contentSlice';
import uiReducer from './slices/uiSlice';

// Import API slices
import { newsApi } from './api/newsApi';
import { recommendationsApi } from './api/recommendationsApi';
import { socialApi } from './api/socialApi';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userPreferences', 'ui'], // Only persist these reducers
  blacklist: ['content'], // Don't persist content as it should be fresh
};

// UI persist config (separate for theme)
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'viewMode', 'itemsPerPage'], // Only persist these UI settings
};

// User preferences persist config
const userPreferencesPersistConfig = {
  key: 'userPreferences',
  storage,
  whitelist: ['preferences'], // Only persist preferences
};

// Root reducer
const rootReducer = combineReducers({
  // Regular reducers
  content: contentReducer,
  
  // Persisted reducers
  userPreferences: persistReducer(userPreferencesPersistConfig, userPreferencesReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  
  // API reducers
  [newsApi.reducerPath]: newsApi.reducer,
  [recommendationsApi.reducerPath]: recommendationsApi.reducer,
  [socialApi.reducerPath]: socialApi.reducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          // RTK Query async actions frequently carry non-serializable meta
          'newsApi/executeQuery/pending',
          'newsApi/executeQuery/fulfilled',
          'newsApi/executeQuery/rejected',
          'recommendationsApi/executeQuery/pending',
          'recommendationsApi/executeQuery/fulfilled',
          'recommendationsApi/executeQuery/rejected',
          'socialApi/executeQuery/pending',
          'socialApi/executeQuery/fulfilled',
          'socialApi/executeQuery/rejected',
          // Content slice passes Date instances in payloads
          'content/setFeedItems',
          'content/addFeedItems',
          'content/setError',
        ],
        ignoredPaths: [
          // Allow Date objects and RTK Query cache slices
          'content.feed.items',
          'content.favorites',
          'newsApi',
          'recommendationsApi',
          'socialApi',
        ],
      },
    })
    .concat(newsApi.middleware)
    .concat(recommendationsApi.middleware)
    .concat(socialApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store and persistor
// already exported above as consts
