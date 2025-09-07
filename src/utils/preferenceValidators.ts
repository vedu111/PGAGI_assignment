import { UserPreferences, ContentCategory } from '@/types/user';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CategoryValidationResult extends ValidationResult {
  category: string;
}

export interface NotificationValidationResult extends ValidationResult {
  notificationType: string;
}

// Category validation
export const validateCategory = (category: any): CategoryValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!category.id || category.id.trim() === '') {
    errors.push('Category ID is required');
  }

  if (!category.name || category.name.trim() === '') {
    errors.push('Category name is required');
  }

  // Weight validation
  if (Number(category.weight ?? category.priority ?? 3) < 1 || Number(category.weight ?? category.priority ?? 3) > 10) {
    errors.push('Category weight must be between 1 and 10');
  }

  if (Number(category.weight ?? category.priority ?? 3) < 3) {
    warnings.push('Low weight may result in less content from this category');
  }

  if (Number(category.weight ?? category.priority ?? 3) > 8) {
    warnings.push('High weight may dominate your feed');
  }

  // Name length validation
  if (category.name.length > 50) {
    errors.push('Category name must be 50 characters or less');
  }

  // Description validation
  if (category.description && category.description.length > 200) {
    errors.push('Category description must be 200 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    category: category.id,
  };
};

// Notification validation
export const validateNotification = (notification: any): NotificationValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!notification.type || notification.type.trim() === '') {
    errors.push('Notification type is required');
  }

  if (!notification.name || notification.name.trim() === '') {
    errors.push('Notification name is required');
  }

  // Type format validation
  if (notification.type && !/^[a-z_]+$/.test(notification.type)) {
    errors.push('Notification type must contain only lowercase letters and underscores');
  }

  // Name length validation
  if (notification.name.length > 100) {
    errors.push('Notification name must be 100 characters or less');
  }

  // Description validation
  if (notification.description && notification.description.length > 300) {
    errors.push('Notification description must be 300 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    notificationType: notification.type,
  };
};

// User preferences validation
export const validateUserPreferences = (preferences: UserPreferences): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Categories validation
  if (!preferences.categories || preferences.categories.length === 0) {
    errors.push('At least one category must be configured');
  } else {
    // Validate each category
    preferences.categories.forEach((category, index) => {
      const categoryValidation = validateCategory(category);
      if (!categoryValidation.isValid) {
        errors.push(`Category ${index + 1} (${category.id}): ${categoryValidation.errors.join(', ')}`);
      }
      warnings.push(...categoryValidation.warnings.map(w => `Category ${category.id}: ${w}`));
    });

    // Check for duplicate category IDs
    const categoryIds = preferences.categories.map(cat => cat.id);
    const duplicateIds = categoryIds.filter((id, index) => categoryIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate category IDs found: ${duplicateIds.join(', ')}`);
    }

    // Check enabled categories count
    const enabledCategories = preferences.categories.filter(cat => cat.enabled);
    if (enabledCategories.length === 0) {
      errors.push('At least one category must be enabled');
    }

    if (enabledCategories.length > 8) {
      warnings.push('Too many enabled categories may result in a cluttered feed');
    }

    // Check weight distribution
    const totalWeight = enabledCategories.reduce((sum, cat: any) => sum + Number(cat.weight ?? cat.priority ?? 3), 0);
    if (totalWeight > 50) {
      warnings.push('High total weight may cause performance issues');
    }
  }

  // Notifications validation (support boolean or array shape)
  const notificationsArray = Array.isArray(preferences.notifications) ? preferences.notifications : [];
  if (notificationsArray.length === 0) {
    warnings.push('No notification preferences configured');
  } else {
    // Validate each notification
    notificationsArray.forEach((notification, index) => {
      const notificationValidation = validateNotification(notification);
      if (!notificationValidation.isValid) {
        errors.push(`Notification ${index + 1} (${notification.type}): ${notificationValidation.errors.join(', ')}`);
      }
      warnings.push(...notificationValidation.warnings.map(w => `Notification ${notification.type}: ${w}`));
    });

    // Check for duplicate notification types
    const notificationTypes = notificationsArray.map(notif => notif.type);
    const duplicateTypes = notificationTypes.filter((type, index) => notificationTypes.indexOf(type) !== index);
    if (duplicateTypes.length > 0) {
      errors.push(`Duplicate notification types found: ${duplicateTypes.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Theme validation
export const validateTheme = (theme: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validThemes = ['light', 'dark', 'system'];
  
  if (!validThemes.includes(theme)) {
    errors.push(`Invalid theme: ${theme}. Must be one of: ${validThemes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Sanitize user preferences
export const sanitizeUserPreferences = (preferences: UserPreferences): UserPreferences => {
  const categories = (preferences.categories || []).map((category: any) => ({
    ...category,
    id: String(category.id || '').trim().toLowerCase(),
    name: String(category.name || '').trim(),
    description: (category.description ? String(category.description).trim() : ''),
    weight: Math.max(1, Math.min(10, Number(category.weight ?? 3))),
    enabled: Boolean(category.enabled),
  }));

  const notifications = Array.isArray((preferences as any).notifications)
    ? (preferences as any).notifications.map((notification: any) => ({
        ...notification,
        type: String(notification.type || '').trim().toLowerCase(),
        name: String(notification.name || '').trim(),
        description: (notification.description ? String(notification.description).trim() : ''),
        enabled: Boolean(notification.enabled),
      }))
    : [];

  return {
    ...preferences,
    categories,
    notifications,
  } as UserPreferences;
};

// Get preference statistics
export const getPreferenceStats = (preferences: UserPreferences) => {
  const enabledCategories = preferences.categories.filter(cat => cat.enabled);
  const notificationsArray = Array.isArray((preferences as any).notifications) ? (preferences as any).notifications : [];
  const enabledNotifications = notificationsArray.filter((notif: any) => notif.enabled);
  
  const totalWeight = enabledCategories.reduce((sum, cat: any) => sum + Number(cat.weight ?? cat.priority ?? 3), 0);
  const averageWeight = enabledCategories.length > 0 ? totalWeight / enabledCategories.length : 0;
  
  const weightDistribution = enabledCategories.reduce((dist: any, cat: any) => {
    const w = Number(cat.weight ?? cat.priority ?? 3);
    const percentage = totalWeight > 0 ? (w / totalWeight) * 100 : 0;
    dist[cat.id] = Math.round(percentage * 100) / 100;
    return dist;
  }, {} as Record<string, number>);

  return {
    totalCategories: preferences.categories.length,
    enabledCategories: enabledCategories.length,
    disabledCategories: preferences.categories.length - enabledCategories.length,
    totalNotifications: notificationsArray.length,
    enabledNotifications: enabledNotifications.length,
    totalWeight,
    averageWeight: Math.round(averageWeight * 100) / 100,
    weightDistribution,
    coverage: enabledCategories.length / preferences.categories.length,
  };
};
