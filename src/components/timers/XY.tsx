import { useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import { Timer, useTimerContext } from '../../utils/context';
import CONST from '../../utils/CONST';
import { timeToSec } from '../../utils/helpers';

//sets the states for variables that need to be followed
const XY = () => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [repititions, setRepetitions] = useState(1);

    const { addTimerToQueue: addCurrentTimerToQueue } = useTimerContext();

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        setMinutes(value);
    };

    const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        value = value > 59 ? 59 : value;
        setSeconds(value);
    };

    //sets the repetition value from the input.
    const handleRepititionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
        setRepetitions(value);
    };

    const addTimer = () => {
        const activeTime = timeToSec(minutes, seconds);
        
        if (!activeTime) return;

        const timer: Timer = {
            mode: CONST.TimerTypes.XY,
            expectedTime: activeTime,
            status: CONST.TimerStatuses.READY,
            round: repititions,
            passedTime: 0,
            passedRound: 0,
            restTime: 0,
            isResting: false,
        }

        addCurrentTimerToQueue(timer);
    }

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
            <DisplayWindow time={timeToSec(minutes, seconds)} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <InputField 
                    value={minutes} 
                    onChange={handleMinuteChange} 
                    placeholder="Min:" 
                    min={0} 
                />
                <InputField 
                    value={seconds} 
                    onChange={handleSecondChange} 
                    placeholder="Sec:" 
                    min={0} 
                    max={59} 
                />
                <InputField 
                    value={repititions} 
                    onChange={handleRepititionsChange} 
                    placeholder="Reps:" 
                    min={1} 
                />
            </div>
            <button onClick={addTimer}>Add Timer</button>
        </div>
    );
};

export default XY;
