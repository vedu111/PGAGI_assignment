'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

export interface DragDropSettingsProps {
  className?: string;
}

const DragDropSettings: React.FC<DragDropSettingsProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { dragDrop } = useAppSelector((state) => state.ui);

  const handleToggleDragDrop = () => {
    // This would toggle a user preference for drag and drop
    console.log('Toggle drag and drop preference');
  };

  const handleToggleHapticFeedback = () => {
    // This would toggle haptic feedback for mobile devices
    console.log('Toggle haptic feedback');
  };

  const handleToggleVisualFeedback = () => {
    // This would toggle visual feedback during drag operations
    console.log('Toggle visual feedback');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
          <span>Drag & Drop Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Enable Drag & Drop */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Enable Drag & Drop
              </div>
              <div className="text-sm text-gray-500">
                Allow reordering content by dragging and dropping
              </div>
            </div>
            <button
              onClick={handleToggleDragDrop}
              className={cn(
                'w-12 h-6 rounded-full transition-colors',
                dragDrop.isDragging
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  dragDrop.isDragging ? 'translate-x-6' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          {/* Visual Feedback */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Visual Feedback
              </div>
              <div className="text-sm text-gray-500">
                Show visual effects during drag operations
              </div>
            </div>
            <button
              onClick={handleToggleVisualFeedback}
              className={cn(
                'w-12 h-6 rounded-full transition-colors',
                'bg-blue-500' // Always enabled for now
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  'translate-x-6' // Always enabled for now
                )}
              />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Haptic Feedback
              </div>
              <div className="text-sm text-gray-500">
                Provide tactile feedback on mobile devices
              </div>
            </div>
            <button
              onClick={handleToggleHapticFeedback}
              className={cn(
                'w-12 h-6 rounded-full transition-colors',
                'bg-gray-300 dark:bg-gray-600' // Disabled by default
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  'translate-x-0.5' // Disabled by default
                )}
              />
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  How to use Drag & Drop
                </div>
                <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                  <li>• Hover over a content card to see the drag handle</li>
                  <li>• Click and drag the handle to move the card</li>
                  <li>• Drop the card in a new position to reorder</li>
                  <li>• Your custom order will be saved automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DragDropSettings;
