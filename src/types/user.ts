export interface UserPreferences {
  categories: ContentCategory[];
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

export interface ContentCategory {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_CATEGORIES: ContentCategory[] = [
  { id: 'technology', name: 'Technology', enabled: true, priority: 1 },
  { id: 'sports', name: 'Sports', enabled: true, priority: 2 },
  { id: 'finance', name: 'Finance', enabled: true, priority: 3 },
  { id: 'entertainment', name: 'Entertainment', enabled: true, priority: 4 },
  { id: 'health', name: 'Health', enabled: false, priority: 5 },
  { id: 'science', name: 'Science', enabled: false, priority: 6 },
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  categories: DEFAULT_CATEGORIES,
  theme: 'light',
  language: 'en',
  notifications: true,
};
