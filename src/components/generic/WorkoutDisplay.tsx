import styled from 'styled-components';
import { Timer } from '../../utils/context';
import CONST, { TimerStatusType } from '../../utils/CONST';

interface StyledWorkoutDisplayProps {
  status: TimerStatusType;
  resting: string;
}

const StyledWorkoutDisplay = styled.div<StyledWorkoutDisplayProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 100px;
  gap: 10px;
  border-radius: 20px;
  background-color: 
    ${({ status, resting }) => 
      (status === CONST.TimerStatuses.COMPLETE ? 
        '#28A745' : 
        status === CONST.TimerStatuses.PLAY ? resting === 'true' ? '#FFC107' : '#007BFF' : status === CONST.TimerStatuses.PAUSE ? '#6C757D' : '#e0e0e0')};
  border: 2px solid #ccc;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @media (max-width: 480px) {
    width: 120px;
    height: 80px;
    font-size: 1.2rem;
  }
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: normal;
  color: #666;
`;

interface WorkoutDisplayProps {
  timer: Timer;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ timer }) => {
  const displayTime = () => {
    if (timer.status === CONST.TimerStatuses.COMPLETE) {
      return timer.mode === CONST.TimerTypes.STOPWATCH ? '1:00' : '0:00';
    }

    if (timer.mode === CONST.TimerTypes.STOPWATCH) {
      return `${Math.floor(timer.passedTime / 60)}:${String(timer.passedTime % 60).padStart(2, '0')}`;
    } else if (timer.mode === CONST.TimerTypes.COUNTDOWN || timer.mode === CONST.TimerTypes.XY) {
      return `${Math.floor((timer.expectedTime - timer.passedTime) / 60)}:${String((timer.expectedTime - timer.passedTime) % 60).padStart(2, '0')}`;
    } else if (timer.mode === CONST.TimerTypes.TABATA) {
      const expectedTime = timer.isResting ? timer.restTime ?? 0 : timer.expectedTime;
      return `${Math.floor((expectedTime - timer.passedTime) / 60)}:${String((expectedTime - timer.passedTime) % 60).padStart(2, '0')}`;
    }
    
    return 'Time is Up!'
  }

  return (
    <StyledWorkoutDisplay status={timer.status} resting={timer.isResting.toString()}>
      <StyledName>{timer.mode}</StyledName>
      { displayTime() }
    </StyledWorkoutDisplay>
  );
};

export default WorkoutDisplay;
