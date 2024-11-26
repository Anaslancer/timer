import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import CONST, { TimerType, TimerStatusType } from './CONST';

export interface Timer {
  mode: TimerType;
  expectedTime: number;
  restTime: number;
  round: number;
  status: TimerStatusType;
  passedTime: number;
  passedRound: number;
  isResting: boolean;
}

// Define the types for the context state and actions
interface TimerContextType {
  time: number;
  totalTime: number;
  isRunning: boolean;
  errorMessage: string;
  mode: string;
  timersQueue: Timer[];
  startQueue: () => void;
  handlePlayPause: () => void;
  setTimer: (minutes: number, seconds: number) => void;
  setIsRunning: (state: boolean) => void;
  addTimerToQueue: (timer: Timer) => void;
  removeLastTimerFromQueue: () => void;
  removeAllTimersFromQueue: () => void;
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
  timersQueue: [],
  startQueue: () => {},
  handlePlayPause: () => {},
  setTimer: () => {},
  setIsRunning: () => {},
  addTimerToQueue: () => {},
  removeLastTimerFromQueue: () => {},
  removeAllTimersFromQueue: () => {},
};

const TimerContext = createContext<TimerContextType>(defaultContextValue);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  return context;
};

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timersQueue, setTimersQueue] = useState<Timer[]>([]);
  const [time, setTime] = useState(0); // Time remaining
  const [totalTime, setTotalTime] = useState(0); // Total Time
  const [isRunning, setIsRunning] = useState(false); // Timer state (running or paused)
  const [errorMessage, setErrorMessage] = useState(''); // Error handling
  const [mode, setMode] = useState("countdown"); // Timer mode ('countdown' or 'stopwatch')
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null); // Track the active timer
  
  // Timer logic for countdown and stopwatch
  useEffect(() => {
    let timer = setInterval(() => {
      if (activeTimerIndex !== null) {
        let newQueue = [...timersQueue];
        const currentTimer = timersQueue[activeTimerIndex];

        const expectedTime = currentTimer.isResting ? currentTimer.restTime : currentTimer.expectedTime;

        if (currentTimer.passedTime < expectedTime) {
          newQueue[activeTimerIndex].passedTime = currentTimer.passedTime + 1;
        }
        
        if (currentTimer.passedTime === expectedTime) {
          newQueue[activeTimerIndex].passedTime = 0;
          if (currentTimer.mode === CONST.TimerTypes.TABATA) {
            if (currentTimer.isResting) {
              newQueue[activeTimerIndex].passedRound = currentTimer.passedRound + 1;
            }

            currentTimer.isResting = !currentTimer.isResting;
          } else {
            newQueue[activeTimerIndex].passedRound = currentTimer.passedRound + 1;
          }

          if (currentTimer.round === newQueue[activeTimerIndex].passedRound) {
            newQueue[activeTimerIndex].status = CONST.TimerStatuses.COMPLETE;
            
            if (activeTimerIndex < timersQueue.length - 1) {
              const newIndex = activeTimerIndex + 1;
              setActiveTimerIndex(newIndex);
              if (!isRunning) setIsRunning(true);
              newQueue[newIndex].status = CONST.TimerStatuses.PLAY;
            } else {
              setActiveTimerIndex(null); // End of the queue
              if (isRunning) setIsRunning(false);
            }
          }
        }

        // if (currentTimer.mode === CONST.TimerTypes.TABATA) {
        //   if (!currentTimer.isResting && currentTimer.passedTime === currentTimer.expectedTime) {
        //     newQueue[activeTimerIndex].passedTime = 0;
        //     newQueue[activeTimerIndex].isResting = true;
        //   } else if (currentTimer.isResting && currentTimer.passedTime === currentTimer.restTime) {
        //     newQueue[activeTimerIndex].passedTime = 0;
        //     newQueue[activeTimerIndex].passedRound = currentTimer.passedRound + 1;
        //     newQueue[activeTimerIndex].isResting = false;
        //   }
        // }

        setTimersQueue(newQueue);
      }
    }, 1000);

    return () => {
      if (timer) clearInterval(timer); // Clean up the timer
    };
  }, [isRunning, activeTimerIndex, mode]);

  useEffect(() => {
    // const newTotalTime = timersQueue.reduce((total, timer) => total + timer.time, 0);
    // setTotalTime(newTotalTime);
  }, [timersQueue]);

  // Start queue function now selects the first timer and starts it
  const startQueue = () => {
    if (timersQueue.length > 0) {
      setActiveTimerIndex(0);
      setIsRunning(true);

      let newTimersQueue = [...timersQueue];
      newTimersQueue[0] = { 
        ...timersQueue[0], 
        status: CONST.TimerStatuses.PLAY,
      };
      setTimersQueue(newTimersQueue);
  
    } else {
      setErrorMessage('No timers in the queue to start!');
    }
  };

  // Function to save the values that are added 
  const addTimerToQueue = (timer: Timer) => {
    setTimersQueue(prevQueue => [...prevQueue, timer]);
  };

  // Function to save the values that are added 
  const removeLastTimerFromQueue = () => {
    setTimersQueue(prevQueue => prevQueue.slice(0, prevQueue.length - 1));
  };

  // Function to save the values that are added 
  const removeAllTimersFromQueue = () => {
    setTimersQueue([]);
  };

  // Play or pause the timer
  const handlePlayPause = () => {
    if (mode === 'stopwatch' || time > 0) {
      setIsRunning(prev => !prev); // Toggle the running state for both modes
    } else {
      setErrorMessage('Please set a valid time before starting!');
    }
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

  return (
    <TimerContext.Provider 
      value={{ 
        time, 
        isRunning, 
        errorMessage, 
        mode, 
        handlePlayPause, 
        setTimer, 
        timersQueue, 
        addTimerToQueue, 
        removeLastTimerFromQueue,
        removeAllTimersFromQueue,
        setIsRunning, 
        startQueue, 
        totalTime
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};