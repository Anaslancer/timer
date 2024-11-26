import type {ValueOf} from 'type-fest';

const CONST = {
  TimerTypes: {
    STOPWATCH: 'Stopwatch',
    COUNTDOWN: 'Countdown',
    XY: 'XY',
    TABATA: 'Tabata',
  },
  TimerStatuses: {
    PLAY: 'play',
    PAUSE: 'pause',
    COMPLETE: 'complete',
    READY: 'ready',
  }
} as const;

type TimerType = ValueOf<typeof CONST.TimerTypes>;
type TimerStatusType = ValueOf<typeof CONST.TimerStatuses>;

export type {
  TimerType,
  TimerStatusType,
};

export default CONST;