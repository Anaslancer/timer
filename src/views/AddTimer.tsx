import { useState } from 'react';
import styled from 'styled-components';

import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import { useTimerContext } from '../utils/context';





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

interface TimerButtonProps {
    isActive: boolean;
}

const TimerButton = styled.div<TimerButtonProps>`
  width: 80px;
  height: 80px;
  background-color: ${props => (props.isActive ? '#c0c0c0' : '#e0e0e0')};
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
  margin-bottom: 20px;
  flex-direction: row;
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

//Toggles between timer based on the button selected.
const TimersView = () => {
    const [activeTimer, setActiveTimer] = useState<string | null>(null);

    const timers = [
        { title: 'Stopwatch', C: <Stopwatch /> },
        { title: 'Countdown', C: <Countdown /> },
        { title: 'XY', C: <XY /> },
        { title: 'Tabata', C: <Tabata /> },
    ];

    const {timersQueue} = useTimerContext();
    
    return (
        <TimersContainer onClick={() => console.log('ani')}>
            <TimerDisplay>{timers.map(timer => (activeTimer === timer.title ? timer.C : null))}</TimerDisplay>
            <StopWatchButtonContainer>
                {timers.map(timer => (
                    <TimerButton
                        key={`timer-${timer.title}`}
                        isActive={activeTimer === timer.title}
                        onClick={e => {
                            e.stopPropagation();
                            setActiveTimer(timer.title);
                        }}
                    >
                        <TimerTitle>{timer.title}</TimerTitle>
                    </TimerButton>
                ))}
            </StopWatchButtonContainer>
            {/* Queue display */}
            <div>
                <h3>Timer Queue</h3>
                <ul>
                    {timersQueue.length === 0 ? (
                        <li>No timers in the queue</li>
                    ) : (
                        timersQueue.map((timer, index) => (
                            <li key={index}>
                                Time: {timer.time} seconds, Running: {timer.isRunning ? 'Yes' : 'No'}, Mode: {timer.mode}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </TimersContainer>
    );
};

export default TimersView;
