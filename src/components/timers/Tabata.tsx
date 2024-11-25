import { useEffect, useState } from 'react';
import ActionButton from '../generic/ActionButton';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import Loading from '../generic/Loading';

//Manages state
const Tabata = () => {
    const [time, setTime] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [repititions, setRepetitions] = useState(1);
    const [currentRepeat, setCurrentRepeat] = useState(0);
    const [restMinutes, setRestMinutes] = useState(0);
    const [restSeconds, setRestSeconds] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        //the if function is toggling between rest and work time for the repetition set
        if (isRunning && time > 0) {
            setIsCountingDown(true);
            timer = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime === 1) {
                        if (isResting) {
                            if (currentRepeat < repititions - 1) {
                                setIsResting(false);
                                setCurrentRepeat(prev => prev + 1);
                                return minutes * 60 + seconds;
                            } else {
                                setIsRunning(false);
                                setIsCountingDown(false);
                                return 0;
                            }
                        } else {
                            setIsResting(true);
                            return restMinutes * 60 + restSeconds;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (time === 0) {
            setIsCountingDown(false);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, time, repititions, currentRepeat, minutes, seconds]);

    //the play and the pause is toggled between. Set an Error Message if no input is provided.
    const handlePlayPause = () => {
        if (!isRunning) {
            if (minutes > 0 || seconds > 0) {
                setCurrentRepeat(0);
                setIsResting(false);
                setTime(minutes * 60 + seconds);
            } else {
                setErrorMessage('Please set a valid time!');
                return;
            }
        }
        setIsRunning(prev => !prev);
    };

    //resets the value to the original value provided and deletes the error message
    const handleReset = () => {
        setIsRunning(false);
        setCurrentRepeat(0);
        setIsResting(false);
        setTime(minutes * 60 + seconds);
        setErrorMessage('');
    };

    //Fast Forwards the tabata to the end
    const handleFastForward = () => {
        setIsRunning(false);
        setTime(0);
        setCurrentRepeat(0);
        setIsResting(false);
    };

    //The minute change sets time to the seconds value after multiplying
    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        setMinutes(value);
        setTime(value * 60 + seconds);
    };

    //sets the seconds value to the set time.
    const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        value = value > 59 ? 59 : value;
        setSeconds(value);
        setTime(minutes * 60 + value);
    };

    //sets the repetition value.
    const handleRepititionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
        setRepetitions(value);
        setCurrentRepeat(0);
        setTime(minutes * 60 + seconds);
    };

    //returns the display
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
            {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <InputField value={minutes} onChange={handleMinuteChange} placeholder="Min:" min={0} disabled={isRunning} isRunning={isRunning} />
                <InputField value={seconds} onChange={handleSecondChange} placeholder="Sec:" min={0} max={59} disabled={isRunning} isRunning={isRunning} />
                <InputField value={repititions} onChange={handleRepititionsChange} placeholder="Reps:" min={1} disabled={isCountingDown} isRunning={isRunning} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <InputField
                    value={restMinutes}
                    onChange={e => setRestMinutes(Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
                    placeholder="Rest Min:"
                    min={1}
                    disabled={isCountingDown}
                    isRunning={isRunning}
                />
                <InputField
                    value={restSeconds}
                    onChange={e => {
                        const value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
                        setRestSeconds(value > 59 ? 59 : value);
                    }}
                    placeholder="Rest Sec:"
                    min={0}
                    max={59}
                    disabled={isCountingDown}
                    isRunning={isRunning}
                />
            </div>
            <Loading.ActivityButtonContainer>
                <ActionButton name={isRunning ? 'Pause' : 'Play'} key="PausePlay" onClick={handlePlayPause} />
                <ActionButton name="Reset" key="Reset" onClick={handleReset} />
                <ActionButton name="FastForward" key="FastForward" onClick={handleFastForward} />
            </Loading.ActivityButtonContainer>
        </div>
    );
};

export default Tabata;
