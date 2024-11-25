import styled from 'styled-components';

const StyledWorkoutDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 100px;
  gap: 10px;
  border-radius: 20px;
  background-color: #e0e0e0;
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

  &:hover {
    background-color: #d0d0d0;
    border-color: #999;
  }
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: normal;
  color: #666;
`;

interface WorkoutDisplayProps {
  time: number;
  name: string; // Add a name prop
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ time, name }) => {
  const displayTime =
    time > 0
      ? `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`
      : 'Time is Up!';

  return (
    <StyledWorkoutDisplay>
      <StyledName>{name}</StyledName> {/* Render the name */}
      {time === 0 ? '0.00' : displayTime}
    </StyledWorkoutDisplay>
  );
};

export default WorkoutDisplay;
