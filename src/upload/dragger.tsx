import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { TNode } from '@TdTypes/common';
import { TriggerContext, UploadFile, UploadRemoveContext } from '../_type/components/upload';
import useConfig from '../_util/useConfig';
import DraggerProgress from './dragger-progress';

export interface DraggerProps {
  file?: UploadFile;
  loadingFile?: UploadFile;
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
  const { file, loadingFile, display } = props;
  const { classPrefix } = useConfig();
  const [dragActive, setDragActive] = useState(false);

  const classes = classNames(
    `${classPrefix}-upload__dragger`,
    !loadingFile && !file ? `${classPrefix}-upload__dragger-center` : '',
    loadingFile && loadingFile.status === 'fail' ? `${classPrefix}-upload__dragger-error` : '',
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
    let content = null;
    if ((loadingFile || file) && display !== 'custom') {
      content = <DraggerProgress file={file} loadingFile={loadingFile} />;
    } else {
      content = (
        <div className="t-upload__trigger" onClick={props.onTrigger}>
          {props.children || defaultDragElement}
        </div>
      );
    }

    return content;
  }, [defaultDragElement, display, file, loadingFile, props.children, props.onTrigger]);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    // this.$emit('change', event.dataTransfer.files);
    // this.$emit('dragleave', event);
    setDragActive(false);
  };

  const handleDragenter = (event: DragEvent) => {
    this.target = event.target;
    event.preventDefault();
    // this.$emit('dragenter', event);
    setDragActive(true);
  };

  const handleDragleave = (event: DragEvent) => {
    if (this.target !== event.target) return;
    event.preventDefault();
    // this.$emit('dragleave', event);
    setDragActive(false);
  };

  const handleDragover = (event: DragEvent) => {
    event.preventDefault();
  };

  return (
    <div
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
