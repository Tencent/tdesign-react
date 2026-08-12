// 旋转控制
import { useCallback, useRef, useState } from 'react';
import { calcResetRotation, ROTATE_DEG } from '@tdesign/common-js/image-viewer/transform';

const useRotate = () => {
  // There is an useEffect in the line 472 of ImageViewerModal.tsx, so we need to use a ref to store the rotateZ value.
  const rotRef = useRef(0);
  const [rotateZ, setRotateZ] = useState(0);

  const onRotate = useCallback(() => {
    setRotateZ((prev) => {
      rotRef.current = prev + ROTATE_DEG;
      return prev + ROTATE_DEG;
    });
  }, []);

  const onResetRotate = useCallback(() => {
    const adjusted = calcResetRotation(rotRef.current);
    if (adjusted !== 0) {
      setRotateZ((prev) => {
        rotRef.current = prev - adjusted;
        return prev - adjusted;
      });
    }
  }, []);

  return {
    rotateZ,
    onResetRotate,
    onRotate,
  };
};

export default useRotate;
