import { useRef, useState } from 'react';
import raf from './raf';

function isEqual(objA, objB) {
  const keys = Object.keys(objA);
  for (const key of keys) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}

export type TransformType = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
};

export type TransformAction =
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'close'
  | 'prev'
  | 'next'
  | 'wheel'
  | 'doubleClick'
  | 'move'
  | 'dragRebound'
  | 'touchZoom'
  | 'reset';

export type UpdateTransformFunc = (newTransform: Partial<TransformType>, action: TransformAction) => void;

export type DispatchZoomChangeFunc = (ratio: number, action: TransformAction, isTouch?: boolean) => void;

const initialTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  flipX: false,
  flipY: false,
};

export function useImageTransform(
  minScale: number,
  maxScale: number,
  onTransform?: (info: { transform: TransformType; action: TransformAction }) => void,
) {
  const frame = useRef(null);
  const queue = useRef<Partial<TransformType>[]>([]);
  const [transform, setTransform] = useState(initialTransform);

  const resetTransform = (action: TransformAction) => {
    setTransform(initialTransform);
    if (!isEqual(initialTransform, transform)) {
      onTransform?.({ transform: initialTransform, action });
    }
  };

  const updateTransform: UpdateTransformFunc = (newTransform, action) => {
    if (frame.current === null) {
      queue.current = [];
      frame.current = raf(() => {
        setTransform((preState) => {
          let memoState: any = preState;
          queue.current.forEach((queueState) => {
            memoState = { ...memoState, ...queueState };
          });
          frame.current = null;

          onTransform?.({ transform: memoState, action });
          return memoState;
        });
      });
    }
    queue.current.push({
      ...newTransform,
    });
  };

  const dispatchZoomChange: DispatchZoomChangeFunc = (ratio, action, isTouch?) => {
    let newScale = transform.scale * ratio;

    if (newScale > maxScale) {
      newScale = maxScale;
    } else if (newScale < minScale) {
      newScale = isTouch ? newScale : minScale;
    }

    updateTransform(
      {
        scale: newScale,
      },
      action,
    );
  };

  return {
    transform,
    resetTransform,
    updateTransform,
    dispatchZoomChange,
  };
}
