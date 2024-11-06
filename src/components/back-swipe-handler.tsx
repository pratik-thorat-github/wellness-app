import React, { useState, useRef, TouchEvent } from 'react';

interface SwipeHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance for a swipe
  className?: string;
}

const SwipeHandler: React.FC<SwipeHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  className = '',
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  // Reset everything to initial state
  const resetState = () => {
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setTranslateX(0);
  };

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart || !isDragging) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    
    // Update translation for visual feedback during swipe
    setTranslateX(diff);
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchEnd - touchStart;
    const isLeftSwipe = distance < -threshold;
    const isRightSwipe = distance > threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }

    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }

    resetState();
  };

  return (
    <div
      ref={elementRef}
      className={`touch-handler ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
};

export default SwipeHandler;