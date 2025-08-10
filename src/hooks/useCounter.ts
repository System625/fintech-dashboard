import { useState, useEffect } from 'react';

export const useCounter = (end: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      let startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay, isVisible]);

  return { count, setIsVisible };
};