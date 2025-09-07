# API Setup Instructions

This document explains how to set up the required API keys for the Personalized Content Dashboard.

## Required API Keys

### 1. NewsAPI Key

**What it's for**: Fetching news articles and headlines

**How to get it**:
1. Go to [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key" or "Sign Up"
3. Create a free account
4. Verify your email address
5. Copy your API key from the dashboard

**Free Tier Limits**:
- 1,000 requests per day
- 1 month of historical data
- No commercial use

**Setup**:
```bash
# Add to your .env.local file
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
```

### 2. TMDB (The Movie Database) API Key

**What it's for**: Fetching movie recommendations and entertainment content

**How to get it**:
1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Click "API" in the top navigation
3. Click "Create Account" or "Login"
4. Fill out the API request form (select "Developer" as the type)
5. Wait for approval (usually instant for free accounts)
6. Go to "API" → "API Key (v3 auth)" and copy your key

**Free Tier Limits**:
- Unlimited requests
- Full access to all data
- No commercial restrictions

**Setup**:
```bash
# Add to your .env.local file
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Mock Social Media API

**What it's for**: Simulating social media posts (no real API needed)

**Setup**: No API key required - this uses mock data

## Environment Configuration

Create a `.env.local` file in your project root:

```bash
# API Keys
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# API Base URLs (optional - defaults are provided)
NEXT_PUBLIC_NEWS_API_BASE_URL=https://newsapi.org/v2
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_SOCIAL_API_BASE_URL=http://localhost:3001/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Personalized Content Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Testing API Keys

After setting up your API keys, you can test them by:

1. **Starting the development server**:
   ```bash
   npm run dev
   ```

2. **Check the API status** in the browser console or by visiting the dashboard

3. **Test search functionality** - try searching for news, movies, or social content

## Troubleshooting

### Common Issues

**1. "API key not found" error**:
- Make sure your `.env.local` file is in the project root
- Restart your development server after adding API keys
- Check that the environment variable names are correct

**2. "Rate limit exceeded" error**:
- You've hit the daily limit for NewsAPI (1,000 requests)
- Wait 24 hours or upgrade to a paid plan
- TMDB has no rate limits for free accounts

**3. "CORS error" in browser**:
- This is normal for development - the APIs work fine in production
- The error doesn't affect functionality

**4. "Network error"**:
- Check your internet connection
- Verify the API endpoints are accessible
- Some APIs may be temporarily down

### API Key Validation

The app includes built-in API key validation. You can check the status by:

1. Opening browser developer tools
2. Looking for API status messages in the console
3. Checking the dashboard for any API-related warnings

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables for all API keys**
- **The `.env.local` file is already in `.gitignore`**
- **API keys are prefixed with `NEXT_PUBLIC_` for client-side access**

## Alternative APIs

If you prefer different APIs:

### News Alternatives:
- **Guardian API**: Free, no key required
- **New York Times API**: Free tier available
- **BBC News API**: Free tier available

### Entertainment Alternatives:
- **OMDb API**: Free for movies
- **Spotify Web API**: For music recommendations
- **YouTube Data API**: For video content

### Social Media Alternatives:
- **Twitter API v2**: Requires approval
- **Instagram Basic Display API**: For Instagram content
- **LinkedIn API**: For professional content

## Support

If you encounter issues:

1. Check the API documentation
2. Verify your API key is active
3. Check your internet connection
4. Review the browser console for errors
5. Ensure environment variables are properly set

For NewsAPI support: [https://newsapi.org/docs](https://newsapi.org/docs)
For TMDB support: [https://developers.themoviedb.org/3](https://developers.themoviedb.org/3)
