'use client';

import React, { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ContentItem } from '@/types/content';
import ContentCard from './ContentCard';
import { cn } from '@/utils/helpers';

export interface DraggableContentCardProps {
  item: ContentItem;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onReadMore?: (item: ContentItem) => void;
  variant?: 'default' | 'compact';
  className?: string;
  enableAutoScroll?: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableContentCard: React.FC<DraggableContentCardProps> = ({
  item,
  index,
  onMove,
  onReadMore,
  variant = 'default',
  className,
  enableAutoScroll = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);

  // Auto-scroll functionality
  const startAutoScroll = useCallback((direction: 'up' | 'down') => {
    if (!enableAutoScroll) return;
    
    console.log('Starting auto-scroll:', direction);
    setIsAutoScrolling(true);
    const scrollSpeed = 10; // pixels per interval
    const scrollInterval = 16; // ~60fps
    
    scrollIntervalRef.current = setInterval(() => {
      const scrollAmount = direction === 'up' ? -scrollSpeed : scrollSpeed;
      window.scrollBy(0, scrollAmount);
    }, scrollInterval);
  }, [enableAutoScroll]);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsAutoScrolling(false);
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | null }>({
    accept: 'content-card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()?.toString() || null,
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed a threshold
      // Use a smaller threshold for more responsive dragging
      const threshold = hoverBoundingRect.height * 0.3; // 30% instead of 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < threshold) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverBoundingRect.height - threshold) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging, dragMonitor }, drag] = useDrag(() => ({
    type: 'content-card',
    item: () => {
      return { id: item.id, index, type: 'content-card' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dragMonitor: monitor,
    }),
    canDrag: true,
  }));

  // Handle auto-scroll when dragging starts
  React.useEffect(() => {
    if (!isDragging || !enableAutoScroll || !dragMonitor) return;

    const checkAutoScroll = () => {
      const clientOffset = dragMonitor.getClientOffset();
      if (!clientOffset) return;

      const scrollThreshold = 100; // pixels from edge to trigger scroll
      const viewportHeight = window.innerHeight;
      const mouseY = clientOffset.y;
      
      // Stop any existing auto-scroll
      stopAutoScroll();
      
      // Check if mouse is near top or bottom of viewport
      if (mouseY < scrollThreshold) {
        console.log('Auto-scroll UP triggered - mouseY:', mouseY, 'threshold:', scrollThreshold);
        startAutoScroll('up');
      } else if (mouseY > viewportHeight - scrollThreshold) {
        console.log('Auto-scroll DOWN triggered - mouseY:', mouseY, 'threshold:', viewportHeight - scrollThreshold);
        startAutoScroll('down');
      }
    };

    // Check auto-scroll periodically while dragging
    const interval = setInterval(checkAutoScroll, 50); // Check every 50ms

    return () => {
      clearInterval(interval);
      stopAutoScroll();
    };
  }, [isDragging, enableAutoScroll, dragMonitor, startAutoScroll, stopAutoScroll]);

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={cn(
        'transition-all duration-200',
        isDragging && 'transform rotate-2 scale-105 shadow-2xl',
        className
      )}
    >
      <div className="relative group">
        {/* Drag Handle */}
        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-md p-1.5 shadow-lg border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing">
            <svg
              className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
        </div>

        {/* Content Card */}
        <ContentCard
          item={item}
          variant={variant}
          onReadMore={onReadMore}
          className="cursor-move"
        />

        {/* Drag Overlay Effect */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-500 flex items-center justify-center">
            <div className="text-blue-600 dark:text-blue-400 font-medium">
              Moving...
            </div>
          </div>
        )}

        {/* Auto-scroll Indicator */}
        {isAutoScrolling && (
          <div className="absolute top-2 right-2 z-30 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
            Auto-scrolling
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableContentCard;
