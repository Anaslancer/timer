
import ActionButton from '../generic/ActionButton';
import DisplayWindow from '../generic/DisplayWindow';
import Loading from '../generic/Loading';
import { useTimer } from '../../utils/helpers';


const Stopwatch = () => {
    
    const {
        time,
        isRunning,
        errorMessage,
        handlePlayPause,
        handleReset,
        handleFastForward, 
    } = useTimer('stopwatch');


        //returns the display window
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
            {errorMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    {errorMessage}
                </div>
            )}
            <Loading.ActivityButtonContainer>
                <ActionButton name={isRunning ? 'Pause' : 'Play'} key="PausePlay" onClick={handlePlayPause} />
                <ActionButton name="Reset" key="Reset" onClick={handleReset} />
                <ActionButton name="FastForward" key="FastForward" onClick={handleFastForward} />
            </Loading.ActivityButtonContainer>
        </div>
    );
};

export default Stopwatch;
