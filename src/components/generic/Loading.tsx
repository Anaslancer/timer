import styled from 'styled-components';

const primaryColor = '#ffa2bf';

type Size = 'small' | 'medium' | 'large';

const sizeMapping: Record<Size, number> = {
    small: 10,
    medium: 14,
    large: 20,
};

const Container = styled.div`
  animation: spin 1.5s linear infinite;

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

const Dot = styled.span<{ size: number }>`
  display: block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: wobble 1s ease-in-out infinite;

  @keyframes wobble {
    0% {
      border-radius: 25%;
    }
    100% {
      border-radius: 100%;
    }
  }
`;

const DotGroup = styled.div`
  display: flex;
`;

const PlayButton = styled.div`
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

const DisplayWindow = styled.div`
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
`;

const ActivityButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-direction: row;
`;

const ScreenContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  flex-direction: column;
`;

const Loading = ({
    size = 'medium',
    color = primaryColor,
}: {
    size: Size;
    color: string;
}) => {
    return (
        <Container>
            <DotGroup>
                <Dot size={sizeMapping[size]} color={color} />
                <Dot size={sizeMapping[size]} color={color} />
            </DotGroup>
            <DotGroup>
                <Dot size={sizeMapping[size]} color={color} />
                <Dot size={sizeMapping[size]} color={color} />
            </DotGroup>
        </Container>
    );
};

Loading.ActivityButtonContainer = ActivityButtonContainer;
Loading.ScreenContainer = ScreenContainer;
Loading.DisplayWindow = DisplayWindow;
Loading.PlayButton = PlayButton;
export default Loading;
