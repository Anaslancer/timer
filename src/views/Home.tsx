import { useTimerContext } from '../utils/context';
import WorkoutDisplay from '../components/generic/WorkoutDisplay';
import styled from 'styled-components';

const StyledQueueContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
`;

/*
const TimersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60vh;
  background-color: #f5f5f5;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
`;


const TimerDisplay = styled.div`
  width: 340px;
  height: 340px;
  background-color: #e0e0e0;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;
*/
const Home = () => {
  const { time, isRunning, timersQueue, startQueue, stopQueue, resetQueue } = useTimerContext();

  // Calculate total time based on the timers in the queue
  const totalTimeInSeconds = timersQueue.reduce((total, timer) => total + (timer.expectedTime + timer.restTime) * timer.round, 0);

  return (
    <div>
      <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '12px'}}>
        <button onClick={startQueue} disabled={time > 0 || timersQueue.length === 0}>Start Queue</button>
        <button onClick={stopQueue} disabled={time === 0 || time === totalTimeInSeconds}>{isRunning ? 'Pause Queue' : 'Resume Queue'}</button>
        <button onClick={resetQueue} disabled={timersQueue.length === 0 || time === 0}>Reset Queue</button>
      </div>
      <div>Total Time: {totalTimeInSeconds} seconds</div>
      <div>Passed Time: {time} seconds</div>
      <div style={{ width: '90%', height: '12px', borderRadius: '6px', backgroundColor: '#e0e0e0', margin: 'auto', position: 'relative', marginTop: '12px' }}>
        <div style={{ 
          position: 'absolute', 
          height: '12px', 
          borderRadius: '6px', 
          backgroundColor: '#777777', 
          left: 0, 
          width: !totalTimeInSeconds ? 0 : `${time / totalTimeInSeconds * 100}%`, 
        }}></div>
      </div>
      <StyledQueueContainer>
        {
          timersQueue.map((timer, index) => (
            <div key={index}>
              <WorkoutDisplay 
                timer={timer}
                //isRunning={timer.isRunning}  // Optionally pass isRunning for each timer
              />
            </div>
          ))
        }
      </StyledQueueContainer>
    </div>
  );
};

export default Home;