import React, { DragEvent, FC, MouseEvent, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import { abridgeName, getFileSizeText, getCurrentDate } from '../_common/js/upload/utils';
import { TdUploadProps, UploadFile } from './type';
import Button from '../button';
import { CommonDisplayFileProps } from './interface';
import useCommonClassName from '../hooks/useCommonClassName';
import TLoading from '../loading';

export interface DraggerProps extends CommonDisplayFileProps {
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: () => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file: UploadFile }) => void;
  onDragFileChange?: (e: DragEvent) => void;
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
}

const DraggerFile: FC<DraggerProps> = (props) => {
  const { displayFiles, locale } = props;
  const [target, setTarget] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const draggerFileRef = useRef();

  const { SIZE } = useCommonClassName();

  const uploadPrefix = `${props.classPrefix}-upload`;

  const classes = useMemo(
    () => [
      `${uploadPrefix}__dragger`,
      { [`${uploadPrefix}__dragger-center`]: !displayFiles[0] },
      { [`${uploadPrefix}__dragger-error`]: displayFiles[0]?.status === 'fail' },
    ],
    [displayFiles, uploadPrefix],
  );

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    props.onDragFileChange?.(event);
    props.onDrop?.(event);
    setDragActive(false);
  };

  const handleDragenter = (event: DragEvent) => {
    event.preventDefault();
    setTarget(event.target);
    props.onDragenter?.(event);
    setDragActive(true);
  };

  const handleDragleave = (event: DragEvent) => {
    if (event.target !== target) return;
    event.preventDefault();
    props.onDragleave?.(event);
    setDragActive(false);
  };

  const handleDragover = (event: DragEvent) => {
    event.preventDefault();
  };

  const renderImage = () => {
    const file = displayFiles[0];
    if (!file) return null;
    return <div className={`${uploadPrefix}__dragger-img-wrap`}>{file.url && <img src={file.url} />}</div>;
  };

  const renderUploading = () => {
    const file = displayFiles[0];
    if (!file) return null;
    if (file.status === 'progress') {
      return (
        <div className={`${uploadPrefix}__single-progress`}>
          <TLoading />
          <span className={`${uploadPrefix}__single-percent`}>{file.percent}%</span>
        </div>
      );
    }
  };

  const renderMainPreivew = () => {
    const file = displayFiles[0];
    if (!file) return null;
    return (
      <div className={`${uploadPrefix}__dragger-progress`}>
        {props.theme === 'image' && renderImage()}
        <div className={`${uploadPrefix}__dragger-progress-info`}>
          <div className={`${uploadPrefix}__dragger-text`}>
            <span className={`${uploadPrefix}__single-name`}>{abridgeName(file.name)}</span>
            {file.status === 'progress' && renderUploading()}
            {file.status === 'success' && <CheckCircleFilledIcon />}
            {file.status === 'fail' && <ErrorCircleFilledIcon />}
          </div>
          <small className={`${SIZE.small}`}>
            {locale.file.fileSizeText}：{getFileSizeText(file.size)}
          </small>
          <small className={`${SIZE.small}`}>
            {locale.file.fileOperationDateText}：{getCurrentDate()}
          </small>
          <div className={`${uploadPrefix}__dragger-btns`}>
            {['progress', 'waiting'].includes(file.status) && (
              <Button
                theme="primary"
                variant="text"
                className={`${uploadPrefix}__dragger-progress-cancel`}
                onClick={(e) =>
                  props.cancelUpload?.({
                    e,
                    file: props.toUploadFiles[0] || props.files[0],
                  })
                }
              >
                {locale?.cancelUploadText}
              </Button>
            )}
            {!props.autoUpload && file.status === 'waiting' && (
              <Button variant="text" theme="primary" onClick={() => props.uploadFiles?.()}>
                {locale.triggerUploadText.normal}
              </Button>
            )}
          </div>
          {['fail', 'success'].includes(file?.status) && (
            <div className={`${uploadPrefix}__dragger-btns`}>
              <Button
                theme="primary"
                variant="text"
                className={`${uploadPrefix}__dragger-progress-cancel`}
                onClick={props.triggerUpload}
              >
                {locale.triggerUploadText.reupload}
              </Button>
              <Button theme="danger" variant="text" onClick={(e) => props.onRemove({ e, index: 0, file })}>
                {locale.triggerUploadText.delete}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDefaultDragElement = () => {
    const unActiveElement = (
      <div>
        <span className={`${uploadPrefix}--highlight`}>
          {locale.triggerUploadText?.normal || locale.triggerUploadText.normal}
        </span>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;{locale.dragger.draggingText}</span>
      </div>
    );
    const activeElement = <div>{locale.dragger.dragDropText}</div>;
    return dragActive ? activeElement : unActiveElement;
  };

  const getContent = () => {
    const file = displayFiles[0];
    if (file && ['progress', 'success', 'fail', 'waiting'].includes(file.status)) {
      return renderMainPreivew();
    }
    return (
      <div className={`${uploadPrefix}__trigger`} onClick={props.triggerUpload}>
        {props.children || renderDefaultDragElement()}
      </div>
    );
  };

  return (
    <div
      ref={draggerFileRef}
      className={classNames(classes)}
      onDrop={handleDrop}
      onDragEnter={handleDragenter}
      onDragOver={handleDragover}
      onDragLeave={handleDragleave}
    >
      {props.trigger?.({ displayFiles, dragActive }) || getContent()}
    </div>
  );
};

DraggerFile.displayName = 'DraggerFile';

export default DraggerFile;
