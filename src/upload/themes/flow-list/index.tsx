import React, { DragEvent, MouseEvent, ReactNode, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../../../_util/useConfig';
import Button from '../../../button';
import { UploadFile } from '../../type';
import { FlowRemoveContext } from '../../types';
import ImgList from './img-list';
import FileList from './file-list';
import BooleanRender from '../../boolean-render';

export interface CommonListProps {
  renderDragger: () => React.ReactElement;
  showInitial: boolean;
  listFiles: UploadFile[];
}

export interface FlowListProps {
  children?: ReactNode;
  files?: UploadFile[];
  showUploadProgress?: boolean;
  toUploadFiles?: UploadFile[];
  placeholder: string;
  display: 'file-flow' | 'image-flow';
  remove: (ctx: FlowRemoveContext) => void;
  upload: (files: UploadFile[], e: MouseEvent) => void;
  cancel: (e: MouseEvent) => void;
  onImgPreview: (e: MouseEvent, files: UploadFile) => void;
  onChange: (files: FileList) => void;
  onDragenter: (e: React.DragEvent) => void;
  onDragleave: (e: React.DragEvent) => void;
}

const Index: React.FC<FlowListProps> = (props) => {
  const {
    files: listFiles,
    toUploadFiles = [],
    showUploadProgress = false,
    placeholder,
    display,
    onImgPreview,
    remove,
    upload,
    cancel,
    onChange,
    onDragenter,
    onDragleave,
    children = null,
  } = props;
  const target = React.useRef();
  const { classPrefix: prefix } = useConfig();
  const UPLOAD_NAME = `${prefix}-upload`;
  const [dragActive, setDragActive] = useState(false);
  const showInitial = !listFiles.length;
  const failedList = toUploadFiles.filter((file) => file.status === 'fail');
  const isUploading = toUploadFiles.filter((file) => file.status === 'progress').length > 0;
  const allowUpload = toUploadFiles.length > 0 && !isUploading;
  let uploadText = failedList.length ? '重新上传' : '开始上传';
  if (isUploading) uploadText = '上传中...';

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    onChange?.(event.dataTransfer.files);
    onDragleave?.(event);
    setDragActive(false);
  };
  const handleDragenter = (event: DragEvent) => {
    event.preventDefault();
    onDragenter?.(event);
    setDragActive(true);
  };
  const handleDragleave = (event: DragEvent) => {
    if (event.target !== target.current) return;
    event.preventDefault();
    onDragleave?.(event);
    setDragActive(false);
  };
  const handleDragover = (event: DragEvent) => {
    event.preventDefault();
  };

  const renderDragger = () => (
    <div
      ref={target}
      className={`${UPLOAD_NAME}__flow-empty`}
      onDrop={handleDrop}
      onDragEnter={handleDragenter}
      onDragOver={handleDragover}
      onDragLeave={handleDragleave}
    >
      {dragActive ? '释放鼠标' : '点击上方“选择文件”或将文件拖拽到此区域'}
    </div>
  );
  const wrapperClassNames = classNames({
    [`${UPLOAD_NAME}__flow`]: true,
    [`${UPLOAD_NAME}__flow-${display}`]: true,
  });

  return (
    <div className={wrapperClassNames}>
      <div className={`${UPLOAD_NAME}__flow-op`}>
        {children}
        <small className={`${UPLOAD_NAME}__small ${UPLOAD_NAME}__flow-placeholder`}>{placeholder}</small>
      </div>
      <BooleanRender boolExpression={display === 'file-flow'}>
        <FileList
          listFiles={listFiles}
          showInitial={showInitial}
          renderDragger={renderDragger}
          showUploadProgress={showUploadProgress}
          remove={remove}
        />
      </BooleanRender>
      <BooleanRender boolExpression={display === 'image-flow'}>
        <ImgList
          listFiles={listFiles}
          showInitial={showInitial}
          renderDragger={renderDragger}
          onImgPreview={onImgPreview}
          remove={remove}
        />
      </BooleanRender>
      <div className={`${UPLOAD_NAME}__flow-bottom`}>
        <Button theme="default" onClick={cancel}>
          取消
        </Button>
        <Button disabled={!allowUpload} theme="primary" onClick={(e: MouseEvent) => upload(toUploadFiles, e)}>
          {uploadText}
        </Button>
      </div>
    </div>
  );
};

export default Index;
