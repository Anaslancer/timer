import { useEffect, useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import InputFieldsContainer from '../generic/InputFieldsContainer';
import TimerContainer from '../generic/TimerContainer';
import { Timer, useTimerContext } from '../../utils/context';
import { TimerComponentProps } from './Countdown';
import CONST from '../../utils/CONST';
import { secToMin, strTo10Digits, timeToSec } from '../../utils/helpers';

//sets the states for variables that need to be followed
const XY: React.FC<TimerComponentProps> = ({ timer, close }) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [repititions, setRepetitions] = useState(1);
    const [description, setDescription] = useState('');

    const { running, timersQueue, addTimerToQueue, setTimersToQueue } = useTimerContext();

    useEffect(() => {
        if (!timer) return;

        const {expectedTime, round, description} = timer;

        if (expectedTime) {
            const {min, sec} = secToMin(expectedTime);
            setMinutes(min);
            setSeconds(sec);
        }

        if (round) setRepetitions(round);

        if (description) setDescription(description);
    }, [timer]);

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(strTo10Digits(e.target.value));
    };

    const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seconds = strTo10Digits(e.target.value);
        setSeconds(seconds > 59 ? 59 : seconds);
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
            id: new Date().valueOf().toString(),
            mode: CONST.TimerTypes.XY,
            expectedTime: activeTime,
            status: CONST.TimerStatuses.READY,
            round: repititions,
            passedTime: 0,
            passedRound: 0,
            restTime: 0,
            isResting: false,
            description,
        }

        addTimerToQueue(timer);
    }

    const saveTimer = () => {
        const activeTime = timeToSec(minutes, seconds);

        if (!activeTime || !timer) return;

        const newTimer: Timer = {
            ...timer,
            expectedTime: activeTime,
            round: repititions,
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
            <button onClick={timer ? saveTimer : addTimer} disabled={running}>{timer ? "Save" : "Add Timer"}</button>
        </TimerContainer>
    );
};

export default XY;
