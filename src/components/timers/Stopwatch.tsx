
import DisplayWindow from '../generic/DisplayWindow';
import Loading from '../generic/Loading';
import { Timer, useTimerContext } from '../../utils/context';
import CONST from '../../utils/CONST';

const Stopwatch = () => {
    const { addTimerToQueue: addCurrentTimerToQueue } = useTimerContext();

    const addTimer = () => {
        const timer: Timer = {
            mode: CONST.TimerTypes.STOPWATCH,
            expectedTime: 60,
            status: CONST.TimerStatuses.READY,
            passedTime: 0,
            round: 1,
            passedRound: 0,
            restTime: 0,
            isResting: false,
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
            <Loading.ActivityButtonContainer>
                <button onClick = {addTimer}>Add Timer</button>
            </Loading.ActivityButtonContainer>
        </div>
    );
};

export default Stopwatch;
