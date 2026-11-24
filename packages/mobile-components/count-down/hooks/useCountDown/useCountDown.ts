import { useRef, useState, useEffect } from 'react';
import { transformTime, TimeItem } from './transformTime';
import { TdCountDownProps, TimeData } from '../../type';

enum EnumCountDownStatus {
  active,
  inActive,
  paused,
  finished,
}

interface CountDownData {
  timeData: TimeData | null;
  timeList: TimeItem[];
  timeText: string;
  status: EnumCountDownStatus;
}

type UseCountdownParams = Omit<TdCountDownProps, 'content' | 'size' | 'splitWithUnit' | 'theme'>;

export const useCountDown = (params: UseCountdownParams) => {
  const { time, autoStart, millisecond, format, onChange, onFinish } = params;
  const [{ timeText, timeData, timeList, status }, setCountDownData] = useState<CountDownData>({
    timeData: null,
    timeList: [],
    timeText: '',
    status: EnumCountDownStatus.inActive,
  });
  const ctxRef = useRef({ timerId: 0, remainTime: time });
  // 处理毫秒级展示
  const getProcessedFormat = (currentFormat: string) => {
    if (millisecond && !format.includes(':SSS')) return currentFormat.concat(':SSS');
    return currentFormat;
  };

  const clearCountDown = () => {
    const currentTimerId = ctxRef.current.timerId;
    if (currentTimerId) {
      window.cancelAnimationFrame(currentTimerId);
      ctxRef.current.timerId = 0;
      setCountDownData((state) => ({ ...state, status: EnumCountDownStatus.inActive }));
    }
  };
  let previousFrameTimestamp = 0;

  const tick = (timestamp, reset = false) => {
    const delta = timestamp - (previousFrameTimestamp || timestamp);

    let nextRemainTime = reset ? time : ctxRef.current.remainTime - delta;
    ctxRef.current.remainTime = nextRemainTime;

    let nextStatus = EnumCountDownStatus.active;
    if (nextRemainTime <= 0) {
      nextRemainTime = 0;
      clearCountDown();
      nextStatus = EnumCountDownStatus.finished;
      onFinish?.();
      window.cancelAnimationFrame(ctxRef.current.timerId);
    } else {
      (ctxRef.current as any).timerId = window.requestAnimationFrame(tick);
    }

    const countDownData = {
      ...transformTime(nextRemainTime, getProcessedFormat(format)),
      status: nextStatus,
    };

    onChange?.(countDownData.timeData);
    setCountDownData(countDownData);

    previousFrameTimestamp = timestamp;
  };

  const startCountDown = (reset = false) => {
    clearCountDown();
    (ctxRef.current as any).timerId = window.requestAnimationFrame((timestamp) => tick(timestamp, reset));
  };

  useEffect(() => {
    if (autoStart) {
      startCountDown(true);
    } else {
      clearCountDown();
      ctxRef.current.remainTime = time;
      const initialData = transformTime(time, getProcessedFormat(format));
      setCountDownData({
        ...initialData,
        status: EnumCountDownStatus.inActive,
      });
    }

    return clearCountDown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, millisecond, format, autoStart]);

  const start = () => {
    if (status === EnumCountDownStatus.active) return;
    startCountDown();
  };

  const pause = () => {
    clearCountDown();
    setCountDownData((state) => ({ ...state, status: EnumCountDownStatus.paused }));
  };

  const reset = () => {
    clearCountDown();

    if (autoStart) {
      startCountDown(true);
    } else {
      setCountDownData((state) => ({ ...state, status: EnumCountDownStatus.inActive }));
    }
  };

  const isActive = status === EnumCountDownStatus.active;
  const isInActive = status === EnumCountDownStatus.inActive;
  const isPaused = status === EnumCountDownStatus.paused;
  const isFinished = status === EnumCountDownStatus.finished;

  return {
    remainTime: ctxRef.current.remainTime,
    timeText,
    timeData,
    timeList,
    start,
    pause,
    reset,
    isActive,
    isInActive,
    isPaused,
    isFinished,
  };
};
