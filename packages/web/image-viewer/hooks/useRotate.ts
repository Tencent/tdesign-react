// 旋转控制
import { useCallback, useRef, useState } from 'react';

const useRotate = () => {
  // There is an useEffect in the line 472 of ImageViewerModal.tsx, so we need to use a ref to store the rotateZ value.
  const rotRef = useRef(0);
  const [rotateZ, setRotateZ] = useState(0);

  const onRotate = useCallback((ROTATE_COUNT: number) => {
    setRotateZ((rotateZ) => {
      rotRef.current = rotateZ + ROTATE_COUNT;
      return rotateZ + ROTATE_COUNT;
    });
  }, []);

  const onResetRotate = useCallback(() => {
    let degreeToRotate = rotRef.current % 360;
    // make sure we always rotate to the shortest direction
    if (Math.abs(degreeToRotate) > 180) {
      degreeToRotate = (degreeToRotate + 360) % 360;
    }
    if (degreeToRotate !== 0) {
      setRotateZ((rotateZ) => {
        rotRef.current = rotateZ - degreeToRotate;
        return rotateZ - degreeToRotate;
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
