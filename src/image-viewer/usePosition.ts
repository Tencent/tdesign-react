import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { isFunction } from 'lodash';

export type positionType = [number, number];

interface usePositionArg {
  initPosition?: positionType;
  move?: boolean;
  computed?: (XY: positionType, screenXY: positionType, oldXY: positionType) => positionType;
  onMouseUp?: (event?: MouseEvent) => void;
  onMouseMove?: (event?: MouseEvent) => void;
  onMouseDown?: (event?: MouseEventHandler<HTMLDivElement>) => void;
}

export const usePosition = (
  {
    initPosition,
    move = true,
    computed,
    onMouseUp: onEnd,
    onMouseMove: onUpdate,
    onMouseDown: onStart,
  }: usePositionArg,
  $dom?: HTMLElement | Document,
): [positionType, MouseEventHandler<HTMLDivElement>] => {
  const [position, setPosition] = useState<positionType>(initPosition);
  const ref = useRef(null);

  const onMouseUp = useCallback(() => {
    if (!ref.current) return;
    ref.current = null;
    if (!move) return;
    isFunction(onEnd) && onEnd();
  }, [move, onEnd]);

  const onMouseMove = useCallback(
    (event: MouseEvent | any) => {
      if (!event.buttons) ref.current = null;
      if (!ref.current || ref.current.updating || !move) return;
      ref.current.updating = true;
      const { screenX: oldX, screenY: oldY } = ref.current;
      const { screenX, screenY } = event;

      requestAnimationFrame(() => {
        if (!ref.current) return;
        setPosition(([X, Y]) =>
          computed ? computed([X, Y], [screenX, screenY], [oldX, oldY]) : [X + screenX - oldX, Y + screenY - oldY],
        );
        ref.current.screenX = screenX;
        ref.current.screenY = screenY;
        ref.current.updating = false;
        isFunction(onUpdate) && onUpdate();
      });
    },
    [computed, move, onUpdate],
  );

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      // @ts-ignore
      const { screenX, screenY } = event;
      ref.current = {
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

export const downloadFile = (path: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onerror = () => {
    window.open(path, '_blank');
  };
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 304) {
      const name = path.split('/').pop() || Math.random().toString(32).slice(2);
      const url = URL.createObjectURL(xhr.response);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
};
