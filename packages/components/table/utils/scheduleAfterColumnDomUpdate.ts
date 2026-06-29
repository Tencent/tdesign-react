/**
 * 列序 DOM 更新后执行回调（双 rAF），确保 thead/tbody 列顺序与 fixed 位置计算一致。
 * @returns 取消函数
 */
export function scheduleAfterColumnDomUpdate(callback: () => void): () => void {
  let cancelled = false;
  requestAnimationFrame(() => {
    if (cancelled) return;
    requestAnimationFrame(() => {
      if (cancelled) return;
      callback();
    });
  });
  return () => {
    cancelled = true;
  };
}
