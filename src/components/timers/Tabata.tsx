import { useEffect, useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import InputFieldsContainer from '../generic/InputFieldsContainer';
import TimerContainer from '../generic/TimerContainer';
import { Timer, useTimerContext } from '../../utils/context';
import { secToMin, timeToSec } from '../../utils/helpers';
import CONST from '../../utils/CONST';
import { TimerComponentProps } from './Countdown';

//Manages state
const Tabata: React.FC<TimerComponentProps> = ({ timer, close }) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [repititions, setRepetitions] = useState(1);
    const [restMinutes, setRestMinutes] = useState(0);
    const [restSeconds, setRestSeconds] = useState(0);
    const [description, setDescription] = useState('');

    const { timersQueue, addTimerToQueue, setTimersToQueue } = useTimerContext();

    useEffect(() => {
        if (!timer) return;

        const {expectedTime, restTime, round, description} = timer;

        if (expectedTime) {
            const {min, sec} = secToMin(expectedTime);
            setMinutes(min);
            setSeconds(sec);
        }

        if (restTime) {
            const {min, sec} = secToMin(restTime);
            setRestMinutes(min);
            setRestSeconds(sec);
        }

        if (round) setRepetitions(round);

        if (description) setDescription(description);
    }, [timer]);

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
            id: new Date().valueOf().toString(),
            mode: CONST.TimerTypes.TABATA,
            expectedTime: activeTime,
            status: CONST.TimerStatuses.READY,
            round: repititions,
            restTime: timeToSec(restMinutes, restSeconds),
            passedTime: 0,
            passedRound: 0,
            isResting: false,
            description,
        }

        addTimerToQueue(timer);
    }

    const saveTimer = () => {
        const activeTime = timeToSec(minutes, seconds);
        const restTime = timeToSec(restMinutes, restSeconds);

        if (!activeTime || !timer) return;

        const newTimer: Timer = {
            ...timer,
            expectedTime: activeTime,
            round: repititions,
            restTime,
            description: description,
        }

        const newTimersQueue = [...timersQueue];
        const index = timersQueue.findIndex((t) => t.id === timer.id);
        newTimersQueue[index] = newTimer;

        setTimersToQueue(newTimersQueue);
        if (close) close();
    }

    return (
        <TimerContainer>
            <DisplayWindow time={timeToSec(minutes, seconds)} />
            <InputFieldsContainer>
                <InputField value={minutes} onChange={handleMinuteChange} placeholder="Min:" min={0} />
                <InputField value={seconds} onChange={handleSecondChange} placeholder="Sec:" min={0} max={59} />
                <InputField value={repititions} onChange={handleRepititionsChange} placeholder="Reps:" min={1} />
            </InputFieldsContainer>
            <InputFieldsContainer>
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
            </InputFieldsContainer>
            <InputFieldsContainer>
                <InputField 
                    value={description} 
                    onChange={(e:any) => setDescription(e.target.value)} 
                    placeholder="Description:" 
                    inputStyle={{ width: '180px' }}
                    type="text"
                />
            </InputFieldsContainer>
            <button onClick={timer ? saveTimer : addTimer}>{timer ? "Save" : "Add Timer"}</button>
        </TimerContainer>
    );
};

export default Tabata;
