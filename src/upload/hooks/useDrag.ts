import { DragEventHandler, useState, DragEvent } from 'react';
import { TdUploadProps } from '../type';

export interface UploadDragEvents {
  onDragFileChange?: (e: DragEvent<HTMLDivElement>) => void;
  onDragenter?: TdUploadProps['onDragenter'];
  onDragleave?: TdUploadProps['onDragleave'];
  onDrop?: TdUploadProps['onDrop'];
}

export default function useDrag(props: UploadDragEvents) {
  const [target, setTarget] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    props.onDragFileChange?.(event);
    props.onDrop?.({ e: event });
    setDragActive(false);
  };

  const handleDragenter: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setTarget(event.target);
    props.onDragenter?.({ e: event });
    setDragActive(true);
  };

  const handleDragleave: DragEventHandler<HTMLDivElement> = (event) => {
    if (event.target !== target) return;
    event.preventDefault();
    props.onDragleave?.({ e: event });
    setDragActive(false);
  };

  const handleDragover: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  return {
    target,
    dragActive,
    handleDrop,
    handleDragenter,
    handleDragleave,
    handleDragover,
  };
}
