import { useState } from 'react';
import styled from 'styled-components';
import { StyledQueueContainer } from './Home';
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import WorkoutDisplay from '../components/generic/WorkoutDisplay';
import TimerEditModal from '../components/modals/TimerEditModal';
import { useTimerContext } from '../utils/context';

const PageContainer = styled.div`
  gap: 20px;
  width: 100%;
`;

const TimersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  gap: 20px;
  width: fit-content;
  padding: 0 60px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

interface TimerButtonProps {
    active: string;
}

const TimerButton = styled.div<TimerButtonProps>`
  width: 80px;
  height: 80px;
  background-color: ${(props) => (props.active === 'true' ? '#c0c0c0' : '#e0e0e0')};
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #d0d0d0;
    transform: scale(1.05);
  }
  &:active {
    background-color: #c0c0c0;
  }
`;

const TimerTitle = styled.div`
  text-align: center;
`;

const StopWatchButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const TimerDisplay = styled.div`
  width: 340px;
  height: 340px !important;
  background-color: #e0e0e0;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

//Toggles between timer based on the button selected.
const TimersView = () => {
    const [activeTimer, setActiveTimer] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTimerIndexForEditing, setTimerIndexForEditing] = useState(-1);
  
    const { timersQueue, activeTimerIndex, removeLastTimerFromQueue, removeAllTimersFromQueue, removeTimerFromQueue } = useTimerContext();

    const timers = [
        { title: 'Stopwatch', C: <Stopwatch key='stopwatch' /> },
        { title: 'Countdown', C: <Countdown key='countdown' /> },
        { title: 'XY', C: <XY key='xy' /> },
        { title: 'Tabata', C: <Tabata key='tabata' /> },
    ];

    const openModal = (index: number) => {
        setModalOpen(true);
        setTimerIndexForEditing(index);
      }
    
    return (
        <PageContainer>
            <TimersContainer>
                <TimerDisplay>{timers.map(timer => (activeTimer === timer.title ? timer.C : null))}</TimerDisplay>
                <StopWatchButtonContainer>
                    {
                        timers.map(timer => (
                            <TimerButton
                                key={`timer-${timer.title}`}
                                active={(activeTimer === timer.title).toString()}
                                onClick={e => {
                                    e.stopPropagation();
                                    setActiveTimer(timer.title);
                                }}
                            >
                                <TimerTitle>{timer.title}</TimerTitle>
                            </TimerButton>
                        ))
                    }
                </StopWatchButtonContainer>
                {/* Queue display */}
            </TimersContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', marginBottom: '12px' }}>
                <h3 style={{marginBottom: '0', marginTop: '1rem'}}>Timer Queue</h3>
                <StopWatchButtonContainer>
                    <button onClick={removeLastTimerFromQueue}>Remove Last Timer</button>
                    <button onClick={removeAllTimersFromQueue}>Remove All Timers</button>
                </StopWatchButtonContainer>
                <StyledQueueContainer>
                    {timersQueue.map((timer, index) => (
                        <WorkoutDisplay 
                            transformable={true}
                            timer={timer} 
                            index={index} 
                            activeIndex={activeTimerIndex}
                            key={index}
                            removeTimer={() => removeTimerFromQueue(index)}
                            editTimer={() => openModal(index)}
                        />
                    ))}
                </StyledQueueContainer>
            </div>
            <TimerEditModal 
                isOpen={isModalOpen} 
                timer={timersQueue[selectedTimerIndexForEditing]} 
                onClose={() => setModalOpen(false)} 
            />
        </PageContainer>
    );
};

export default TimersView;
