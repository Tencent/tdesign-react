import useControlled from 'tdesign-react/hooks/useControlled';
import { useCallback } from 'react';

/** ImageViewerModel hooks * */
// 选中下标控制
const useIndex = (resProps, images) => {
  const [index, setIndex] = useControlled<number, any>(resProps, 'index', resProps.onIndexChange);

  const next = useCallback(() => {
    const newIndex = index + 1;
    if (newIndex >= images.length) return index;
    setIndex(newIndex);
  }, [setIndex, index, images.length]);

  const prev = useCallback(() => {
    const newIndex = index - 1 > 0 ? index - 1 : 0;
    setIndex(newIndex);
  }, [index, setIndex]);

  return {
    index,
    next,
    prev,
    setIndex,
  };
};

export default useIndex;
