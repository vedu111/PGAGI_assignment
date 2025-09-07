import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences, ContentCategory, DEFAULT_USER_PREFERENCES } from '@/types/user';

interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserPreferencesState = {
  preferences: DEFAULT_USER_PREFERENCES,
  isLoading: false,
  error: null,
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    // Update entire preferences
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
      state.error = null;
    },

    // Update specific category
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const category = state.preferences.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.enabled = !category.enabled;
      }
    },

    // Update category priority
    updateCategoryPriority: (state, action: PayloadAction<{ id: string; priority: number }>) => {
      const { id, priority } = action.payload;
      const category = state.preferences.categories.find(cat => cat.id === id);
      if (category) {
        category.priority = priority;
      }
    },

    // Update theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.preferences.theme = action.payload;
    },

    // Update language
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },

    // Update notifications setting
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.preferences.notifications = action.payload;
    },

    // Add new category
    addCategory: (state, action: PayloadAction<ContentCategory>) => {
      state.preferences.categories.push(action.payload);
    },

    // Remove category
    removeCategory: (state, action: PayloadAction<string>) => {
      state.preferences.categories = state.preferences.categories.filter(
        cat => cat.id !== action.payload
      );
    },

    // Reset to default preferences
    resetPreferences: (state) => {
      state.preferences = DEFAULT_USER_PREFERENCES;
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPreferences,
  toggleCategory,
  updateCategoryPriority,
  setTheme,
  setLanguage,
  setNotifications,
  addCategory,
  removeCategory,
  resetPreferences,
  setLoading,
  setError,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
