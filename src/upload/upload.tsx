import React, { forwardRef } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import type { UploadProps } from './types';
import NormalFile from './NormalFile';
import DraggerFile from './DraggerFile';
import ImageCard from './ImageCard';
import ImageFlowList from './ImageFlowList';
import useUpload from './useUpload';
import Button from '../button';
import { uploadDefaultProps } from './defaultProps';
import { CommonDisplayFileProps } from './interface';
import { UploadDragEvents } from './useDrag';

const Upload = forwardRef((props: UploadProps, ref) => {
  const { theme } = props;
  const {
    locale,
    classPrefix,
    triggerUploadText,
    toUploadFiles,
    displayFiles,
    uploadValue,
    sizeOverLimitMessage,
    uploading,
    tipsClasses,
    errorClasses,
    inputRef,
    disabled,
    onRemove,
    uploadFiles,
    onNormalFileChange,
    onDragFileChange,
    triggerUpload,
    cancelUpload,
  } = useUpload(props);

  React.useImperativeHandle(ref, () => ({
    upload: inputRef.current,
    uploading,
    triggerUpload,
    uploadFiles,
  }));

  const renderTrigger = () => {
    const getDefaultTrigger = () => {
      if (theme === 'file-input') {
        return (
          <Button disabled={props.disabled} variant="outline" {...props.triggerButtonProps}>
            {triggerUploadText}
          </Button>
        );
      }
      return (
        <Button disabled={props.disabled} variant="outline" icon={<UploadIcon />} {...props.triggerButtonProps}>
          {triggerUploadText}
        </Button>
      );
    };
    return props.trigger || props.children || getDefaultTrigger();
  };

  const triggerElement = renderTrigger();

  const commonDisplayFileProps: CommonDisplayFileProps = {
    files: uploadValue,
    toUploadFiles,
    displayFiles,
    theme,
    placeholder: props.placeholder,
    disabled: props.disabled,
    tips: props.tips,
    sizeOverLimitMessage,
    uploading,
    classPrefix,
    tipsClasses,
    errorClasses,
    locale,
    autoUpload: props.autoUpload,
    fileListDisplay: props.fileListDisplay,
    onRemove,
  };

  const dragProps: UploadDragEvents = {
    onDragFileChange,
    onDragenter: props.onDragenter,
    onDragleave: props.onDragleave,
    onDrop: props.onDrop,
  };

  const NormalFileNode = (
    <NormalFile {...commonDisplayFileProps}>
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </NormalFile>
  );

  const SingleFileDraggerUploadNode = (
    <DraggerFile
      {...commonDisplayFileProps}
      dragEvents={dragProps}
      trigger={props.trigger}
      cancelUpload={cancelUpload}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
    />
  );

  const ImageCardUploadNode = (
    <ImageCard
      {...commonDisplayFileProps}
      multiple={props.multiple}
      max={props.max}
      showUploadProgress={props.showUploadProgress}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
      cancelUpload={cancelUpload}
    />
  );

  const ImageFlowListNode = (
    <ImageFlowList
      {...commonDisplayFileProps}
      dragEvents={dragProps}
      uploadFiles={uploadFiles}
      cancelUpload={cancelUpload}
    >
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </ImageFlowList>
  );

  return (
    <div className={classNames([props.className, `${classPrefix}-upload`])} style={props.style}>
      <input
        ref={inputRef}
        type="file"
        disabled={disabled}
        onChange={onNormalFileChange}
        multiple={props.multiple}
        accept={props.accept}
        hidden
      />
      {['file', 'file-input'].includes(theme) && !props.draggable && NormalFileNode}
      {['file', 'image'].includes(theme) && props.draggable && SingleFileDraggerUploadNode}
      {theme === 'image' && !props.draggable && ImageCardUploadNode}
      {theme === 'image-flow' && ImageFlowListNode}
    </div>
  );
});

Upload.displayName = 'Upload';

Upload.defaultProps = uploadDefaultProps;

export default Upload;
