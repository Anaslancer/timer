import styled from 'styled-components';
import { useMemo } from 'react';
import {CSS} from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import { Timer } from '../../utils/context';
import CONST, { TimerStatusType } from '../../utils/CONST';

interface StyledWorkoutDisplayProps {
  status?: TimerStatusType;
  resting?: string;
  visibleDraggingCursor?: boolean;
}

const StyledWorkoutDisplay = styled.div<StyledWorkoutDisplayProps>`
  position: relative;
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
  // transition: background-color 0.3s ease, border-color 0.3s ease;
  cursor: ${({ visibleDraggingCursor, draggable }) => (visibleDraggingCursor ? "grabbing" : draggable ? "grab" : "default")};
  
  @media (max-width: 480px) {
    width: 120px;
    height: 80px;
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  opacity: ${(props) => props.disabled ? 0.6 : 1};
  position: absolute;
  right: 6px;
  top: 4px;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 2px;
  cursor: ${(props) => props.disabled ? 'normal' : 'pointer'};
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: normal;
  color: #666;
`;

interface WorkoutDisplayProps {
  transformable?: boolean,
  timer: Timer;
  running: boolean;
  index?: number;
  activeIndex?: number;
  visibleDraggingCursor?: boolean;
  removeTimer?: () => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ transformable, timer, running, index, activeIndex, removeTimer, visibleDraggingCursor }) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging
  } = useSortable({
    id: timer.id
  });

  const draggable = useMemo(() => !running && ((index ?? 0) > (activeIndex ?? 0)), [running, index, activeIndex]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
  };

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
    <div ref={setNodeRef} style={transformable ? style : {}}>
      {
        isDragging ? (
          <StyledWorkoutDisplay style={{opacity: 0.3}} />
        ) : (
          <div style={{position: 'relative'}}>
            <StyledWorkoutDisplay 
              status={timer.status} 
              resting={timer.isResting.toString()}
              visibleDraggingCursor={visibleDraggingCursor}
              draggable={draggable}
              {...draggable && {...attributes, ...listeners}}
            >
              <StyledName>{timer.mode}</StyledName>
              { displayTime() }
            </StyledWorkoutDisplay>
            <CloseButton 
              disabled={!draggable} 
              onClick={removeTimer}
              id="close-button"
            >
              X
            </CloseButton>
          </div>
        )
      }
    </div>
  );
};

export default WorkoutDisplay;
