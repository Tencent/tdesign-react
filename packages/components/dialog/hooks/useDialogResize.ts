import React from "react";
import useMouseEvent from "../../hooks/useMouseEvent";
import { SizeDragLimit } from "../type";


const RESIZE_BORDER_WIDTH = 8; // 边框宽度，拖拽时的感应区域


interface DialogResizeProps {
  dialogCardRef: React.MutableRefObject<HTMLDivElement | null>;
  sizeDraggableProps: boolean | SizeDragLimit;
  onDragResizeChange: (resizing: boolean) => void;
}


type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | false;


function mouseOnBorder(
  e: React.MouseEvent, 
  dialogCardRef: React.MutableRefObject<HTMLDivElement | null>
): ResizeDirection {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const { left, top, width, height } = dialogCardRef.current.getBoundingClientRect();

  const borderWidth = RESIZE_BORDER_WIDTH;
  const onLeftBorder = mouseX >= left - borderWidth && mouseX <= left + borderWidth;
  const onRightBorder = mouseX >= left + width - borderWidth && mouseX <= left + width + borderWidth;
  const onTopBorder = mouseY >= top - borderWidth && mouseY <= top + borderWidth;
  const onBottomBorder = mouseY >= top + height - borderWidth && mouseY <= top + height + borderWidth;
  if (onLeftBorder && onTopBorder)
    return 'nw';
  if (onRightBorder && onBottomBorder)
    return 'se';
  if (onRightBorder && onTopBorder)
    return 'ne';
  if (onLeftBorder && onBottomBorder)
    return 'sw';
  if (onLeftBorder)
    return 'w';
  if (onRightBorder)
    return 'e';
  if (onTopBorder)
    return 'n';
  if (onBottomBorder)
    return 's';
  return false;
}


const useDialogResize = (props: DialogResizeProps) => {
  const { dialogCardRef, sizeDraggableProps } = props;

  const validWindow = typeof window === 'object';

  const getWindowHeight = () => (validWindow ? window.innerHeight || document.documentElement.clientHeight : undefined);
  const getWindowWidth = () => (validWindow ? window.innerWidth || document.documentElement.clientWidth : undefined);
  
  const dialogSize = React.useRef({ x: 0, y: 0, width: 0, height: 0 });

  const resizingDirection = React.useRef<ResizeDirection>(false);

  const minWidth = React.useRef(0);
  const maxWidth = React.useRef(Number.MAX_VALUE);
  const minHeight = React.useRef<number|undefined>(undefined);  // If undefined, set to current height on first drag (lower than which causes buttons overflow).
  const maxHeight = React.useRef(Number.MAX_VALUE);


  React.useEffect(() => {
    if (sizeDraggableProps === undefined || typeof sizeDraggableProps === 'boolean') {
      minWidth.current = undefined;
      maxWidth.current = Number.MAX_VALUE;
      minHeight.current = 0;
      maxHeight.current = Number.MAX_VALUE;
      return;
    }

    if (sizeDraggableProps.maxHeight !== undefined) {
      maxHeight.current = sizeDraggableProps.maxHeight;
    }
    
    if (sizeDraggableProps.minHeight !== undefined) {
      minHeight.current = sizeDraggableProps.minHeight;
    }

    if (sizeDraggableProps.maxWidth !== undefined) {
      maxWidth.current = sizeDraggableProps.maxWidth;
    }

    if (sizeDraggableProps.minWidth !== undefined) {
      minWidth.current = sizeDraggableProps.minWidth;
    }

  }, [sizeDraggableProps]);


  useMouseEvent(dialogCardRef, {
    enabled: sizeDraggableProps !== undefined && sizeDraggableProps !== false,
    alwaysEmitOnMove: sizeDraggableProps !== undefined && sizeDraggableProps !== false,
    onDown: (e: React.MouseEvent) => {
      if (minHeight.current === undefined && dialogCardRef.current) {
        minHeight.current = dialogCardRef.current.offsetHeight;
      }

      resizingDirection.current = mouseOnBorder(e, dialogCardRef);
      if (resizingDirection.current !== false) {
        dialogSize.current = {
          x: dialogCardRef.current.offsetLeft,
          y: dialogCardRef.current.offsetTop,
          width: dialogCardRef.current.offsetWidth,
          height: dialogCardRef.current.offsetHeight,
        };

        props.onDragResizeChange(true);

        e.stopPropagation();
        e.preventDefault();
      }
    },
    onMove: (e: React.MouseEvent) => {
      // Check whether we should update cursor style.
      const direction = mouseOnBorder(e, dialogCardRef);
      if (direction) {
        let cursor = '';
        if (direction === 'n' || direction === 's')
          cursor = `${direction}-resize`;
        else if (direction === 'e' || direction === 'w')
          cursor = `${direction}-resize`;
        else if (direction === 'ne' || direction === 'sw')
          cursor = 'nesw-resize';
        else if (direction === 'nw' || direction === 'se')
          cursor = 'nwse-resize';
        dialogCardRef.current.style.cursor = cursor;
      } else {
        if (resizingDirection.current === false)
          dialogCardRef.current.style.cursor = 'default';
      }

      if (resizingDirection.current === false)
        return;


      // Do resize.
      const dir = resizingDirection.current;
      const style = dialogCardRef.current.style;

      style.position = 'absolute';

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (mouseX <= 4 || mouseY <= 4 || mouseX >= getWindowWidth() - 4 || mouseY >= getWindowHeight() - 4) {
        return;  // Just ignore.
      }

      let nextHeight = dialogCardRef.current.offsetHeight;
      let nextWidth = dialogCardRef.current.offsetWidth;
      let nextTop = dialogCardRef.current.offsetTop;
      let nextLeft = dialogCardRef.current.offsetLeft;


      if (dir.includes('n')) {  // upper
        const deltaY = mouseY - dialogSize.current.y;
        nextHeight = dialogSize.current.height - deltaY;
        nextTop = dialogSize.current.y + deltaY;
      }
      else if (dir.includes('s')) {  // lower
        const deltaY = mouseY - dialogSize.current.y - dialogSize.current.height;
        nextHeight = dialogSize.current.height + deltaY;
      }

      if (dir.includes('w')) {  // left
        const deltaX = mouseX - dialogSize.current.x;
        nextWidth = dialogSize.current.width - deltaX;
        nextLeft = dialogSize.current.x + deltaX;
      }
      else if (dir.includes('e')) {  // right
        const deltaX = mouseX - dialogSize.current.x - dialogSize.current.width;
        nextWidth = dialogSize.current.width + deltaX;
      }

 
      style.left = `${nextLeft}px`;
      style.width = `${nextWidth}px`;
      dialogSize.current.x = nextLeft;
      dialogSize.current.width = nextWidth;


      if (nextHeight >= minHeight.current) {
        style.top = `${nextTop}px`;
        style.height = `${nextHeight}px`;
        dialogSize.current.y = nextTop;
        dialogSize.current.height = nextHeight;
      }
      
      e.stopPropagation();
      e.preventDefault();
      
    },
    onUp: (e: React.MouseEvent) => {

      if (resizingDirection.current === false)
        return;

      resizingDirection.current = false;

      // prevent triggering overlay click.
      setTimeout(() => {
        props.onDragResizeChange(false);
      }, 0);
      
      e.stopPropagation();
      e.preventDefault();
    },
  });
};

export default useDialogResize;
