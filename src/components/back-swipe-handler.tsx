import React, { useState, useRef, TouchEvent, useEffect } from 'react';

interface SwipeHandlerProps {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
  maxSwipeDistance?: number;
  diagonalThreshold?: number;
}

interface TouchCoordinates {
  x: number;
  y: number;
}

const SwipeHandler: React.FC<SwipeHandlerProps> = ({
  children,
  onSwipeRight,
  threshold = 50,
  className = '',
  maxSwipeDistance = 200,
  diagonalThreshold = 10,
}) => {
  const [touchStart, setTouchStart] = useState<TouchCoordinates | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchCoordinates | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Function to prevent default on all touch events during swipe
  const preventTouchMove = (e: TouchEvent) => {
    if (isHorizontalSwipe) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.targetTouches[0];
      setTouchEnd(null);
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY
      });
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart || !isDragging) return;

      const touch = e.targetTouches[0];
      const currentTouch = {
        x: touch.clientX,
        y: touch.clientY
      };

      const diffX = currentTouch.x - touchStart.x;
      const diffY = Math.abs(currentTouch.y - touchStart.y);
      const absX = Math.abs(diffX);

      // If already in horizontal swipe mode, prevent all vertical movement
      if (isHorizontalSwipe) {
        e.preventDefault();
        
        // Only allow left to right movement (positive diffX)
        if (diffX < 0) {
          setTranslateX(0);
          return;
        }

        // Limit the maximum swipe distance
        const limitedDiffX = Math.min(diffX, maxSwipeDistance);
        setTranslateX(limitedDiffX);
        setTouchEnd(currentTouch);
        return;
      }

      // Initial detection of swipe direction
      if (!isHorizontalSwipe && (absX > 10 || diffY > 10)) {
        // If movement is more horizontal than vertical
        if (absX > diffY && diffX > 0) {
          e.preventDefault();
          setIsHorizontalSwipe(true);
          
          // Add global touch event prevention
          document.body.style.overflow = 'hidden';
          document.addEventListener('touchmove', preventTouchMove as any, { passive: false });
        } else {
          // If it's more vertical or negative horizontal, reset
          resetState();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart || !touchEnd || !isHorizontalSwipe) {
        resetState();
        return;
      }

      const distance = touchEnd.x - touchStart.x;
      const isRightSwipe = distance > threshold;

      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }

      resetState();
    };

    // Add event listeners with { passive: false }
    element.addEventListener('touchstart', handleTouchStart as any, { passive: true });
    element.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    element.addEventListener('touchend', handleTouchEnd as any, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart as any);
      element.removeEventListener('touchmove', handleTouchMove as any);
      element.removeEventListener('touchend', handleTouchEnd as any);
      document.removeEventListener('touchmove', preventTouchMove as any);
      document.body.style.overflow = '';
    };
  }, [
    touchStart,
    isDragging,
    isHorizontalSwipe,
    threshold,
    onSwipeRight,
    touchEnd,
    maxSwipeDistance
  ]);

  const resetState = () => {
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setTranslateX(0);
    setIsHorizontalSwipe(false);
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', preventTouchMove as any);
  };

  return (
    <div
      ref={elementRef}
      className={`touch-handler ${className}`}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default SwipeHandler;