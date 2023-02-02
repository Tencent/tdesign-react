const requestAnimationFrame =
  (typeof window === 'undefined' ? false : window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16.6));
const cancelAnimationFrame =
  (typeof window === 'undefined' ? false : window.cancelAnimationFrame) || ((id) => clearTimeout(id));

type CountUpProps = {
  // 计时器计时上限
  maxTime?: number;
  // 浏览器每次重绘前的回调
  onChange?: (curentTime?: number) => void;
  // 计时结束回调行为
  onFinish?: () => void;
};

const useCountUp = (options: CountUpProps) => {
  const { maxTime, onChange, onFinish } = options;
  // 记录最新动画id
  let rafId;
  // 计时器起始时间
  let startTime;
  // 计时器暂停时间
  let stopTime;
  // 计时器启动后历经时长
  let curentTime;
  // 是否计时中
  let counting = false;

  /**
   * 暂停计时
   * @returns
   */
  const pause = () => {
    // 已经暂停后，屏蔽掉点击
    if (!counting) return;

    counting = false;
    stopTime = performance.now();
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };

  /**
   * 停止计时
   */
  const stop = () => {
    pause();
    onFinish?.();
  };

  /**
   * 浏览器下一次重绘之前更新动画帧所调用的函数
   * @param timestamp 与performance.now()的返回值相同，表示requestAnimationFrame()开始去执行回调函数的时刻。
   */
  const step = () => {
    curentTime = performance.now() - startTime;
    onChange?.(curentTime);

    if (maxTime && Math.floor(curentTime) >= maxTime) {
      stop();
      return;
    }
    rafId = requestAnimationFrame(step);
  };

  /**
   * 启动计时器
   */
  const start = () => {
    // 计时中 或者 曾经计时过想要重新开始计时，应该先点击一下 重置 再开始计时
    if (counting || curentTime) return;

    counting = true;
    startTime = performance.now();
    rafId = requestAnimationFrame(step);
  };

  /**
   * 计时器继续计时
   */
  const goOn = () => {
    // 已经在计时中，屏蔽掉点击
    if (counting) return;

    counting = true;
    startTime += performance.now() - stopTime;
    rafId = requestAnimationFrame(step);
  };

  /**
   * 重置计时器
   */
  const reset = () => {
    stop();
    curentTime = 0;
    startTime = 0;
    stopTime = 0;
  };

  return {
    start,
    pause,
    stop,
    goOn,
    reset,
  };
};

export default useCountUp;
