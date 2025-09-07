import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for infinite scrolling
 */
export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions
) {
  const { hasMore, isLoading, threshold = 0.8, rootMargin = '100px' } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );
      
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, callback, threshold, rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef, elementRef };
}

/**
 * Custom hook for scroll-based loading
 */
export function useScrollLoading(
  callback: () => void,
  options: {
    hasMore: boolean;
    isLoading: boolean;
    threshold?: number;
  }
) {
  const { hasMore, isLoading, threshold = 0.8 } = options;

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      if (scrollPercentage >= threshold) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback, hasMore, isLoading, threshold]);
}
