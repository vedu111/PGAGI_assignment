import { ContentItem, UserPreferences } from '@/types';

/**
 * Validate content item
 */
export function validateContentItem(item: any): item is ContentItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.description === 'string' &&
    typeof item.source === 'string' &&
    typeof item.category === 'string' &&
    typeof item.url === 'string' &&
    typeof item.type === 'string' &&
    ['news', 'recommendation', 'social'].includes(item.type)
  );
}

/**
 * Validate user preferences
 */
export function validateUserPreferences(preferences: any): preferences is UserPreferences {
  return (
    typeof preferences === 'object' &&
    preferences !== null &&
    Array.isArray(preferences.categories) &&
    typeof preferences.theme === 'string' &&
    ['light', 'dark'].includes(preferences.theme) &&
    typeof preferences.language === 'string' &&
    typeof preferences.notifications === 'boolean'
  );
}

/**
 * Validate API response
 */
export function validateApiResponse(response: any): boolean {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.success === 'boolean'
  );
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(params: {
  page?: number;
  limit?: number;
}): { page: number; limit: number } {
  const page = Math.max(1, Math.floor(params.page || 1));
  const limit = Math.min(100, Math.max(1, Math.floor(params.limit || 20)));
  
  return { page, limit };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): boolean {
  return typeof query === 'string' && query.trim().length >= 2;
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlLower = url.toLowerCase();
  
  return imageExtensions.some(ext => urlLower.includes(ext)) || 
         urlLower.includes('image') ||
         urlLower.includes('photo');
}

/**
 * Validate category
 */
export function isValidCategory(category: string): boolean {
  const validCategories = [
    'technology',
    'sports',
    'finance',
    'entertainment',
    'health',
    'science'
  ];
  
  return validCategories.includes(category.toLowerCase());
}

/**
 * Validate content type
 */
export function isValidContentType(type: string): boolean {
  const validTypes = ['news', 'recommendation', 'social'];
  return validTypes.includes(type.toLowerCase());
}
