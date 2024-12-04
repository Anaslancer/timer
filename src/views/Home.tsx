import styled from 'styled-components';
import { useMemo, useState } from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import WorkoutDisplay from '../components/generic/WorkoutDisplay';
import { Timer, useTimerContext } from '../utils/context';
import CONST from '../utils/CONST';

const StyledQueueContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
`;

const defaultTimer: Timer = {
    id: "test",
    expectedTime: 0,
    restTime: 0,
    round: 0,
    passedTime: 0,
    passedRound: 0,
    isResting: false,
}

const Home = () => {
  const { time, running, changed, timersQueue, activeTimerIndex, startQueue, stopQueue, resetQueue, removeTimerFromQueue, setTimersToQueue } = useTimerContext();

  const [activeId, setActiveId] = useState<string | null>();

  const items = useMemo(() => timersQueue?.map(({ id }) => id), [timersQueue]);

  const selectedTimer = useMemo(() => {
    if (!activeId) {
      return null;
    }
    return timersQueue.find(({ id }) => id === activeId);
  }, [activeId, timersQueue]);
  
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over?.id as string);
      if (timersQueue[newIndex].status === CONST.TimerStatuses.READY) {
        setTimersToQueue(arrayMove(timersQueue, oldIndex, newIndex));
      }
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  // Calculate total time based on the timers in the queue
  const totalTimeInSeconds = timersQueue.reduce((total, timer) => total + (timer.expectedTime + timer.restTime) * timer.round, 0);

  // Save a timer queue to local storage
  const saveQueue = () => {
    localStorage.setItem(CONST.StorageKeys.QUEUE, JSON.stringify(timersQueue));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '12px' }}>
        <button onClick={startQueue} disabled={time > 0 || timersQueue.length === 0}>
          Start Queue
        </button>
        <button onClick={stopQueue} disabled={time === 0 || time === totalTimeInSeconds}>
          {running ? 'Pause Queue' : 'Resume Queue'}
        </button>
        <button onClick={resetQueue} disabled={timersQueue.length === 0 || time === 0}>
          Reset Queue
        </button>
        <button onClick={saveQueue} disabled={!changed}>
          Save Queue
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
            maxWidth: '100%',
            width: !totalTimeInSeconds ? 0 : `${(time / totalTimeInSeconds) * 100}%`,
          }}
        />
      </div>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
      >
        <StyledQueueContainer>
          <SortableContext items={items}>
            {timersQueue.map((timer, index) => (
              <WorkoutDisplay 
                transformable={activeId ? true : false}
                timer={timer} 
                running={running} 
                index={index} 
                key={index}
                activeIndex={activeTimerIndex} 
                removeTimer={() => removeTimerFromQueue(index)}
              />
            ))}
          </SortableContext>
        </StyledQueueContainer>
        <DragOverlay>
          {activeId != null && (
            <WorkoutDisplay 
                timer={selectedTimer || defaultTimer} 
                running={running} 
                visibleDraggingCursor={true}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Home;
