import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import isFunction from 'lodash/isFunction';

export type PositionType = [number, number];

interface UsePositionArg {
  initPosition?: PositionType;
  move?: boolean;
  computed?: (XY: PositionType, screenXY: PositionType, oldXY: PositionType) => PositionType;
  onMouseUp?: (event?: MouseEvent) => void;
  onMouseMove?: (event?: MouseEvent) => void;
  onMouseDown?: (event?: MouseEventHandler<HTMLDivElement>) => void;
}

const usePosition = (
  { initPosition, move = true, onMouseUp: onEnd, onMouseMove: onUpdate, onMouseDown: onStart }: UsePositionArg,
  $dom?: HTMLElement | Document,
): [PositionType, MouseEventHandler<HTMLDivElement>] => {
  const [position, setPosition] = useState<PositionType>(initPosition);
  const cacheMoveDataRef = useRef(null);

  const onMouseUp = useCallback(() => {
    if (!cacheMoveDataRef.current) return;
    cacheMoveDataRef.current = null;
    if (!move) return;
    isFunction(onEnd) && onEnd();
  }, [move, onEnd]);

  const onMouseMove = useCallback(
    (event: MouseEvent | any) => {
      if (!event.buttons) cacheMoveDataRef.current = null;
      if (!cacheMoveDataRef.current || cacheMoveDataRef.current.updating || !move) return;
      cacheMoveDataRef.current.updating = true;
      const { screenX: oldX, screenY: oldY } = cacheMoveDataRef.current;
      const { screenX, screenY } = event;

      requestAnimationFrame(() => {
        if (!cacheMoveDataRef.current) return;
        setPosition(([X, Y]) => [X + screenX - oldX, Y + screenY - oldY]);
        cacheMoveDataRef.current.screenX = screenX;
        cacheMoveDataRef.current.screenY = screenY;
        cacheMoveDataRef.current.updating = false;
        isFunction(onUpdate) && onUpdate();
      });
    },
    [move, onUpdate],
  );

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const { screenX, screenY } = event;
      cacheMoveDataRef.current = {
        screenX,
        screenY,
      };
      if (!move) return;
      isFunction(onStart) && onStart();
    },
    [move, onStart],
  );

  useEffect(() => {
    const dom = $dom || document;
    dom.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      dom.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [$dom, move, onMouseMove, onMouseUp]);

  return [position, onMouseDown];
};

export default usePosition;
