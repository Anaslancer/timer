import styled from 'styled-components';
import WorkoutDisplay from '../components/generic/WorkoutDisplay';
import { useTimerContext } from '../utils/context';

const StyledQueueContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
`;

const Home = () => {
    const { time, isRunning, timersQueue, startQueue, stopQueue, resetQueue } = useTimerContext();

    // Calculate total time based on the timers in the queue
    const totalTimeInSeconds = timersQueue.reduce((total, timer) => total + (timer.expectedTime + timer.restTime) * timer.round, 0);

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '12px' }}>
                <button onClick={startQueue} disabled={time > 0 || timersQueue.length === 0}>
                    Start Queue
                </button>
                <button onClick={stopQueue} disabled={time === 0 || time === totalTimeInSeconds}>
                    {isRunning ? 'Pause Queue' : 'Resume Queue'}
                </button>
                <button onClick={resetQueue} disabled={timersQueue.length === 0 || time === 0}>
                    Reset Queue
                </button>
            </div>
            <div>Total Time: {totalTimeInSeconds} seconds</div>
            <div>Passed Time: {time} seconds</div>
            <div style={{ width: '90%', height: '12px', borderRadius: '6px', backgroundColor: '#e0e0e0', margin: 'auto', position: 'relative', marginTop: '12px' }}>
                <div
                    style={{
                        position: 'absolute',
                        height: '12px',
                        borderRadius: '6px',
                        backgroundColor: '#777777',
                        left: 0,
                        width: !totalTimeInSeconds ? 0 : `${(time / totalTimeInSeconds) * 100}%`,
                    }}
                />
            </div>
            <StyledQueueContainer>
                {timersQueue.map((timer, index) => (
                    <div key={index}>
                        <WorkoutDisplay timer={timer} />
                    </div>
                ))}
            </StyledQueueContainer>
        </div>
    );
};

export default Home;
