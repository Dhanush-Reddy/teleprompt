import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDuration } from '../utils/text';

export const useTeleprompter = (sentences, options = {}) => {
  const {
    speed = 'normal', // 'slow', 'normal', 'fast'
    mode = 'normal', // 'normal', 'random', 'chunked'
    isPlaying: initialIsPlaying = false,
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const timerRef = useRef(null);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= sentences.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [sentences.length]);

  useEffect(() => {
    if (!isPlaying || currentIndex >= sentences.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentSentence = sentences[currentIndex];
    let duration = calculateDuration(currentSentence, speed);

    // Mode Adjustments
    if (mode === 'random') {
      // Vary duration by +/- 20%
      const variance = (Math.random() * 0.4) - 0.2; // -0.2 to 0.2
      duration = duration * (1 + variance);
    } else if (mode === 'chunked') {
       // Occasionally speed up or slow down drastically
       if (Math.random() > 0.7) {
          duration = Math.random() > 0.5 ? duration * 0.6 : duration * 1.5;
       }
    }

    timerRef.current = setTimeout(() => {
      advance();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, sentences, speed, mode, advance]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  const restart = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
  const setSentence = (index) => setCurrentIndex(index);

  return {
    currentIndex,
    isPlaying,
    togglePlay,
    restart,
    setSentence,
    progress: (currentIndex / Math.max(sentences.length - 1, 1)) * 100
  };
};
