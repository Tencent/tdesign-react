import React, { forwardRef } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import type { UploadProps } from './types';
import NormalFile from './NormalFile';
import DraggerFile from './DraggerFile';
import useUpload from './useUpload';
import Button from '../button';
import { TdUploadProps } from './type';
import { uploadDefaultProps } from './defaultProps';
import { CommonDisplayFileProps } from './interface';

const Upload = forwardRef((props: UploadProps, ref) => {
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
      const localeFromProps = props.locale as TdUploadProps['locale'];
      if (props.theme === 'file-input') {
        return (
          <Button variant="outline" {...props.triggerButtonProps}>
            {localeFromProps?.triggerUploadText?.fileInput || locale.triggerUploadText.fileInput}
          </Button>
        );
      }
      return (
        <Button variant="outline" icon={<UploadIcon />} {...props.triggerButtonProps}>
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
    theme: props.theme,
    placeholder: props.placeholder,
    tips: props.tips,
    sizeOverLimitMessage,
    classPrefix,
    tipsClasses,
    errorClasses,
    locale,
    autoUpload: props.autoUpload,
    fileListDisplay: props.fileListDisplay,
    onRemove,
  };

  const NormalFileNode = (
    <NormalFile {...commonDisplayFileProps}>
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </NormalFile>
  );

  const SingleFileDraggerUpload = (
    <DraggerFile
      {...commonDisplayFileProps}
      trigger={props.trigger}
      cancelUpload={cancelUpload}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
      onDragFileChange={onDragFileChange}
    />
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
      {['file', 'file-input'].includes(props.theme) && !props.draggable && NormalFileNode}
      {['file', 'image'].includes(props.theme) && props.draggable && SingleFileDraggerUpload}
    </div>
  );
});

Upload.displayName = 'Upload';

Upload.defaultProps = uploadDefaultProps;

export default Upload;
