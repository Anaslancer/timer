import { useEffect, useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import Loading from '../generic/Loading';
import InputFieldsContainer from '../generic/InputFieldsContainer';
import TimerContainer from '../generic/TimerContainer';
import InputField from '../generic/Input';
import { Timer, useTimerContext } from '../../utils/context';
import CONST from '../../utils/CONST';
import { TimerComponentProps } from './Countdown';
import { secToMin, timeToSec } from '../../utils/helpers';

const Stopwatch: React.FC<TimerComponentProps> = ({ timer, close }) => {
    const { timersQueue, addTimerToQueue, setTimersToQueue } = useTimerContext();
    
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!timer) return;

        const { description, expectedTime } = timer;

        if (expectedTime) {
            const {min, sec} = secToMin(expectedTime);
            setMin(min);
            setSec(sec);
        }

        if (description) setDescription(description);
    }, [timer]);

    // Handle minute change
    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        setMin(value);
    };

    // Handle second change (restricting to 0-59)
    const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Math.max(0, Number.parseInt(e.target.value, 10) || 0);
        value = value > 59 ? 59 : value;
        setSec(value);
    };

    const addTimer = () => {
        const activeTime = timeToSec(min, sec);

        if (!activeTime) return;

        const timer: Timer = {
            id: new Date().valueOf().toString(),
            mode: CONST.TimerTypes.STOPWATCH,
            expectedTime: activeTime,
            status: CONST.TimerStatuses.READY,
            passedTime: 0,
            round: 1,
            passedRound: 0,
            restTime: 0,
            isResting: false,
            description,
        }
        addTimerToQueue(timer);
    }

    const saveTimer = () => {
        if (!timer) return;

        const newTimer: Timer = {
            ...timer,
            description: description,
        }

        const newTimersQueue = [...timersQueue];
        const index = timersQueue.findIndex((t) => t.id === timer.id);
        newTimersQueue[index] = newTimer;

        setTimersToQueue(newTimersQueue);
        if (close) close();
    }

    // returns the display window
    return (
        <TimerContainer>
            <DisplayWindow time={timeToSec(min, sec)} />
            <InputFieldsContainer>
                <InputField 
                    value={min} 
                    onChange={handleMinuteChange}
                    placeholder="Min:" 
                    min={0} 
                />
                <InputField 
                    value={sec} 
                    onChange={handleSecondChange} 
                    placeholder="Sec:" 
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
            <Loading.ActivityButtonContainer>
                <button onClick={timer ? saveTimer : addTimer}>{timer ? "Save" : "Add Timer"}</button>
            </Loading.ActivityButtonContainer>
        </TimerContainer>
    );
};

export default Stopwatch;
