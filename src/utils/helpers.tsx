// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

import { useState, useEffect } from 'react';

export const useTimer = (mode: String) => {
    const [time, setTime] = useState(0); // Time remaining
    const [isRunning, setIsRunning] = useState(false); // Timer state (running or paused)
    const [errorMessage, setErrorMessage] = useState(''); // Error handling
  
     // Timer logic for countdown and stopwatch
     useEffect(() => {
        let timer: number | undefined;

        if (isRunning) {
            if (mode === 'countdown' && time > 0) {
                // Countdown mode: Decrement the time
                timer = window.setInterval(() => {
                    setTime(prevTime => {
                        if (prevTime <= 1) {
                            setIsRunning(false); // Stop the countdown timer when it reaches 0
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }, 1000);
            } else if (mode === 'stopwatch') {
                // Stopwatch mode: Increment the time
                timer = window.setInterval(() => {
                    setTime(prevTime => prevTime + 1);
                }, 1000);
            }
        }

        return () => {
            if (timer) clearInterval(timer); // Clean up the timer
        };
    }, [isRunning, time, mode]);

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

    // Unified fast forward function (works for both modes)
    const handleFastForward = () => {
        if (mode === 'countdown') {
            setTime(0); // Set time to 0 for countdown mode
        } else if (mode === 'stopwatch') {
            setTime(300); // Set time to 5 minutes (300 seconds) for stopwatch mode
        }
        setIsRunning(false); // Stop the timer after fast forwarding
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

    return {
        time,
        isRunning,
        errorMessage,
        mode,
        handlePlayPause,
        handleReset,
        handleFastForward,
        setTimer,
    };
};
