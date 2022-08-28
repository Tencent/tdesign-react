import React, { forwardRef } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import type { UploadProps } from './types';
import NormalFile from './NormalFile';
import useUpload from './useUpload';
import Button from '../button';
import { TdUploadProps } from './type';
import { uploadDefaultProps } from './defaultProps';

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
    onFileChange,
    triggerUpload,
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
          <Button variant="outline">
            {localeFromProps?.triggerUploadText?.fileInput || locale.triggerUploadText.fileInput}
          </Button>
        );
      }
      return (
        <Button variant="outline" icon={<UploadIcon />}>
          {triggerUploadText}
        </Button>
      );
    };
    return props.trigger || props.children || getDefaultTrigger();
  };

  const triggerElement = renderTrigger();

  const NormalFileNode = (
    <NormalFile
      files={uploadValue}
      toUploadFiles={toUploadFiles}
      displayFiles={displayFiles}
      theme={props.theme}
      placeholder={props.placeholder}
      global={locale}
      tips={props.tips}
      sizeOverLimitMessage={sizeOverLimitMessage}
      classPrefix={classPrefix}
      tipsClasses={tipsClasses}
      errorClasses={errorClasses}
      fileListDisplay={props.fileListDisplay}
      autoUpload={props.autoUpload}
      onRemove={onRemove}
    >
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
        {!!(props.theme === 'file-input' && uploadValue?.length) && (
          <Button theme="primary" variant="text" onClick={(e) => onRemove({ e, file: uploadValue[0], index: 0 })}>
            删除
          </Button>
        )}
      </div>
    </NormalFile>
  );

  return (
    <div className={classNames([props.className, `${classPrefix}-upload`])} style={props.style}>
      <input
        ref={inputRef}
        type="file"
        disabled={disabled}
        onChange={onFileChange}
        multiple={props.multiple}
        accept={props.accept}
        hidden
      />
      {['file', 'file-input'].includes(props.theme) && NormalFileNode}
    </div>
  );
});

Upload.displayName = 'Upload';

Upload.defaultProps = uploadDefaultProps;

export default Upload;
