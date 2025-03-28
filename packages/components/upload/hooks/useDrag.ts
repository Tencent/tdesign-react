import { DragEventHandler, useState } from 'react';
import { getFileList } from '@tdesign/common-js/upload/utils';
import { TdUploadProps } from '../type';

export interface UploadDragEvents {
  accept?: string;
  onDragFileChange?: (files: File[]) => void;
  onDragenter?: TdUploadProps['onDragenter'];
  onDragleave?: TdUploadProps['onDragleave'];
  onDrop?: TdUploadProps['onDrop'];
}

export default function useDrag(props: UploadDragEvents) {
  const { accept } = props;
  const [target, setTarget] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragActive(false);

    const { files } = event.dataTransfer;
    const dragFiles: File[] = getFileList(files, accept);

    if (dragFiles.length) {
      props.onDragFileChange?.(dragFiles);
    }
    props.onDrop?.({ e: event });
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
