import styled from 'styled-components';
import React from 'react';
import Modal from '../generic/Modal';
import { Timer } from '../../utils/context';
import CONST from '../../utils/CONST';
import Stopwatch from '../timers/Stopwatch';
import Countdown from '../timers/Countdown';
import XY from '../timers/XY';
import Tabata from '../timers/Tabata';

const StyledH2 = styled.h2`
  margin-top: 0px;
`;

interface TimerEditModalProps {
  isOpen: boolean;
  timer: Timer;
  onClose: () => void;
  onSave: () => void;
}

const TimerEditModal: React.FC<TimerEditModalProps> = ({isOpen, timer, onClose, onSave}) => {
  if (!isOpen) return null;

  const renderBody = (timer: Timer) => {
    if (timer.mode === CONST.TimerTypes.STOPWATCH) {
      return <Stopwatch timer={timer} close={onClose} />;
    } else if (timer.mode === CONST.TimerTypes.COUNTDOWN) {
      return <Countdown timer={timer} close={onClose} />;
    } else if (timer.mode === CONST.TimerTypes.XY) {
      return <XY timer={timer} close={onClose} />;
    } else if (timer.mode === CONST.TimerTypes.TABATA) {
      return <Tabata timer={timer} close={onClose} />;
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StyledH2>Edit a timer</StyledH2>
      { renderBody(timer) }
    </Modal>
);
};

export default TimerEditModal;