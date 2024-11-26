import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Timer {
  time: number;
  isRunning: boolean;
  mode: string;
}

// Define the types for the context state and actions
interface TimerContextType {
  time: number;
  totalTime: number;
  isRunning: boolean;
  errorMessage: string;
  mode: string;
  startQueue: () => void;
  handlePlayPause: () => void;
  handleReset: () => void;
  handleFastForward: () => void;
  setTimer: (minutes: number, seconds: number) => void;
  setTimerDirect: (seconds: number) => void;
  setIsRunning: (state: boolean) => void;
  setModer: (mode: string) => void;
  timersQueue: Timer[];
  saveCurrentTimerToQueue: () => void;
  deleteCurrentTimerToQueue: () => void;
}

// Define the type for the TimerProvider props
interface TimerProviderProps {
  children: ReactNode;
}

const defaultContextValue: TimerContextType = {
  time: 0,
  totalTime: 0,
  isRunning: false,
  errorMessage: '',
  mode: 'countdown',
  timersQueue: [{ time: 0, isRunning: false, mode: 'countdown' }],
  startQueue: () => {},
  handlePlayPause: () => {},
  handleReset: () => {},
  handleFastForward: () => {},
  setTimer: () => {},
  setTimerDirect: () => {},
  setIsRunning: () => {},
  setModer: () => {},
  saveCurrentTimerToQueue: () => {},
  deleteCurrentTimerToQueue: () => {},
};

const TimerContext = createContext<TimerContextType>(defaultContextValue);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  return context;
};

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timersQueue, setTimersQueue] = useState<{ time: number; isRunning: boolean; mode: string }[]>([]);
  const [time, setTime] = useState(0); // Time remaining
  const [totalTime, setTotalTime] = useState(0); // Total Time
  //const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
  //const [remainingTime, setRemainingTime] = useState(timersQueue[currentTimerIndex]?.time || 0);
  const [isRunning, setIsRunning] = useState(false); // Timer state (running or paused)
  const [errorMessage, setErrorMessage] = useState(''); // Error handling
  const [mode, setMode] = useState("countdown"); // Timer mode ('countdown' or 'stopwatch')
  //const [currentTimerIndex, setCurrentTimerIndex] = useState(0); // Track the current timer index in the queue
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null); // Track the active timer
  
  // Timer logic for countdown and stopwatch
  useEffect(() => {
    // Countdown mode: Decrement the time
    const timer = setInterval(() => {
      if (isRunning && activeTimerIndex !== null && timersQueue[activeTimerIndex].time > 0) {
        if (mode === 'countdown') {
          if (timersQueue[activeTimerIndex].time -- <= 0) {
            setIsRunning(false);
          }
        }
      }
    }, 1000);

    return () => {
      if (timer) clearInterval(timer); // Clean up the timer
    };
  }, [isRunning, activeTimerIndex, mode, timersQueue]);

  // Start queue function now selects the first timer and starts it
  const startQueue = () => {
    if (timersQueue.length > 0) {
      setActiveTimerIndex(0); // Start with the first timer in the queue
      setIsRunning(true);
    } else {
      setErrorMessage('No timers in the queue to start!');
    }
  };

  // Move to the next timer when the current one finishes
  useEffect(() => {
    if (activeTimerIndex !== null && timersQueue[activeTimerIndex]?.time === 0) {
      // Automatically move to the next timer
      if (activeTimerIndex < timersQueue.length - 1) {
        // setActiveTimerIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : null));
        setActiveTimerIndex(activeTimerIndex + 1);
        setIsRunning(true);
      } else {
        setActiveTimerIndex(null); // End of the queue
        setIsRunning(false);
      }
    }
  }, [activeTimerIndex, timersQueue]);

  useEffect(() => {
    const newTotalTime = timersQueue.reduce((total, timer) => total + timer.time, 0);
    setTotalTime(newTotalTime);
  }, [timersQueue]);

  // Function to save the values that are added 
  const addCurrentTimerToQueue = () => {
    console.log({ time, isRunning, mode });
    if (time === 0) {
      // Don't save if time is 0
      return;
    }

    if (activeTimerIndex === null && timersQueue.length === 0) {
      setActiveTimerIndex(0);
    }

    setTimersQueue(prevQueue => [...prevQueue, { time, isRunning, mode }]);
    console.log("Added a new timer", timersQueue);
  };

  // Function to save the values that are added 
  const deleteCurrentTimerToQueue = () => {
    if (activeTimerIndex !== null && timersQueue.length === 1) {
      setActiveTimerIndex(null);
    }
    setTimersQueue(prevQueue => prevQueue.slice(0, prevQueue.length - 1));
    console.log({timersQueue})
  };

  /*const startQueue = () => {
    //setCurrentTimerIndex(0); // Start from the first timer
    setIsRunning(true); // Start the first timer
  };*/

  // Play or pause the timer
  const handlePlayPause = () => {
    if (mode === 'stopwatch' || time > 0) {
      setIsRunning(prev => !prev); // Toggle the running state for both modes
    } else {
      setErrorMessage('Please set a valid time before starting!');
    }
  };

  // Reset the timer
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setErrorMessage('');
  };

  // Fast forward the timer
  const handleFastForward = () => {
    if (mode === 'countdown') {
      setTime(0); // Set time to 0 for countdown mode
    } else if (mode === 'stopwatch') {
      setTime(300); // Set time to 5 minutes for stopwatch mode
    }
    setIsRunning(false); // Stop the timer after fast forwarding
  };
  
  const setModer = (mode: string) => {
    setMode(mode)
  };

  // Set the timer manually
  const setTimer = (minutes: number, seconds: number) => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setErrorMessage('');
    } else {
      setErrorMessage('Please provide a valid time!');
    }
  };

  const setTimerDirect = (seconds: number) => {
    setTime(seconds);
  }

  return (
    <TimerContext.Provider 
      value={{ 
        time, 
        isRunning, 
        errorMessage, 
        mode, 
        handlePlayPause, 
        handleReset, 
        handleFastForward, 
        setTimer, 
        setModer, 
        timersQueue, 
        saveCurrentTimerToQueue: addCurrentTimerToQueue, 
        deleteCurrentTimerToQueue, 
        setIsRunning, 
        setTimerDirect, 
        startQueue, 
        totalTime
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};