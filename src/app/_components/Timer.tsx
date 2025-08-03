"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  autoStart?: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onComplete, autoStart = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate progress percentage
  const progress = (timeLeft / duration) * 100;
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, onComplete]);

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      resetTimer();
      setIsActive(true);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsPaused(false);
    setIsActive(false);
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  // Determine the color based on the time left
  const getColor = () => {
    if (progress > 60) return 'text-emerald-500';
    if (progress > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 relative flex items-center justify-center">
          {/* Progress Circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={progress > 60 ? '#10b981' : progress > 30 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
          
          {/* Time Text */}
          <div className={`absolute text-3xl font-bold ${getColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          {!isActive ? (
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full"
              onClick={startTimer}
            >
              <Play size={24} />
            </button>
          ) : (
            <button
              className={`${isPaused ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white p-3 rounded-full`}
              onClick={toggleTimer}
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
          )}
          
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full"
            onClick={resetTimer}
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;