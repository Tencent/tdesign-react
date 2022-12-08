import React, { FC, MouseEvent, useMemo, useRef } from 'react';
import classNames from 'classnames';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import { abridgeName, getFileSizeText } from '../../_common/js/upload/utils';
import { TdUploadProps, UploadFile } from '../type';
import Link from '../../link';
import { CommonDisplayFileProps } from '../interface';
import useCommonClassName from '../../hooks/useCommonClassName';
import TLoading from '../../loading';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';

export interface DraggerProps extends CommonDisplayFileProps {
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: () => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file: UploadFile }) => void;
  dragEvents: UploadDragEvents;
}

const DraggerFile: FC<DraggerProps> = (props) => {
  const { displayFiles, locale, disabled } = props;

  const { SIZE } = useCommonClassName();
  const uploadPrefix = `${props.classPrefix}-upload`;

  const drag = useDrag(props.dragEvents);
  const { dragActive } = drag;

  const draggerFileRef = useRef();

  const { CheckCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });

  const classes = useMemo(
    () => [
      `${uploadPrefix}__dragger`,
      { [`${uploadPrefix}__dragger-center`]: !displayFiles[0] },
      { [`${uploadPrefix}__dragger-error`]: displayFiles[0]?.status === 'fail' },
    ],
    [displayFiles, uploadPrefix],
  );

  const renderImage = () => {
    const file = displayFiles[0];
    if (!file) return null;
    const url = file.url || file.response?.url;
    return (
      <div className={`${uploadPrefix}__dragger-img-wrap`}>
        {url && <ImageViewer images={[url]} trigger={({ onOpen }) => <img src={url} onClick={onOpen} />}></ImageViewer>}
      </div>
    );
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

  const renderMainPreview = () => {
    const file = displayFiles[0];
    if (!file) return null;
    const fileName = props.abridgeName ? abridgeName(file.name, ...props.abridgeName) : file.name;
    return (
      <div className={`${uploadPrefix}__dragger-progress`}>
        {props.theme === 'image' && renderImage()}
        <div className={`${uploadPrefix}__dragger-progress-info`}>
          <div className={`${uploadPrefix}__dragger-text`}>
            <span className={`${uploadPrefix}__single-name`}>{fileName}</span>
            {file.status === 'progress' && renderUploading()}
            {file.status === 'success' && <CheckCircleFilledIcon />}
            {file.status === 'fail' && <ErrorCircleFilledIcon />}
          </div>
          <small className={`${SIZE.small}`}>
            {locale.file.fileSizeText}：{getFileSizeText(file.size)}
          </small>
          <small className={`${SIZE.small}`}>
            {locale.file.fileOperationDateText}：{file.uploadTime || '-'}
          </small>
          <div className={`${uploadPrefix}__dragger-btns`}>
            {['progress', 'waiting'].includes(file.status) && !disabled && (
              <Link
                theme="primary"
                hover="color"
                disabled={disabled}
                className={`${uploadPrefix}__dragger-progress-cancel`}
                onClick={(e) =>
                  props.cancelUpload?.({
                    e,
                    file: props.toUploadFiles[0] || props.files[0],
                  })
                }
              >
                {locale?.cancelUploadText}
              </Link>
            )}
            {!props.autoUpload && file.status === 'waiting' && (
              <Link
                theme="primary"
                hover="color"
                disabled={disabled}
                onClick={() => props.uploadFiles?.()}
                className={`${uploadPrefix}__dragger-upload-btn`}
              >
                {locale.triggerUploadText.normal}
              </Link>
            )}
          </div>
          {['fail', 'success'].includes(file?.status) && !disabled && (
            <div className={`${uploadPrefix}__dragger-btns`}>
              <Link
                theme="primary"
                hover="color"
                disabled={disabled}
                className={`${uploadPrefix}__dragger-progress-cancel`}
                onClick={props.triggerUpload}
              >
                {locale.triggerUploadText.reupload}
              </Link>
              <Link
                theme="danger"
                hover="color"
                disabled={disabled}
                className={`${uploadPrefix}__dragger-delete-btn`}
                onClick={(e) => props.onRemove({ e, index: 0, file })}
              >
                {locale.triggerUploadText.delete}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDefaultDragElement = () => {
    const unActiveElement = (
      <div>
        <span className={`${uploadPrefix}--highlight`}>{locale.triggerUploadText?.normal}</span>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;{locale.dragger.draggingText}</span>
      </div>
    );
    const activeElement = <div>{locale.dragger.dragDropText}</div>;
    return dragActive ? activeElement : unActiveElement;
  };

  const getContent = () => {
    const file = displayFiles[0];
    if (file && ['progress', 'success', 'fail', 'waiting'].includes(file.status)) {
      return renderMainPreview();
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
      onDrop={drag.handleDrop}
      onDragEnter={drag.handleDragenter}
      onDragOver={drag.handleDragover}
      onDragLeave={drag.handleDragleave}
    >
      {props.trigger?.({ files: displayFiles, dragActive }) || getContent()}
    </div>
  );
};

DraggerFile.displayName = 'DraggerFile';

export default DraggerFile;
