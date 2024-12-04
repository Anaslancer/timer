import { useState } from 'react';
import DisplayWindow from '../generic/DisplayWindow';
import Loading from '../generic/Loading';
import InputFieldsContainer from '../generic/InputFieldsContainer';
import InputField from '../generic/Input';
import { Timer, useTimerContext } from '../../utils/context';
import CONST from '../../utils/CONST';

const Stopwatch = () => {
    const { addTimerToQueue: addCurrentTimerToQueue } = useTimerContext();
    
    const [description, setDescription] = useState('');

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
        addCurrentTimerToQueue(timer);
    }

    // returns the display window
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
                <button onClick = {addTimer}>Add Timer</button>
            </Loading.ActivityButtonContainer>
        </div>
    );
};

export default Stopwatch;
