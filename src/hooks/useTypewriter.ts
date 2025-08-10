import { useState, useEffect } from 'react';

export const useTypewriter = (
  text: string, 
  speed: number = 50, 
  options: { 
    instantOnMount?: boolean;
    delay?: number;
  } = {}
) => {
  const { instantOnMount = false, delay = 0 } = options;
  const [displayText, setDisplayText] = useState(instantOnMount ? text : '');
  const [isComplete, setIsComplete] = useState(instantOnMount);

  useEffect(() => {
    // If instant on mount, skip animation
    if (instantOnMount) {
      return;
    }

    // Add delay before starting animation
    const startTimer = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, speed, instantOnMount, delay]);

  return { displayText, isComplete };
};