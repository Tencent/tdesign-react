// 旋转控制
import { useCallback, useState } from 'react';

const useRotate = () => {
  const [rotateZ, setRotateZ] = useState(0);

  const onRotate = useCallback((ROTATE_COUNT: number) => {
    setRotateZ((rotateZ) => rotateZ + ROTATE_COUNT);
  }, []);

  const onResetRotate = useCallback(() => setRotateZ(0), []);

  return {
    rotateZ,
    onResetRotate,
    onRotate,
  };
};

export default useRotate;
