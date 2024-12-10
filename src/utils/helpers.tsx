import { Timer } from './context';
import CONST, { TimerStatusType } from './CONST';

interface MinSec {
    min: number,
    sec: number,
}

export const timerToString = (timer: Timer) => {
    const time: MinSec = secToMin(timer.expectedTime ?? 0);
    if (timer.mode === CONST.TimerTypes.STOPWATCH || timer.mode === CONST.TimerTypes.COUNTDOWN) {
        return timer.mode + " timer (" + timeToString(time.min, time.sec) + ")";
    } else if (timer.mode === CONST.TimerTypes.XY) {
        return timer.mode + " timer (" + timeToString(time.min, time.sec) + ", " + timer.round + " time(s))";
    } else if (timer.mode === CONST.TimerTypes.TABATA) {
        const idleTime: MinSec = secToMin(timer.restTime ?? 0);
        return timer.mode + " timer (" + timeToString(time.min, time.sec) + ", idle: " + timeToString(idleTime.min, idleTime.sec) + ", " + timer.round + " time(s))";
    }
    return timer.mode + " timer";
};

// Convert time to seconds, ie: 2 min 3 sec -> 123 sec
export const timeToSec = (min: number | string, sec: number | string) => {
    const mins = Number(min) || 0;
    const secs = Number(sec) || 0;

    return mins * 60 + secs;
};

// Convert seconds to minutes and seconds, ie: 123 sec -> 2 min 3 sec
export const secToMin = (sec: number | string) => {
    const secs = Number(sec) || 0;
    return { min: Math.floor(secs / 60), sec: secs % 60 }
};

export const formattedTimeString = (sec: number | string) => {
    const secs = Number(sec) || 0;
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
};

export const timeToString = (min: number | string, sec: number | string) => {
    const mins = Number(min) || 0;
    const secs = Number(sec) || 0;

    if (mins > 0 && secs === 0) {
        return `${mins} min`;
    } else if (mins > 0 && secs > 0) {
        return `${mins} min ${secs} sec`;
    } else if (mins === 0 && secs > 0) {
        return `${secs} sec`;
    }

    return '0 sec';
};

export const strTo10Digits = (str: string) => {
    return Math.max(0, Number.parseInt(str, 10) || 0);
};

export const setTimerStatusAsComplete = (timer: Timer) => {
    timer.status = CONST.TimerStatuses.COMPLETE;
};

export const setTimerStatusAsPlay = (timer: Timer) => {
    timer.status = CONST.TimerStatuses.PLAY;
};

export const setTimerStatusAsPause = (timer: Timer) => {
    timer.status = CONST.TimerStatuses.PAUSE;
};

export const setTimerStatusAsReady = (timer: Timer) => {
    timer.status = CONST.TimerStatuses.READY;
};

export const increaseTimerPassedTime = (timer: Timer) => {
    const expectedTime = timer.isResting ? timer.restTime : timer.expectedTime;

    if (timer.passedTime < expectedTime) {
        timer.passedTime ++;
    }
};

export const resetTimerPassedTime = (timer: Timer) => {
    timer.passedTime = 0;
};

export const increaseTimerPassedRound = (timer: Timer) => {
    timer.passedRound ++;
};

export const resetTimerPassedRound = (timer: Timer) => {
    timer.passedRound = 0;
};

export const toggleTimerIsResting = (timer: Timer) => {
    timer.isResting = !timer.isResting;
};

export const saveTimerToLocalStorage = (timer: Timer) => {
    const completedTimersStr = localStorage.getItem(CONST.StorageKeys.COMPLETED_TIMERS);
    let completedTimers = completedTimersStr ? JSON.parse(completedTimersStr) : [];
    completedTimers.push(timer);
    localStorage.setItem(CONST.StorageKeys.COMPLETED_TIMERS, JSON.stringify(completedTimers));
};

export const updateTimerPassedTime = (timer: Timer, passedTime: number) => {
    timer.passedTime = passedTime;
};

export const updateTimerPassedRound = (timer: Timer, passedRound: number) => {
    timer.passedRound = passedRound;
};

export const updateTimerIsResting = (timer: Timer, isResting: boolean) => {
    timer.isResting = isResting;
};

export const completedTimers = (timers: Timer[]): Timer[] => {
    return timers.filter(({ status }: Timer) => status === CONST.TimerStatuses.COMPLETE);
};

export const replaceTimerInQueue = (timers:Timer[], newTimer: Timer) => {
    const newTimersQueue = [...timers];
    const index = timers.findIndex((t) => t.id === newTimer.id);
    newTimersQueue[index] = newTimer;
    return newTimersQueue;
};
