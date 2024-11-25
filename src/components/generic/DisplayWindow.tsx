import styled from 'styled-components';

const StyledDisplayWindow = styled.div`
  width: 160px;
  height: 80px;
  gap: 100px;
  border-radius: 20px;
  background-color: #e0e0e0;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @media (max-width: 480px ){
    width: 120px;
    height: 60px;
    font-size: 1.2rem;
  }

  &:hover {
    background-color: #d0d0d0;
    border-color: #999;
  }
`;

const DisplayWindow: React.FC<{ time: number }> = ({ time }) => {
    const displayTime = time > 0 ? `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}` : 'Time is Up!';

    return <StyledDisplayWindow>{time === 0 ? '0.00' : displayTime}</StyledDisplayWindow>;
};

export default DisplayWindow;
