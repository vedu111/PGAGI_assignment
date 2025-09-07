import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4">
            <svg
              className="h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-4 max-w-md rounded bg-gray-100 p-4 text-left dark:bg-gray-800">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          
          <div className="space-x-2">
            <Button onClick={this.handleReset} variant="primary">
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
