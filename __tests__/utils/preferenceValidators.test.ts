import { sanitizeUserPreferences, validateUserPreferences, getPreferenceStats } from '@/utils/preferenceValidators';
import { DEFAULT_USER_PREFERENCES } from '@/types/user';

describe('preferenceValidators', () => {
  test('sanitizeUserPreferences handles boolean notifications and normalizes categories', () => {
    const input: any = {
      ...DEFAULT_USER_PREFERENCES,
      notifications: true,
      categories: [
        { id: ' Finance ', name: ' Finance ', enabled: true, priority: 3 },
      ],
    };

    const sanitized = sanitizeUserPreferences(input);
    expect(Array.isArray(sanitized.notifications)).toBe(true);
    expect(sanitized.notifications).toHaveLength(0);
    expect(sanitized.categories[0].id).toBe('finance');
    expect(sanitized.categories[0].enabled).toBe(true);
  });

  test('validateUserPreferences returns warnings and errors appropriately', () => {
    const prefs = {
      ...DEFAULT_USER_PREFERENCES,
      categories: [
        { id: 'tech', name: 'Tech', enabled: true, priority: 1 },
        { id: 'tech', name: 'Tech Duplicate', enabled: true, priority: 2 },
      ],
      notifications: [] as any,
    } as any;

    const result = validateUserPreferences(prefs);
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/Duplicate category IDs/);
  });

  test('getPreferenceStats handles priority/weight and boolean notifications', () => {
    const prefs = {
      ...DEFAULT_USER_PREFERENCES,
      notifications: true as any,
      categories: [
        { id: 'finance', name: 'Finance', enabled: true, priority: 3 },
        { id: 'tech', name: 'Tech', enabled: false, priority: 2 },
      ],
    } as any;
    const stats = getPreferenceStats(prefs);
    expect(stats.enabledCategories).toBe(1);
    expect(stats.totalNotifications).toBe(0);
    expect(stats.coverage).toBeCloseTo(1 / 2);
  });
});


