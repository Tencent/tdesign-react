import React, { DragEvent, FC, useState } from 'react';
import classNames from 'classnames';
import { TNode } from '../common';
import { TriggerContext, UploadFile, UploadRemoveContext } from './type';
import { CustomDraggerRenderProps } from './types';
import { UploadConfig } from '../config-provider/type';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import DraggerProgress from './themes/dragger-progress';

export interface DraggerProps {
  file?: UploadFile;
  display?: string;
  trigger?: string | TNode<TriggerContext>;
  localeFromProps?: UploadConfig;
  customDraggerRender?: (props: CustomDraggerRenderProps) => TNode;
  onCancel?: () => void;
  onTrigger?: () => void;
  onRemove?: (context: UploadRemoveContext) => void;
  onUpload?: (uploadFile: UploadFile) => void;
  onChange?: (files: FileList) => void;
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
}

const Dragger: FC<DraggerProps> = (props) => {
  const { file, display, onUpload, onRemove, customDraggerRender, onCancel, localeFromProps } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');
  const [dragActive, setDragActive] = useState(false);
  const target = React.useRef();
  const { draggingText, dragDropText } = locale.dragger;
  const dragTriggerText = localeFromProps?.triggerUploadText?.normal || t(locale.triggerUploadText.normal);
  const classes = classNames(
    `${classPrefix}-upload__dragger`,
    !file ? `${classPrefix}-upload__dragger-center` : '',
    file?.status === 'fail' ? `${classPrefix}-upload__dragger-error` : '',
  );

  const defaultDragElement = React.useMemo(() => {
    const unActiveElement = (
      <div>
        <span className={`${classPrefix}-upload--highlight`}>{dragTriggerText}</span>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;{t(draggingText)}</span>
      </div>
    );
    const activeElement = <div>{t(dragDropText)}</div>;
    return dragActive ? activeElement : unActiveElement;
  }, [classPrefix, dragActive, dragDropText, dragTriggerText, draggingText, t]);

  const dragElement = React.useMemo(() => {
    let content: React.ReactNode;
    if (file && display !== 'custom') {
      content = (
        <DraggerProgress
          onRemove={onRemove}
          display={display}
          onTrigger={props.onTrigger}
          file={file}
          onUpload={() => {
            onUpload?.(file);
          }}
          onCancel={onCancel}
          localeFromProps={localeFromProps}
        />
      );
    } else {
      content = (
        <div className={`${classPrefix}-upload__trigger`} onClick={props.onTrigger}>
          {customDraggerRender?.({ dragActive }) || defaultDragElement}
        </div>
      );
    }

    return content;
  }, [
    file,
    display,
    onRemove,
    props.onTrigger,
    onCancel,
    onUpload,
    classPrefix,
    customDraggerRender,
    dragActive,
    defaultDragElement,
    localeFromProps,
  ]);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    props.onChange?.(event.dataTransfer.files);
    props.onDrop?.(event);
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
