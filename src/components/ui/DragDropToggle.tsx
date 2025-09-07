'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { cn } from '@/utils/helpers';

export interface DragDropToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const DragDropToggle: React.FC<DragDropToggleProps> = ({
  className,
  size = 'md',
  showLabel = true,
}) => {
  const dispatch = useAppDispatch();
  const { dragDrop } = useAppSelector((state) => state.ui);

  const handleToggle = () => {
    // For now, we'll just toggle the visual state
    // In a real implementation, you might want to persist this preference
    console.log('Drag and drop toggled');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  const getButtonSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-center rounded-md border transition-all duration-200',
          dragDrop.isDragging
            ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700',
          getButtonSizeClasses()
        )}
        title="Toggle drag and drop"
      >
        <svg className={getSizeClasses()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>
      
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Drag & Drop
        </span>
      )}
    </div>
  );
};

export default DragDropToggle;
