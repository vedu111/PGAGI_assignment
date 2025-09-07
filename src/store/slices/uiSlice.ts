import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Modals
  modals: {
    settings: boolean;
    preferences: boolean;
    search: boolean;
  };
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
    read: boolean;
  }>;
  
  // Loading states
  loading: {
    global: boolean;
    feed: boolean;
    search: boolean;
    favorites: boolean;
  };
  
  // View preferences
  viewMode: 'grid' | 'list';
  itemsPerPage: number;
  
  // Drag and drop
  dragDrop: {
    isDragging: boolean;
    draggedItem: string | null;
    dropTarget: string | null;
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
  modals: {
    settings: false,
    preferences: false,
    search: false,
  },
  notifications: [],
  loading: {
    global: false,
    feed: false,
    search: false,
    favorites: false,
  },
  viewMode: 'grid',
  itemsPerPage: 20,
  dragDrop: {
    isDragging: false,
    draggedItem: null,
    dropTarget: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Modal actions
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: (state) => {
      state.modals = {
        settings: false,
        preferences: false,
        search: false,
      };
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
    }>) => {
      const notification = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },

    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{
      key: keyof UIState['loading'];
      value: boolean;
    }>) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    // View preferences
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },

    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },

    // Drag and drop actions
    startDrag: (state, action: PayloadAction<string>) => {
      state.dragDrop.isDragging = true;
      state.dragDrop.draggedItem = action.payload;
    },

    setDropTarget: (state, action: PayloadAction<string | null>) => {
      state.dragDrop.dropTarget = action.payload;
    },

    endDrag: (state) => {
      state.dragDrop.isDragging = false;
      state.dragDrop.draggedItem = null;
      state.dragDrop.dropTarget = null;
    },

    // Reset UI state
    resetUI: (state) => {
      state.sidebarOpen = false;
      state.modals = {
        settings: false,
        preferences: false,
        search: false,
      };
      state.notifications = [];
      state.loading = {
        global: false,
        feed: false,
        search: false,
        favorites: false,
      };
      state.dragDrop = {
        isDragging: false,
        draggedItem: null,
        dropTarget: null,
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  setLoading,
  setGlobalLoading,
  setViewMode,
  setItemsPerPage,
  startDrag,
  setDropTarget,
  endDrag,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
