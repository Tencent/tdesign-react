import React, { DragEvent, MouseEvent, ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../../../hooks/useConfig';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import Button from '../../../button';
import { UploadFile } from '../../type';
import { FlowRemoveContext } from '../../types';
import ImgList from './img-list';
import FileList from './file-list';
import BooleanRender from '../../boolean-render';
import { UploadConfig } from '../../../config-provider/type';

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
  onImgPreview: (file: UploadFile, e: MouseEvent) => void;
  onChange: (files: FileList) => void;
  onDragenter: (e: React.DragEvent) => void;
  onDragleave: (e: React.DragEvent) => void;
  localeFromProps?: UploadConfig;
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
    localeFromProps,
  } = props;
  const target = React.useRef();
  const { classPrefix: prefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');
  const UPLOAD_NAME = `${prefix}-upload`;
  const [dragActive, setDragActive] = useState(false);
  const showInitial = !listFiles.length;
  const failedList = toUploadFiles.filter((file) => file.status === 'fail');
  const isUploading = toUploadFiles.filter((file) => file.status === 'progress').length > 0;
  const allowUpload = toUploadFiles.length > 0 && !isUploading;
  const { progress, triggerUploadText } = locale;
  let uploadText = failedList.length ? t(triggerUploadText.reupload) : t(triggerUploadText.normal);
  if (isUploading) uploadText = t(progress.uploadingText);

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
  const onInternalImgPreview = useCallback(
    (file, event) => {
      if (!onImgPreview) return;
      event.preventDefault();
      onImgPreview(file, event);
    },
    [onImgPreview],
  );

  const renderDragger = () => (
    <div
      ref={target}
      className={`${UPLOAD_NAME}__flow-empty`}
      onDrop={handleDrop}
      onDragEnter={handleDragenter}
      onDragOver={handleDragover}
      onDragLeave={handleDragleave}
    >
      {dragActive
        ? localeFromProps?.dragger?.dragDropText || t(locale.dragger.dragDropText)
        : localeFromProps?.dragger?.clickAndDragText || t(locale.dragger.clickAndDragText)}
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
          onImgPreview={onInternalImgPreview}
          remove={remove}
        />
      </BooleanRender>
      <div className={`${UPLOAD_NAME}__flow-bottom`}>
        <Button theme="default" onClick={cancel}>
          {t(locale.cancelUploadText)}
        </Button>
        <Button disabled={!allowUpload} theme="primary" onClick={(e: MouseEvent) => upload(toUploadFiles, e)}>
          {uploadText}
        </Button>
      </div>
    </div>
  );
};

export default Index;
