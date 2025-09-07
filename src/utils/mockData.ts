import { ContentItem, NewsItem, RecommendationItem, SocialItem } from '@/types/content';

// Mock news data
export const mockNewsData: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Revolutionary AI Breakthrough Changes Everything',
    description: 'Scientists announce a new AI model that can understand context like never before, potentially revolutionizing how we interact with technology.',
    imageUrl: 'https://picsum.photos/400/200?random=1',
    source: 'TechNews',
    category: 'technology',
    publishedAt: new Date('2024-01-15T10:30:00Z'),
    url: 'https://example.com/news/ai-breakthrough',
    type: 'news',
    author: 'Dr. Sarah Johnson',
    content: 'Full article content about AI breakthrough...',
    tags: ['AI', 'technology', 'breakthrough', 'science', 'innovation'],
  },
  {
    id: 'news-2',
    title: 'Major Sports League Announces New Season Format',
    description: 'The league introduces innovative changes to make games more exciting and accessible to fans worldwide.',
    imageUrl: 'https://picsum.photos/400/200?random=2',
    source: 'SportsDaily',
    category: 'sports',
    publishedAt: new Date('2024-01-15T08:15:00Z'),
    url: 'https://example.com/news/sports-format',
    type: 'news',
    author: 'Mike Wilson',
    content: 'Full article content about sports format changes...',
    tags: ['sports', 'league', 'format', 'season', 'innovation'],
  },
  {
    id: 'news-3',
    title: 'Stock Market Reaches New All-Time High',
    description: 'Major indices surge as investors show renewed confidence in the global economy.',
    imageUrl: 'https://picsum.photos/400/200?random=3',
    source: 'FinanceToday',
    category: 'finance',
    publishedAt: new Date('2024-01-15T06:45:00Z'),
    url: 'https://example.com/news/market-high',
    type: 'news',
    author: 'Jennifer Chen',
    content: 'Full article content about market performance...',
    tags: ['finance', 'market', 'stocks', 'economy', 'investment'],
  },
  {
    id: 'news-4',
    title: 'Breakthrough in Renewable Energy Technology',
    description: 'New solar panel technology promises to make clean energy more affordable and efficient than ever.',
    imageUrl: 'https://picsum.photos/400/200?random=4',
    source: 'GreenTech',
    category: 'environment',
    publishedAt: new Date('2024-01-15T04:20:00Z'),
    url: 'https://example.com/news/renewable-energy',
    type: 'news',
    author: 'Alex Rodriguez',
    content: 'Full article content about renewable energy...',
    tags: ['renewable', 'energy', 'solar', 'environment', 'technology'],
  },
  {
    id: 'news-5',
    title: 'New Study Reveals Health Benefits of Exercise',
    description: 'Research shows that regular physical activity can significantly improve mental health and longevity.',
    imageUrl: 'https://picsum.photos/400/200?random=5',
    source: 'HealthWeekly',
    category: 'health',
    publishedAt: new Date('2024-01-15T02:10:00Z'),
    url: 'https://example.com/news/exercise-health',
    type: 'news',
    author: 'Dr. Emily Brown',
    content: 'Full article content about exercise benefits...',
    tags: ['health', 'exercise', 'mental-health', 'longevity', 'research'],
  },
];

// Mock movie recommendations
export const mockMovieData: RecommendationItem[] = [
  {
    id: 'movie-1',
    title: 'The Future Chronicles',
    description: 'A sci-fi thriller about time travel and its consequences on humanity.',
    imageUrl: 'https://picsum.photos/400/200?random=6',
    source: 'MovieDB',
    category: 'entertainment',
    publishedAt: new Date('2024-01-14T20:00:00Z'),
    url: 'https://example.com/movie/future-chronicles',
    type: 'recommendation',
    rating: 8.5,
    year: 2024,
    genre: 'Sci-Fi',
    duration: '2h 15m',
    director: 'Christopher Nolan',
    cast: ['Tom Hardy', 'Anne Hathaway', 'Michael Caine'],
    tags: ['sci-fi', 'time-travel', 'thriller', 'action', 'drama'],
  },
  {
    id: 'movie-2',
    title: 'Ocean Dreams',
    description: 'A beautiful documentary exploring the mysteries of the deep ocean.',
    imageUrl: 'https://picsum.photos/400/200?random=7',
    source: 'NatureFilms',
    category: 'environment',
    publishedAt: new Date('2024-01-14T18:30:00Z'),
    url: 'https://example.com/movie/ocean-dreams',
    type: 'recommendation',
    rating: 9.2,
    year: 2024,
    genre: 'Documentary',
    duration: '1h 45m',
    director: 'David Attenborough',
    cast: ['David Attenborough'],
    tags: ['documentary', 'ocean', 'nature', 'environment', 'wildlife'],
  },
  {
    id: 'movie-3',
    title: 'Digital Revolution',
    description: 'An exploration of how technology is transforming our daily lives.',
    imageUrl: 'https://picsum.photos/400/200?random=8',
    source: 'TechDocs',
    category: 'technology',
    publishedAt: new Date('2024-01-14T16:15:00Z'),
    url: 'https://example.com/movie/digital-revolution',
    type: 'recommendation',
    rating: 7.8,
    year: 2024,
    genre: 'Documentary',
    duration: '1h 30m',
    director: 'Lisa Wang',
    cast: ['Elon Musk', 'Tim Cook', 'Satya Nadella'],
    tags: ['technology', 'digital', 'innovation', 'future', 'documentary'],
  },
];

// Mock social media posts
export const mockSocialData: SocialItem[] = [
  {
    id: 'social-1',
    title: 'Just finished reading an amazing book about AI ethics! 🤖📚',
    description: 'The author really opened my eyes to the importance of responsible AI development. Highly recommend!',
    imageUrl: 'https://picsum.photos/400/200?random=9',
    source: 'Twitter',
    category: 'technology',
    publishedAt: new Date('2024-01-15T12:00:00Z'),
    url: 'https://example.com/social/ai-ethics-post',
    type: 'social',
    author: '@tech_enthusiast',
    likes: 245,
    shares: 18,
    comments: 32,
    hashtags: ['#AI', '#Ethics', '#Technology', '#Books'],
    platform: 'Twitter',
    verified: true,
    tags: ['AI', 'ethics', 'books', 'technology', 'social'],
  },
  {
    id: 'social-2',
    title: 'Beautiful sunset from my hike today! 🌅🏔️',
    description: 'Sometimes you need to disconnect to reconnect with what matters most.',
    imageUrl: 'https://picsum.photos/400/200?random=10',
    source: 'Instagram',
    category: 'environment',
    publishedAt: new Date('2024-01-15T19:30:00Z'),
    url: 'https://example.com/social/sunset-hike',
    type: 'social',
    author: '@nature_lover',
    likes: 189,
    shares: 12,
    comments: 25,
    hashtags: ['#Nature', '#Hiking', '#Sunset', '#Peace'],
    platform: 'Instagram',
    verified: false,
    tags: ['nature', 'hiking', 'sunset', 'peace', 'social'],
  },
  {
    id: 'social-3',
    title: 'Market analysis: Why I\'m bullish on renewable energy stocks 📈⚡',
    description: 'The shift towards clean energy is accelerating faster than most people realize.',
    imageUrl: 'https://picsum.photos/400/200?random=11',
    source: 'LinkedIn',
    category: 'finance',
    publishedAt: new Date('2024-01-15T14:45:00Z'),
    url: 'https://example.com/social/renewable-energy-analysis',
    type: 'social',
    author: '@finance_expert',
    likes: 156,
    shares: 28,
    comments: 41,
    hashtags: ['#Finance', '#RenewableEnergy', '#Stocks', '#Investment'],
    platform: 'LinkedIn',
    verified: true,
    tags: ['finance', 'renewable-energy', 'stocks', 'investment', 'social'],
  },
];

// Combined mock data
export const mockContentData: ContentItem[] = [
  ...mockNewsData,
  ...mockMovieData,
  ...mockSocialData,
];

// Get mock data by category
export const getMockDataByCategory = (category: string): ContentItem[] => {
  return mockContentData.filter(item => item.category === category);
};

// Get mock data by type
export const getMockDataByType = (type: string): ContentItem[] => {
  return mockContentData.filter(item => item.type === type);
};

// Get random mock data with pagination support
export const getRandomMockData = (count: number = 10, page: number = 1): ContentItem[] => {
  const shuffled = [...mockContentData].sort(() => 0.5 - Math.random());
  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  return shuffled.slice(startIndex, endIndex);
};

// Generate more mock data for infinite scrolling
export const generateMoreMockData = (count: number = 10, page: number = 1): ContentItem[] => {
  const additionalData: ContentItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomType = Math.random();
    let newItem: ContentItem;
    const uniqueId = `${Date.now()}-${page}-${i}`;
    
    if (randomType < 0.4) {
      // Generate news item
      newItem = {
        id: `news-${uniqueId}`,
        title: `Breaking News Update ${page}-${i + 1}`,
        description: `Latest developments in technology, science, and global events. This is dynamically generated content for infinite scrolling.`,
        imageUrl: `https://picsum.photos/400/200?random=${page * 100 + i}`,
        source: `News Source ${page}-${i + 1}`,
        category: ['technology', 'sports', 'finance', 'health', 'environment'][Math.floor(Math.random() * 5)],
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        url: `https://example.com/news/${page}-${i + 1}`,
        type: 'news',
        author: `Author ${page}-${i + 1}`,
        content: `Full article content ${page}-${i + 1}...`,
        tags: [`tag${page}-${i + 1}`, 'news', 'update', 'latest'],
      };
    } else if (randomType < 0.7) {
      // Generate recommendation item
      newItem = {
        id: `movie-${uniqueId}`,
        title: `Featured Movie ${page}-${i + 1}`,
        description: `A must-watch film that's trending right now. Perfect for your entertainment needs.`,
        imageUrl: `https://picsum.photos/400/200?random=${page * 100 + i + 1000}`,
        source: `MovieDB`,
        category: 'entertainment',
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last month
        url: `https://example.com/movie/${page}-${i + 1}`,
        type: 'recommendation',
        rating: 7 + Math.random() * 3, // Rating between 7-10
        year: 2020 + Math.floor(Math.random() * 5), // Year between 2020-2024
        genre: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller'][Math.floor(Math.random() * 5)],
        duration: `${Math.floor(Math.random() * 60) + 90}m`, // Duration between 90-150 minutes
        director: `Director ${page}-${i + 1}`,
        cast: [`Actor ${page}-${i + 1}`, `Actress ${page}-${i + 1}`],
        tags: ['movie', 'entertainment', 'recommended'],
      };
    } else {
      // Generate social item
      newItem = {
        id: `social-${uniqueId}`,
        title: `Social Media Post ${page}-${i + 1}`,
        description: `Interesting thoughts and updates from the community. Join the conversation!`,
        imageUrl: `https://picsum.photos/400/200?random=${page * 100 + i + 2000}`,
        source: ['Twitter', 'Instagram', 'LinkedIn'][Math.floor(Math.random() * 3)],
        category: ['technology', 'finance', 'environment'][Math.floor(Math.random() * 3)],
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random date within last day
        url: `https://example.com/social/${page}-${i + 1}`,
        type: 'social',
        author: `@user${page}-${i + 1}`,
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        hashtags: [`#trending${page}-${i + 1}`, '#social', '#community'],
        platform: ['Twitter', 'Instagram', 'LinkedIn'][Math.floor(Math.random() * 3)],
        verified: Math.random() > 0.5,
        tags: ['social', 'community', 'trending'],
      };
    }
    
    additionalData.push(newItem);
  }
  
  return additionalData;
};
