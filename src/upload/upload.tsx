import React, { ForwardedRef, forwardRef } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import NormalFile from './themes/NormalFile';
import DraggerFile from './themes/DraggerFile';
import ImageCard from './themes/ImageCard';
import MultipleFlowList from './themes/MultipleFlowList';
import useUpload from './hooks/useUpload';
import Button from '../button';
import { uploadDefaultProps } from './defaultProps';
import { CommonDisplayFileProps, UploadProps, UploadRef } from './interface';
import { UploadDragEvents } from './hooks/useDrag';
import CustomFile from './themes/CustomFile';
import { UploadFile } from './type';
import parseTNode from '../_util/parseTNode';

// const Upload = forwardRef((props: UploadProps, ref) => {
function TdUpload<T extends UploadFile = UploadFile>(props: UploadProps<T>, ref: ForwardedRef<UploadRef>) {
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
    placeholderClass,
    inputRef,
    disabled,
    onRemove,
    uploadFiles,
    onNormalFileChange,
    onDragFileChange,
    onPasteFileChange,
    triggerUpload,
    cancelUpload,
    uploadFilePercent,
  } = useUpload(props);

  React.useImperativeHandle(ref, () => ({
    upload: inputRef.current,
    uploading,
    uploadFilePercent,
    triggerUpload,
    uploadFiles,
    cancelUpload,
  }));

  const renderTrigger = () => {
    const getDefaultTrigger = () => {
      if (theme === 'file-input') {
        return (
          <Button disabled={disabled} variant="outline" {...props.triggerButtonProps}>
            {triggerUploadText}
          </Button>
        );
      }
      return (
        <Button disabled={disabled} variant="outline" icon={<UploadIcon />} {...props.triggerButtonProps}>
          {triggerUploadText}
        </Button>
      );
    };
    return (
      parseTNode(props.trigger, { dragActive: false, files: uploadValue }) || props.children || getDefaultTrigger()
    );
  };

  const triggerElement = renderTrigger();

  const commonDisplayFileProps: CommonDisplayFileProps = {
    accept: props.accept,
    files: uploadValue,
    toUploadFiles,
    displayFiles,
    theme,
    abridgeName: props.abridgeName,
    placeholder: props.placeholder,
    disabled: props.disabled,
    tips: props.tips,
    sizeOverLimitMessage,
    uploading,
    classPrefix,
    tipsClasses,
    errorClasses,
    placeholderClass,
    locale,
    autoUpload: props.autoUpload,
    showUploadProgress: props.showUploadProgress,
    fileListDisplay: props.fileListDisplay,
    imageViewerProps: props.imageViewerProps,
    onRemove,
  };

  const dragProps: UploadDragEvents = {
    onDragFileChange,
    onDragenter: props.onDragenter,
    onDragleave: props.onDragleave,
    onDrop: props.onDrop,
  };

  const getNormalFileNode = () => (
    <NormalFile {...commonDisplayFileProps} multiple={props.multiple}>
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </NormalFile>
  );

  const getSingleFileDraggerUploadNode = () => (
    <DraggerFile
      {...commonDisplayFileProps}
      dragEvents={dragProps}
      trigger={props.trigger}
      cancelUpload={cancelUpload}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
    />
  );

  const getImageCardUploadNode = () => (
    <ImageCard
      {...commonDisplayFileProps}
      multiple={props.multiple}
      max={props.max}
      showUploadProgress={props.showUploadProgress}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
      cancelUpload={cancelUpload}
      onPreview={props.onPreview}
      showImageFileName={props.showImageFileName}
    />
  );

  const getFlowListNode = () => (
    <MultipleFlowList
      {...commonDisplayFileProps}
      isBatchUpload={props.isBatchUpload}
      draggable={props.draggable}
      dragEvents={dragProps}
      uploadFiles={uploadFiles}
      cancelUpload={cancelUpload}
      onPreview={props.onPreview}
      showThumbnail={props.showThumbnail}
      showImageFileName={props.showImageFileName}
      uploadButton={props.uploadButton}
      cancelUploadButton={props.cancelUploadButton}
    >
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </MultipleFlowList>
  );

  const getCustomFile = () => (
    <CustomFile
      {...commonDisplayFileProps}
      draggable={props.draggable}
      dragContent={props.dragContent}
      dragEvents={dragProps}
      triggerUpload={triggerUpload}
      childrenNode={props.children}
      trigger={props.trigger}
    >
      {triggerElement}
    </CustomFile>
  );

  const uploadClasses = [
    props.className,
    `${classPrefix}-upload`,
    {
      [`${classPrefix}-upload--theme-${props.theme}`]: props.theme === 'file-input',
    },
  ];

  return (
    <div
      className={classNames(uploadClasses)}
      style={props.style}
      onPaste={props.uploadPastedFiles ? onPasteFileChange : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        disabled={disabled}
        onChange={onNormalFileChange}
        multiple={props.multiple}
        accept={props.accept}
        hidden
      />
      {['file', 'file-input'].includes(theme) && !props.draggable && getNormalFileNode()}
      {['file', 'image'].includes(theme) && props.draggable && getSingleFileDraggerUploadNode()}
      {theme === 'image' && !props.draggable && getImageCardUploadNode()}
      {['image-flow', 'file-flow'].includes(theme) && getFlowListNode()}
      {theme === 'custom' && getCustomFile()}
      {props.tips && (
        <small className={classNames([tipsClasses, { [`${classPrefix}-upload__tips-${props.status}`]: props.status }])}>
          {props.tips}
        </small>
      )}

      {sizeOverLimitMessage && <small className={classNames(errorClasses)}>{sizeOverLimitMessage}</small>}
    </div>
  );
}

export type UploadOuterForwardRef = {
  <T>(props: UploadProps<T> & { ref?: ForwardedRef<UploadRef> }): ReturnType<typeof TdUpload>;
} & React.ForwardRefExoticComponent<UploadProps>;

const Upload = forwardRef(TdUpload) as UploadOuterForwardRef;

Upload.displayName = 'Upload';
Upload.defaultProps = uploadDefaultProps;

export default Upload;
