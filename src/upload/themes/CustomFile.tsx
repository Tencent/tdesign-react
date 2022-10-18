import React, { ReactNode } from 'react';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import { CommonDisplayFileProps } from '../interface';
import { TdUploadProps } from '../type';
import parseTNode from '../../_util/parseTNode';

export interface CustomFileProps extends CommonDisplayFileProps {
  dragEvents: UploadDragEvents;
  draggable?: boolean;
  // 拖拽区域
  dragContent?: TdUploadProps['dragContent'];
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: () => void;
  // 非拖拽场景，是触发元素；拖拽场景是拖拽区域
  childrenNode?: ReactNode;
}

const CustomFile = (props: CustomFileProps) => {
  const { classPrefix, displayFiles } = props;
  const drag = useDrag(props.dragEvents);
  const { dragActive } = drag;

  const dragEvents = props.draggable
    ? {
        onDrop: drag.handleDrop,
        onDragEnter: drag.handleDragenter,
        onDragOver: drag.handleDragover,
        onDragLeave: drag.handleDragleave,
      }
    : {};

  const renderDragContent = () => (
    <div
      className={`${classPrefix}-upload__dragger ${classPrefix}-upload__dragger-center`}
      {...dragEvents}
      onClick={props.triggerUpload}
    >
      <div className={`${classPrefix}-upload__trigger`}>
        {parseTNode(props.dragContent, { dragActive, files: displayFiles }) ||
          props.trigger?.({ dragActive, files: displayFiles }) ||
          props.childrenNode}
      </div>
    </div>
  );

  return (
    <>
      {props.draggable ? (
        renderDragContent()
      ) : (
        <div className={`${classPrefix}-upload__trigger`} onClick={props.triggerUpload}>
          {props.childrenNode || props.children}
        </div>
      )}
    </>
  );
};

CustomFile.displayName = 'CustomFile';

export default CustomFile;
