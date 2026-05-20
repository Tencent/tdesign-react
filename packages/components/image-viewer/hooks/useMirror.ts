// 镜像控制
import { useCallback, useState } from 'react';
import { MIRROR_DEFAULT, toggleMirror } from '@tdesign/common-js/image-viewer/transform';

const useMirror = () => {
  const [mirror, setMirror] = useState(MIRROR_DEFAULT);

  const onMirror = useCallback(() => {
    setMirror((current) => toggleMirror(current));
  }, []);

  const onResetMirror = useCallback(() => setMirror(MIRROR_DEFAULT), []);

  return {
    mirror,
    onResetMirror,
    onMirror,
  };
};

export default useMirror;
