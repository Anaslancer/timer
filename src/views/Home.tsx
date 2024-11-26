
//import styled from 'styled-components';
//import Countdown from '../components/timers/Countdown';
import { useTimerContext } from '../utils/context';
import WorkoutDisplay from '../components/generic/WorkoutDisplay';

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
  const { time, isRunning, timersQueue, startQueue } = useTimerContext();

  // Calculate total time based on the timers in the queue
  const totalTimeInSeconds = timersQueue.reduce((total, timer) => total + timer.expectedTime, 0);

  return (
    <div>
      <button onClick={startQueue}>{isRunning ? 'Stop Queue' : 'Start Queue'}</button>
      <div>Time: {totalTimeInSeconds} seconds</div>
      <div>
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
      </div>
    </div>
  );
};

export default Home;