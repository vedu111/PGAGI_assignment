#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# API Keys - Replace with your actual API keys
# Get NewsAPI key from: https://newsapi.org/
NEXT_PUBLIC_NEWS_API_KEY=b5b725f4315a4045969f7b4c7b05bef8

# Get TMDB API key from: https://www.themoviedb.org/settings/api
NEXT_PUBLIC_TMDB_API_KEY=cf22b7f0717f720cd685705f0e9ba7c4

# App Configuration
NEXT_PUBLIC_APP_NAME=Personalized Content Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with placeholder API keys');
  console.log('📝 Please edit .env.local and add your actual API keys');
  console.log('🔗 See API_SETUP.md for instructions on getting API keys');
} else {
  console.log('⚠️  .env.local file already exists');
  console.log('📝 Please check if your API keys are configured correctly');
}

console.log('\n🚀 After adding your API keys, restart your development server:');
console.log('   npm run dev');
