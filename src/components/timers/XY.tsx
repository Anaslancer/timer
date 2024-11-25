import { useEffect, useState } from 'react';
import ActionButton from '../generic/ActionButton';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import Loading from '../generic/Loading';

//sets the states for variables that need to be followed
const XY = () => {
    const [time, setTime] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [repititions, setRepetitions] = useState(1);
    const [currentRepeat, setCurrentRepeat] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    //runs the countdown for every repetition provided. Checks if the repetitions have been completed with the if statement.
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && time > 0) {
            setIsCountingDown(true);
            timer = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime === 1) {
                        if (currentRepeat < repititions - 1) {
                            setCurrentRepeat(prev => prev + 1);
                            return minutes * 60 + seconds;
                        } else {
                            setIsRunning(false);
                            return 0;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
            setIsCountingDown(false);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, time, repititions, currentRepeat, minutes, seconds]);

    //toggles between play and pause button.
    const handlePlayPause = () => {
        if (!isRunning) {
            setCurrentRepeat(0);
            setTime(minutes * 60 + seconds);
        }
        setIsRunning(prev => !prev);
    };

    //resets the input to the original values provided.
    const handleReset = () => {
        setIsRunning(false);
        setCurrentRepeat(0);
        setTime(minutes * 60 + seconds);
    };

    //forwards the countdown to the end.
    const handleFastForward = () => {
        setIsRunning(false);
        setTime(0);
        setCurrentRepeat(0);
    };

    //Sets the minutes value from the input
    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        setMinutes(value);
        setTime(value * 60 + seconds);
    };

    //sets the seconds value from the input
    const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        value = value > 59 ? 59 : value;
        setSeconds(value);
        setTime(minutes * 60 + value);
    };

    //sets the repetition value from the input.
    const handleRepititionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
        setRepetitions(value);
        setCurrentRepeat(0);
        setTime(minutes * 60 + seconds);
    };

    //displays the XY timer.
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <DisplayWindow time={time} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <InputField value={minutes} onChange={handleMinuteChange} placeholder="Min:" min={0} disabled={isRunning} isRunning={isRunning} />
                <InputField value={seconds} onChange={handleSecondChange} placeholder="Sec:" min={0} max={59} disabled={isRunning} isRunning={isRunning} />
                <InputField value={repititions} onChange={handleRepititionsChange} placeholder="Reps:" min={1} disabled={isCountingDown} isRunning={isRunning} />
            </div>
            <Loading.ActivityButtonContainer>
                <ActionButton name={isRunning ? 'Pause' : 'Play'} key="PausePlay" onClick={handlePlayPause} />
                <ActionButton name="Reset" key="Reset" onClick={handleReset} />
                <ActionButton name="FastForward" key="FastForward" onClick={handleFastForward} />
            </Loading.ActivityButtonContainer>
        </div>
    );
};

export default XY;
