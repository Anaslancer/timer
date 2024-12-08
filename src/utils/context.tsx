import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import CONST, { TimerType, TimerStatusType } from './CONST';

export interface Timer {
  id: string;
  mode?: TimerType;
  expectedTime: number;
  restTime: number;
  round: number;
  status?: TimerStatusType;
  passedTime: number;
  passedRound: number;
  isResting: boolean;
  description: string;
}

// Define the types for the context state and actions
interface TimerContextType {
  time: number;
  running: boolean;
  errorMessage: string;
  timersQueue: Timer[];
  activeTimerIndex: number;
  startQueue: () => void;
  stopQueue: () => void;
  resetQueue: () => void;
  forwardQueue: () => void;
  setTimersToQueue: (timers: Timer[]) => void;
  addTimerToQueue: (timer: Timer) => void;
  removeLastTimerFromQueue: () => void;
  removeAllTimersFromQueue: () => void;
  removeTimerFromQueue: (index: number) => void;
}

// Define the type for the TimerProvider props
interface TimerProviderProps {
  children: ReactNode;
}

const defaultContextValue: TimerContextType = {
  time: 0,
  running: false,
  errorMessage: '',
  timersQueue: [],
  activeTimerIndex: -1,
  startQueue: () => {},
  stopQueue: () => {},
  resetQueue: () => {},
  forwardQueue: () => {},
  setTimersToQueue: () => {},
  addTimerToQueue: () => {},
  removeLastTimerFromQueue: () => {},
  removeAllTimersFromQueue: () => {},
  removeTimerFromQueue: () => {},
};

const TimerContext = createContext<TimerContextType>(defaultContextValue);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  return context;
};

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timersQueue, setTimersQueue] = useState<Timer[]>([]);
  const [time, setTime] = useState(0); // Time remaining
  const [running, setRunning] = useState(false); // Timer state (running or paused)
  const [errorMessage, setErrorMessage] = useState(''); // Error handling
  const [activeTimerIndex, setActiveTimerIndex] = useState(-1); // Track the active timer

  // Load timersQueue from local storage
  useEffect(() => {
    const strQueue = localStorage.getItem(CONST.StorageKeys.QUEUE);
    const strTime = localStorage.getItem(CONST.StorageKeys.TIME);
    const strActiveIndex = localStorage.getItem(CONST.StorageKeys.ACTIVE_TIMER_INDEX);
    const newQueue = strQueue ? JSON.parse(strQueue) : [];
    const newTime = strTime ? JSON.parse(strTime) : 0;
    const newIndex = strActiveIndex ? JSON.parse(strActiveIndex) : -1;

    if (timersQueue.length === 0 && newQueue.length) {
      setTimersQueue(newQueue);
    }
    
    if (time === 0 && newTime !== 0) {
      setTime(newTime);
    }

    if (activeTimerIndex === -1 && newIndex !== -1) {
      setActiveTimerIndex(newIndex);
    }
  }, [timersQueue, time, activeTimerIndex]);

  // Timer logic for countdown and stopwatch
  useEffect(() => {
    let timer = setInterval(() => {
      if (running && activeTimerIndex !== -1) {
        // setTime(prevQueue => prevQueue + 1);
        setQueuePassedTime(time + 1);
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
            const completedTimersStr = localStorage.getItem(CONST.StorageKeys.COMPLETED_TIMERS);
            const completedTimers = completedTimersStr ? JSON.parse(completedTimersStr) : [];
            localStorage.setItem(CONST.StorageKeys.COMPLETED_TIMERS, JSON.stringify([...completedTimers, newQueue[activeTimerIndex]]));

            if (activeTimerIndex < timersQueue.length - 1) {
              const newIndex = activeTimerIndex + 1;
              setQueueActiveTimerIndex(newIndex);
              if (!running) setQueueRunning(true);
              newQueue[newIndex].status = CONST.TimerStatuses.PLAY;
            } else {
              if (running) setQueueRunning(false);
            }
          }
        }

        setTimersToQueue(newQueue);
      }
    }, 1000);

    return () => {
      if (timer) clearInterval(timer); // Clean up the timer
    };
  }, [time, running, activeTimerIndex, timersQueue]);

  // Start queue function now selects the first timer and starts it
  const startQueue = () => {
    if (timersQueue.length > 0) {
      setQueueActiveTimerIndex(0);
      setQueueRunning(true);
      setQueuePassedTime(0);

      let newTimersQueue = [...timersQueue];
      newTimersQueue[0] = { ...timersQueue[0], status: CONST.TimerStatuses.PLAY };
      setTimersToQueue(newTimersQueue);
    } else {
      setErrorMessage('No timers in the queue to start!');
    }
  };

  const stopQueue = () => {
    if (timersQueue.length > 0) {
      setQueueRunning(!running);
    } else {
      setErrorMessage('No timers in the queue to start!');
    }
  };

  const resetQueue = () => {
    setQueuePassedTime(0);
    setQueueRunning(false);
    setQueueActiveTimerIndex(-1);

    let newTimersQueue = [...timersQueue];
    newTimersQueue.forEach(timer => {
        timer.passedRound = 0;
        timer.passedTime = 0;
        timer.status = CONST.TimerStatuses.READY;
    });
    setTimersToQueue(newTimersQueue);
  };

  const forwardQueue = () => {
    let newTimersQueue = [...timersQueue];
    let currentQueue = timersQueue[activeTimerIndex];
    newTimersQueue[activeTimerIndex] = { 
      ...currentQueue, 
      passedRound: currentQueue.round,
      passedTime: currentQueue.restTime ? currentQueue.restTime : currentQueue.expectedTime,
      status: CONST.TimerStatuses.COMPLETE 
    };
    setTimersToQueue(newTimersQueue);

    const passedTime = newTimersQueue.reduce((total, timer) => 
      total + (timer.status === CONST.TimerStatuses.COMPLETE ? (timer.expectedTime + timer.restTime) * timer.round : 0),
    0);
    setQueuePassedTime(passedTime);

    if (activeTimerIndex < timersQueue.length - 1) {
      setQueueActiveTimerIndex(activeTimerIndex + 1);
    } else {
      if (running) setQueueRunning(false);
    }
  };

  const setTimersToQueue = (queue: Timer[], needLocalStorageChange: boolean = true) => {
    setTimersQueue(queue);
    if (needLocalStorageChange) {
      localStorage.setItem(CONST.StorageKeys.QUEUE, JSON.stringify(queue));
    }
  };

  const setQueueRunning = (running: boolean, needLocalStorageChange: boolean = true) => {
    setRunning(running);
    if (needLocalStorageChange) {
      localStorage.setItem(CONST.StorageKeys.RUNNING, JSON.stringify(running));
    }
  };

  const setQueueActiveTimerIndex = (index: number, needLocalStorageChange: boolean = true) => {
    setActiveTimerIndex(index);
    if (needLocalStorageChange) {
      localStorage.setItem(CONST.StorageKeys.ACTIVE_TIMER_INDEX, JSON.stringify(index));
    }
  };

  const setQueuePassedTime = (time: number, needLocalStorageChange: boolean = true) => {
    setTime(time);
    if (needLocalStorageChange) {
      localStorage.setItem(CONST.StorageKeys.TIME, JSON.stringify(time));
    }
  };

  // Function to save the values that are added
  const addTimerToQueue = (timer: Timer) => {
    // setTimersQueue(prevQueue => [...prevQueue, timer]);
    const newTimersQueue = [...timersQueue, timer];
    setTimersToQueue(newTimersQueue);
  };

  // Function to remove a timer from the Queue
  const removeTimerFromQueue = (index: number) => {
    const newTimersQueue = [...timersQueue];
    newTimersQueue.splice(index, 1);
    setTimersToQueue(newTimersQueue);
  };

  // Function to remove values from the Queue
  const removeLastTimerFromQueue = () => {
    // setTimersQueue(prevQueue => prevQueue.slice(0, prevQueue.length - 1));
    const newTimersQueue = [...timersQueue].slice(0, timersQueue.length - 1);
    setTimersToQueue(newTimersQueue);
  };

  // Function to remove all timers from the queue
  const removeAllTimersFromQueue = () => {
    setTimersToQueue([]);
    setQueuePassedTime(0);
    setQueueActiveTimerIndex(-1);
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        running,
        errorMessage,
        timersQueue,
        activeTimerIndex,
        addTimerToQueue,
        removeLastTimerFromQueue,
        removeAllTimersFromQueue,
        removeTimerFromQueue,
        startQueue,
        stopQueue,
        resetQueue,
        forwardQueue,
        setTimersToQueue,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
