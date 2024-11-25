import styled from 'styled-components';

const StyledButton = styled.div`
  width: 50px;
  height: 50px;
  background-color: #e0e0e0;
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

interface ActionButtonProps {
    name: string;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ name, onClick }) => {
    return <StyledButton onClick={onClick}>{name}</StyledButton>;
};

export default ActionButton;
