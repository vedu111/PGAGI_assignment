import React from 'react';
import Spinner from '@/components/ui/Spinner';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
        <Spinner size={size} text={text} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className || ''}`}>
      <Spinner size={size} text={text} />
    </div>
  );
};

export default LoadingSpinner;
