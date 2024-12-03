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
    isRunning: boolean;
    errorMessage: string;
    timersQueue: Timer[];
    startQueue: () => void;
    stopQueue: () => void;
    resetQueue: () => void;
    handlePlayPause: () => void;
    setTimer: (minutes: number, seconds: number) => void;
    setIsRunning: (state: boolean) => void;
    addTimerToQueue: (timer: Timer) => void;
    removeLastTimerFromQueue: () => void;
    removeAllTimersFromQueue: () => void;
    setTimerDirect: (seconds: number) => void;
}

// Define the type for the TimerProvider props
interface TimerProviderProps {
    children: ReactNode;
}

const defaultContextValue: TimerContextType = {
    time: 0,
    isRunning: false,
    errorMessage: '',
    timersQueue: [],
    startQueue: () => {},
    stopQueue: () => {},
    resetQueue: () => {},
    handlePlayPause: () => {},
    setTimer: () => {},
    setIsRunning: () => {},
    addTimerToQueue: () => {},
    removeLastTimerFromQueue: () => {},
    removeAllTimersFromQueue: () => {},
    setTimerDirect: () => {},
};

const TimerContext = createContext<TimerContextType>(defaultContextValue);

export const useTimerContext = () => {
    const context = useContext(TimerContext);
    return context;
};

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
    const [timersQueue, setTimersQueue] = useState<Timer[]>([]);
    const [time, setTime] = useState(0); // Time remaining
    const [isRunning, setIsRunning] = useState(false); // Timer state (running or paused)
    const [errorMessage, setErrorMessage] = useState(''); // Error handling
    const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null); // Track the active timer

    // Timer logic for countdown and stopwatch
    useEffect(() => {
        let timer = setInterval(() => {
            if (isRunning && activeTimerIndex !== null) {
                setTime(prevQueue => prevQueue + 1);
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

                setTimersQueue(newQueue);
            }
        }, 1000);

        return () => {
            if (timer) clearInterval(timer); // Clean up the timer
        };
    }, [isRunning, activeTimerIndex, timersQueue]);

    // Start queue function now selects the first timer and starts it
    const startQueue = () => {
        if (timersQueue.length > 0) {
            setActiveTimerIndex(0);
            setIsRunning(true);
            setTime(0);

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

    const stopQueue = () => {
        if (timersQueue.length > 0) {
            setIsRunning(!isRunning);
        } else {
            setErrorMessage('No timers in the queue to start!');
        }
    };

    const resetQueue = () => {
        setTime(0);
        setIsRunning(false);

        let newTimersQueue = [...timersQueue];
        newTimersQueue.forEach(timer => {
            timer.passedRound = 0;
            timer.passedTime = 0;
            timer.status = CONST.TimerStatuses.READY;
        });
        setTimersQueue(newTimersQueue);
    };

    // Function to save the values that are added
    const addTimerToQueue = (timer: Timer) => {
        setTimersQueue(prevQueue => [...prevQueue, timer]);
    };

    // Function to remove values from the Queue
    const removeLastTimerFromQueue = () => {
        setTimersQueue(prevQueue => prevQueue.slice(0, prevQueue.length - 1));
    };

    // Function to remove all timers from the queue
    const removeAllTimersFromQueue = () => {
        setTimersQueue([]);
    };

    // Play or pause the timer
    const handlePlayPause = () => {
        if (time > 0) {
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

    const setTimerDirect = (seconds: number) => {
        setTime(seconds);
    };

    return (
        <TimerContext.Provider
            value={{
                time,
                isRunning,
                errorMessage,
                handlePlayPause,
                setTimer,
                timersQueue,
                addTimerToQueue,
                removeLastTimerFromQueue,
                removeAllTimersFromQueue,
                setIsRunning,
                startQueue,
                stopQueue,
                resetQueue,
                setTimerDirect,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};
