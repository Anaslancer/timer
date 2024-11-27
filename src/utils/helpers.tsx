import { Timer } from './context';
import CONST from './CONST';

interface MinSec {
    min: number,
    sec: number,
}

export const timerToString = (timer: Timer) => {
    const time: MinSec = secToMin(timer.expectedTime);
    if (timer.mode === CONST.TimerTypes.STOPWATCH || timer.mode === CONST.TimerTypes.COUNTDOWN) {
        return timer.mode + " timer (" + timeToString(time.min, time.sec) + ")";
    } else if (timer.mode === CONST.TimerTypes.XY) {
        return timer.mode + " timer (" + timeToString(time.min, time.sec) + ", " + timer.round + " time(s))";
    } else if (timer.mode === CONST.TimerTypes.TABATA) {
        const idleTime: MinSec = secToMin(timer.restTime ?? 0);
        return timer.mode + " timer (" + timeToString(time.min, time.sec) + ", idle: " + timeToString(idleTime.min, idleTime.sec) + ", " + timer.round + " time(s))";
    }
    return timer.mode + " timer";
}

// Convert time to seconds, ie: 2 min 3 sec -> 123 sec
export const timeToSec = (min: number | string, sec: number | string) => {
    const mins = Number(min) || 0;
    const secs = Number(sec) || 0;

    return mins * 60 + secs;
}

// Convert seconds to minutes and seconds, ie: 123 sec -> 2 min 3 sec
export const secToMin = (sec: number | string) => {
    const secs = Number(sec) || 0;
    return { min: Math.floor(secs / 60), sec: secs % 60 }
}

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
}

