import React, { FC, MouseEvent, useMemo, useRef } from 'react';
import classNames from 'classnames';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import { abridgeName, getFileSizeText } from '@tdesign/common-js/upload/utils';
import { TdUploadProps, UploadFile } from '../type';
import Link from '../../link';
import { CommonDisplayFileProps } from '../interface';
import useCommonClassName from '../../hooks/useCommonClassName';
import TLoading from '../../loading';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { parseContentTNode } from '../../_util/parseTNode';
import Image from '../../image';

export interface DraggerProps extends CommonDisplayFileProps {
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: () => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file: UploadFile }) => void;
  dragEvents: UploadDragEvents;
}

const DraggerFile: FC<DraggerProps> = (props) => {
  const { displayFiles, locale, disabled, trigger, accept } = props;

  const { SIZE } = useCommonClassName();
  const uploadPrefix = `${props.classPrefix}-upload`;

  const drag = useDrag({ ...props.dragEvents, accept });
  const { dragActive } = drag;

  const draggerFileRef = useRef(null);

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
    const url = file?.url || file?.response?.url;
    return (
      <div className={`${uploadPrefix}__dragger-img-wrap`}>
        <ImageViewer
          images={[url]}
          trigger={({ open }) => <Image src={url || file.raw} onClick={open} />}
          {...props.imageViewerProps}
        ></ImageViewer>
      </div>
    );
  };

  const renderUploading = () => {
    const file = displayFiles[0];
    if (file?.status === 'progress') {
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
    const fileName = props.abridgeName ? abridgeName(file.name, ...props.abridgeName) : file.name;
    const fileInfo = (
      <>
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
      </>
    );
    return (
      <div className={`${uploadPrefix}__dragger-progress`}>
        {props.theme === 'image' && renderImage()}
        <div className={`${uploadPrefix}__dragger-progress-info`}>
          {props.fileListDisplay ? parseContentTNode(props.fileListDisplay, { files: displayFiles }) : fileInfo}
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
                className={`${uploadPrefix}__dragger-progress-reupload`}
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
    if (file && (['progress', 'success', 'fail', 'waiting'].includes(file.status) || !file.status)) {
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
      {parseContentTNode?.(trigger, { files: displayFiles, dragActive }) || getContent()}
    </div>
  );
};

DraggerFile.displayName = 'DraggerFile';

export default DraggerFile;
