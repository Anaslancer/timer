import { useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import InputField from '../generic/Input';
import InputFieldsContainer from '../generic/InputFieldsContainer';
import { Timer, useTimerContext } from '../../utils/context';
import CONST from '../../utils/CONST';
import { timeToSec } from '../../utils/helpers';

const Countdown = () => {
    const { addTimerToQueue: addCurrentTimerToQueue } = useTimerContext();

    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [description, setDescription] = useState('');

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

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const addTimer = () => {
        const activeTime = timeToSec(min, sec);
        
        if (!activeTime) return;

        const timer: Timer = {
            id: new Date().valueOf().toString(),
            mode: CONST.TimerTypes.COUNTDOWN,
            expectedTime: activeTime,
            status: CONST.TimerStatuses.READY,
            passedTime: 0,
            round: 1,
            passedRound: 0,
            restTime: 0,
            isResting: false,
            description,
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
            <DisplayWindow time={timeToSec(min, sec)} />
            <InputFieldsContainer>
                <InputField 
                    value = {min} 
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
                    onChange={handleDescriptionChange} 
                    placeholder="Description:" 
                    inputStyle={{ width: '180px' }}
                    type="text"
                />
            </InputFieldsContainer>
            <button onClick={addTimer}>Add Timer</button>
        </div>
    );
};

export default Countdown;