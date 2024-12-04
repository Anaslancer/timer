import { useEffect, useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import Loading from '../generic/Loading';
import InputFieldsContainer from '../generic/InputFieldsContainer';
import TimerContainer from '../generic/TimerContainer';
import InputField from '../generic/Input';
import { Timer, useTimerContext } from '../../utils/context';
import CONST from '../../utils/CONST';
import { TimerComponentProps } from './Countdown';

const Stopwatch: React.FC<TimerComponentProps> = ({ timer, close }) => {
    const { timersQueue, addTimerToQueue, setTimersToQueue } = useTimerContext();
    
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!timer) return;

        const {description} = timer;

        if (description) setDescription(description);
    }, [timer]);

    const addTimer = () => {
        const timer: Timer = {
            id: new Date().valueOf().toString(),
            mode: CONST.TimerTypes.STOPWATCH,
            expectedTime: 60,
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
            <DisplayWindow time={60} />
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
