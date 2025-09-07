'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DraggableContentFeed from '@/components/content/DraggableContentFeed';
import DragDropToggle from '@/components/ui/DragDropToggle';
import Button from '@/components/ui/Button';
import { getRandomMockData } from '@/utils/mockData';

export default function DragDropDemo() {
  const [enableDragDrop, setEnableDragDrop] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleToggleDragDrop = () => {
    setEnableDragDrop(!enableDragDrop);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drag & Drop Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience the drag and drop functionality for content reordering
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DragDropToggle 
                  size="md" 
                  showLabel={true}
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">View Mode:</span>
                  <Button 
                    variant={viewMode === 'grid' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => handleViewModeChange('grid')}
                  >
                    Grid
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => handleViewModeChange('list')}
                  >
                    List
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleToggleDragDrop}
                >
                  {enableDragDrop ? 'Disable' : 'Enable'} Drag & Drop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">When Drag & Drop is Enabled:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Hover over any content card to see the drag handle</li>
                  <li>• Click and drag the handle to move the card</li>
                  <li>• Drop the card in a new position to reorder</li>
                  <li>• Visual feedback shows during drag operations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Smooth animations and transitions</li>
                  <li>• Visual feedback during drag operations</li>
                  <li>• Automatic state persistence</li>
                  <li>• Works in both grid and list views</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {enableDragDrop ? 'Draggable' : 'Static'} Content Feed
            </h2>
            <div className="text-sm text-gray-500">
              {enableDragDrop ? 'Drag and drop enabled' : 'Drag and drop disabled'}
            </div>
          </div>
          
          <DraggableContentFeed 
            enableDragDrop={enableDragDrop}
            viewMode={viewMode}
            itemsPerPage={12}
            enableAutoScroll={true}
          />
        </div>
      </div>
    </Layout>
  );
}
