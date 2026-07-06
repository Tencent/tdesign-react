import { useCallback } from 'react';

import useControlled from '../../hooks/useControlled';

/** ImageViewerModal hooks * */
// 选中下标控制
const useIndex = (resProps, images) => {
  const [index, setIndex] = useControlled(resProps, 'index', resProps.onIndexChange);

  const next = useCallback(() => {
    const newIndex = index + 1;
    if (newIndex >= images.length) return index;
    setIndex(newIndex, { trigger: 'next' });
  }, [setIndex, index, images.length]);

  const prev = useCallback(() => {
    const newIndex = index - 1;
    if (newIndex < 0) return index;
    setIndex(newIndex, { trigger: 'prev' });
  }, [setIndex, index]);

  return {
    index,
    next,
    prev,
    setIndex,
  };
};

export default useIndex;
