import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface SwipeBackHandlerProps {
  children: ReactNode;
  onBack: () => void;
  threshold?: number;
}

const SwipeBackHandler = ({ 
  children, 
  onBack, 
  threshold = 100 
}: SwipeBackHandlerProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [currentTranslate, setCurrentTranslate] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent): void => {
    if (e.touches[0].clientX > 20) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentTranslate(0);
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: TouchEvent): void => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    const newTranslate = Math.max(0, Math.min(diff, window.innerWidth));
    setCurrentTranslate(newTranslate);
  };

  const handleTouchEnd = (): void => {
    if (!isDragging) return;
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-out';
    }
    alert(currentTranslate)
    if (currentTranslate > threshold) {
      setCurrentTranslate(window.innerWidth);
      setTimeout(() => {
        onBack();
      }, 300);
    } else {
      setCurrentTranslate(0);
    }
    
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = () => handleTouchEnd();

    container.addEventListener('touchstart', touchStartHandler);
    container.addEventListener('touchmove', touchMoveHandler);
    container.addEventListener('touchend', touchEndHandler);

    return () => {
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, [isDragging, startX, threshold]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-white touch-pan-y"
      style={{
        transform: `translateX(${currentTranslate}px)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      <div 
        className="fixed left-4 top-1/2 -translate-y-1/2 transition-opacity"
        style={{ opacity: currentTranslate / threshold }}
      >
        <ChevronLeft className="w-8 h-8 text-gray-500" />
      </div>
      
      {children}
    </div>
  );
};

export default SwipeBackHandler;