// 镜像控制
import { useCallback, useState } from 'react';

const useMirror = () => {
  const [mirror, setMirror] = useState(1);

  const onMirror = useCallback(() => {
    setMirror((mirror) => (mirror > 0 ? -1 : 1));
  }, []);

  const onResetMirror = useCallback(() => setMirror(1), []);

  return {
    mirror,
    onResetMirror,
    onMirror,
  };
};

export default useMirror;
