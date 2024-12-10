import styled from 'styled-components';
import {CSS} from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import { Timer } from '../../utils/context';
import CONST, { TimerStatusType } from '../../utils/CONST';
import { formattedTimeString } from '../../utils/helpers';

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
  justify-content: space-between;
  padding: 16px 8px;
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

const IconButton = styled.button`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  opacity: ${(props) => props.disabled ? 0.6 : 1};
  position: absolute;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 2px;
  cursor: ${(props) => props.disabled ? 'normal' : 'pointer'};
`;

const CloseButton = styled(IconButton)`
  left: 8px;
  top: 4px;
`;

const EditButton = styled(IconButton)`
  right: 8px;
  top: 4px;
  transform: scaleX(-1);
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: semi-bold;
  color: #666;
`;

const StyledDescription = styled.div`
  font-size: 0.8rem;
  font-weight: normal;
  color: #777;
`;

interface WorkoutDisplayProps {
  transformable?: boolean,
  timer: Timer;
  running?: boolean;
  index?: number;
  activeIndex?: number;
  visibleDraggingCursor?: boolean;
  removeTimer?: () => void;
  editTimer?: () => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ 
  transformable, 
  timer, 
  running = false, 
  index, 
  activeIndex, 
  visibleDraggingCursor,
  removeTimer, 
  editTimer,
}) => {
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

  const draggable = !running && ((index ?? 0) > (activeIndex ?? 0));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
  };

  const displayTime = () => {
    const { status, mode, expectedTime, restTime, passedTime, isResting } = timer;

    if (status === CONST.TimerStatuses.COMPLETE) {
      return mode === CONST.TimerTypes.STOPWATCH ? formattedTimeString(expectedTime) : '0:00';
    } else if (mode === CONST.TimerTypes.STOPWATCH) {
      return formattedTimeString(passedTime);
    } else if (mode === CONST.TimerTypes.COUNTDOWN || mode === CONST.TimerTypes.XY) {
      return formattedTimeString(expectedTime - passedTime);
    } else if (mode === CONST.TimerTypes.TABATA) {
      const newExpectedTime = isResting ? restTime ?? 0 : expectedTime;
      return formattedTimeString(newExpectedTime - passedTime);
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
              { timer.description && <StyledDescription>{timer.description}</StyledDescription> }
              { displayTime() }
            </StyledWorkoutDisplay>
            <CloseButton title="Remove" disabled={!draggable} onClick={removeTimer}>&#128465;</CloseButton>
            <EditButton title="Edit" disabled={!draggable} onClick={editTimer}>&#9998;</EditButton>
          </div>
        )
      }
    </div>
  );
};

export default WorkoutDisplay;
