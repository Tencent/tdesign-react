import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { TNode } from '../_type/common';
import { TriggerContext, UploadFile, UploadRemoveContext } from '../_type/components/upload';
import useConfig from '../_util/useConfig';
import DraggerProgress from './themes/dragger-progress';

export interface DraggerProps {
  file?: UploadFile;
  display?: string;
  trigger?: string | TNode<TriggerContext>;
  onCancel?: () => void;
  onTrigger?: () => void;
  onRemove?: (context: UploadRemoveContext) => void;
  onUpload?: (uploadFile: UploadFile) => void;
  onChange?: (files: FileList) => void;
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
}

const Dragger: FC<DraggerProps> = (props) => {
  const { file, display, onUpload } = props;
  const { classPrefix } = useConfig();
  const [dragActive, setDragActive] = useState(false);
  const target = React.useRef();

  const classes = classNames(
    `${classPrefix}-upload__dragger`,
    !file ? `${classPrefix}-upload__dragger-center` : '',
    file?.status === 'fail' ? `${classPrefix}-upload__dragger-error` : '',
  );

  const defaultDragElement = React.useMemo(() => {
    const unActiveElement = (
      <div>
        <span className={`${classPrefix}-upload__highlight`}>点击上传</span>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;拖拽到此区域</span>
      </div>
    );
    const activeElement = <div>释放鼠标</div>;
    return dragActive ? activeElement : unActiveElement;
  }, [classPrefix, dragActive]);

  const dragElement = React.useMemo(() => {
    let content: React.ReactNode;
    if (file && display !== 'custom') {
      content = (
        <DraggerProgress
          onRemove={props.onRemove}
          display={display}
          onTrigger={props.onTrigger}
          file={file}
          onUpload={() => {
            onUpload?.(file);
          }}
        />
      );
    } else {
      content = (
        <div className={`${classPrefix}-upload__trigger`} onClick={props.onTrigger}>
          {props.children || defaultDragElement}
        </div>
      );
    }

    return content;
  }, [classPrefix, defaultDragElement, display, file, onUpload, props.children, props.onRemove, props.onTrigger]);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    props.onChange?.(event.dataTransfer.files);
    props.onDragleave?.(event);
    setDragActive(false);
  };

  const handleDragenter = (event: DragEvent) => {
    event.preventDefault();
    props.onDragenter?.(event);
    setDragActive(true);
  };

  const handleDragleave = (event: DragEvent) => {
    if (!target.current) return;
    event.preventDefault();
    props.onDragleave?.(event);
    setDragActive(false);
  };

  const handleDragover = (event: DragEvent) => {
    event.preventDefault();
  };

  return (
    <div
      ref={target}
      className={classes}
      onDrop={handleDrop}
      onDragEnter={handleDragenter}
      onDragOver={handleDragover}
      onDragLeave={handleDragleave}
    >
      {dragElement}
    </div>
  );
};

export default Dragger;
