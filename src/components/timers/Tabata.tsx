import { useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import { Timer, useTimerContext } from '../../utils/context';
import { timeToSec } from '../../utils/helpers';
import CONST from '../../utils/CONST';

//Manages state
const Tabata = () => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [repititions, setRepetitions] = useState(1);
    const [restMinutes, setRestMinutes] = useState(0);
    const [restSeconds, setRestSeconds] = useState(0);

    const { addTimerToQueue: addCurrentTimerToQueue } = useTimerContext();

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        setMinutes(value);
    };

    //sets the seconds value to the set time.
    const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        value = value > 59 ? 59 : value;
        setSeconds(value);
    };

    //sets the repetition value.
    const handleRepititionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
        setRepetitions(value);
    };

    const addTimer = () => {
        const activeTime = timeToSec(minutes, seconds);
        
        if (!activeTime) return;

        const timer: Timer = {
            mode: CONST.TimerTypes.TABATA,
            expectedTime: activeTime,
            status: CONST.TimerStatuses.READY,
            round: repititions,
            restTime: timeToSec(restMinutes, restSeconds),
            passedTime: 0,
            passedRound: 0,
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
                <InputField value={minutes} onChange={handleMinuteChange} placeholder="Min:" min={0} />
                <InputField value={seconds} onChange={handleSecondChange} placeholder="Sec:" min={0} max={59} />
                <InputField value={repititions} onChange={handleRepititionsChange} placeholder="Reps:" min={1} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <InputField
                    value={restMinutes}
                    onChange={e => setRestMinutes(Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
                    placeholder="Rest Min:"
                    min={1}
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
                />
            </div>
            <button onClick={addTimer}>Add Timer</button>
        </div>
    );
};

export default Tabata;
