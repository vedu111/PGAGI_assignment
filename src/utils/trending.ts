import { ContentItem, TrendingItem } from '@/types/content';

export type TrendingPeriod = 'hour' | 'day' | 'week';

function isWithinPeriod(date: Date, period: TrendingPeriod): boolean {
  const now = Date.now();
  const ts = new Date(date).getTime();
  const diffMs = now - ts;
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  const oneWeek = 7 * oneDay;
  switch (period) {
    case 'hour':
      return diffMs <= oneHour;
    case 'day':
      return diffMs <= oneDay;
    case 'week':
      return diffMs <= oneWeek;
    default:
      return true;
  }
}

function computeChangeScore(item: ContentItem): number {
  // Heuristic: newer items score higher; favorites/read flags slightly adjust
  const hoursOld = (Date.now() - new Date(item.publishedAt).getTime()) / (60 * 60 * 1000);
  const recencyScore = Math.max(0, 100 - Math.min(100, hoursOld)); // 0..100
  const favoriteBoost = item.isFavorite ? 10 : 0;
  const readPenalty = item.isRead ? -5 : 0;
  return Math.round(recencyScore + favoriteBoost + readPenalty);
}

export function matchesCategory(item: ContentItem, category: string): boolean {
  if (category === 'all') return true;
  // Match by explicit fields first
  if (category === 'news' || category === 'recommendation' || category === 'social') {
    return item.type === (category as any);
  }
  // Fuzzy match by keywords in title/description/source
  const haystack = `${item.title} ${item.description ?? ''} ${item.source ?? ''}`.toLowerCase();
  const keywords: Record<string, string[]> = {
    technology: ['tech', 'ai', 'software', 'app', 'computer', 'startup', 'device', 'chip', 'cloud'],
    sports: ['sport', 'match', 'league', 'football', 'cricket', 'nba', 'fifa', 'tennis'],
    finance: ['stock', 'market', 'finance', 'crypto', 'bitcoin', 'bank', 'economy'],
    entertainment: ['movie', 'film', 'series', 'music', 'show', 'celebrity', 'tv'],
    health: ['health', 'medical', 'vaccine', 'covid', 'hospital', 'fitness'],
    science: ['science', 'research', 'study', 'nasa', 'space', 'physics', 'biology'],
    politics: ['election', 'government', 'policy', 'minister', 'president', 'parliament'],
    environment: ['climate', 'environment', 'green', 'renewable', 'emissions', 'sustainability'],
  };
  const list = keywords[category] || [];
  return list.some(k => haystack.includes(k));
}

export function computeTrending(
  items: ContentItem[],
  options: { period: TrendingPeriod; category?: string; limit?: number }
): TrendingItem[] {
  const { period, category, limit = 10 } = options;

  const filtered = items.filter((it) => {
    if (category && !matchesCategory(it, category)) return false;
    return isWithinPeriod(it.publishedAt, period);
  });

  const scored = filtered
    .map((it) => ({ item: it, score: computeChangeScore(it) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ item, score }) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    trend: score >= 66 ? 'up' : score <= 33 ? 'down' : 'stable',
    change: Math.max(1, Math.min(99, score)),
    period,
  }));
}


