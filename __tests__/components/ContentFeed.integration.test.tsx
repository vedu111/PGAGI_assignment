import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import ContentFeed from '@/components/content/ContentFeed';

jest.mock('@/store/api/newsApi', () => ({
  newsApi: {
    useGetTopHeadlinesQuery: () => ({ data: [], isLoading: false, isError: false }),
  },
}));

jest.mock('@/store/api/recommendationsApi', () => ({
  recommendationsApi: {
    useGetRecommendationsQuery: () => ({ data: [], isLoading: false, isError: false }),
  },
}));

jest.mock('@/store/api/socialApi', () => ({
  socialApi: {
    useGetSocialFeedQuery: () => ({ data: [], isLoading: false, isError: false }),
  },
}));

describe('ContentFeed integration', () => {
  test('renders empty state when there is no content', () => {
    render(
      <Provider store={store}>
        {/* @ts-ignore - component is default export in project */}
        <ContentFeed />
      </Provider>
    );

    expect(screen.getByText(/Latest Content/i)).toBeInTheDocument();
  });
});


