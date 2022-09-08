import React, { MouseEvent, useMemo } from 'react';
import classNames from 'classnames';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  TimeFilledIcon as TdTimeFilledIcon,
} from 'tdesign-icons-react';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import TButton from '../../button';
import { UploadFile } from '../type';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import { abridgeName } from '../../_common/js/upload/utils';
import TLoading from '../../loading';

export interface ImageFlowListProps extends CommonDisplayFileProps {
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file?: UploadFile }) => void;
  dragEvents: UploadDragEvents;
  disabled?: boolean;
}

const ImageFlowList = (props: ImageFlowListProps) => {
  // locale 已经在 useUpload 中统一处理优先级
  const { locale, uploading, disabled, displayFiles, classPrefix } = props;
  const uploadPrefix = `${props.classPrefix}-upload`;

  const { BrowseIcon, DeleteIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, TimeFilledIcon } = useGlobalIcon({
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    TimeFilledIcon: TdTimeFilledIcon,
  });

  const drag = useDrag(props.dragEvents);
  const { dragActive } = drag;

  const uploadText = useMemo(() => {
    if (uploading) return `${locale.progress.uploadingText}`;
    return locale.triggerUploadText.normal;
  }, [locale, uploading]);

  const getStatusMap = () => {
    const iconMap = {
      success: <CheckCircleFilledIcon />,
      fail: <ErrorCircleFilledIcon />,
      progress: <TLoading />,
      waiting: <TimeFilledIcon />,
    };
    const textMap = {
      success: locale.progress?.successText,
      fail: locale.progress?.failText,
      progress: locale.progress?.uploadingText,
      waiting: locale.progress?.waitingText,
    };
    return {
      iconMap,
      textMap,
    };
  };

  const renderImgItem = (file: UploadFile, index: number) => {
    const { iconMap, textMap } = getStatusMap();
    return (
      <li className={`${uploadPrefix}__card-item`} key={file.name + index}>
        <div
          className={classNames([
            `${uploadPrefix}__card-content`,
            { [`${classPrefix}-is-bordered`]: file.status !== 'waiting' },
          ])}
        >
          {['fail', 'progress'].includes(file.status) && (
            <div className={`${uploadPrefix}__card-status-wrap`}>
              {iconMap[file.status as 'fail' | 'progress']}
              <p>{textMap[file.status as 'fail' | 'progress']}</p>
            </div>
          )}
          {(['waiting', 'success'].includes(file.status) || (!file.status && file.url)) && (
            <img
              className={`${uploadPrefix}__card-image`}
              src={file.url || '//tdesign.gtimg.com/tdesign-default-img.png'}
            />
          )}
          <div className={`${uploadPrefix}__card-mask`}>
            {file.url && (
              <span className={`${uploadPrefix}__card-mask-item`}>
                <ImageViewer
                  trigger={({ onOpen }) => <BrowseIcon onClick={onOpen} />}
                  images={displayFiles.map((t) => t.url)}
                  defaultIndex={index}
                />
                <span className={`${uploadPrefix}__card-mask-item-divider`}></span>
              </span>
            )}
            {!disabled && (
              <span
                className={`${uploadPrefix}__card-mask-item`}
                onClick={(e: MouseEvent) => props.onRemove({ e, index, file })}
              >
                <DeleteIcon />
              </span>
            )}
          </div>
        </div>
        <p className={`${uploadPrefix}__card-name`}>{abridgeName(file.name)}</p>
      </li>
    );
  };

  return (
    <div className={`${uploadPrefix}__flow ${uploadPrefix}__flow-${props.theme}`}>
      <div className={`${uploadPrefix}__flow-op`}>
        {props.children}
        {props.placeholder && (
          <small className={`${uploadPrefix}__flow-placeholder ${uploadPrefix}__placeholder`}>
            {props.placeholder}
          </small>
        )}
      </div>

      <div
        className={`${uploadPrefix}__flow-card-area`}
        onDrop={drag.handleDrop}
        onDragEnter={drag.handleDragenter}
        onDragOver={drag.handleDragover}
        onDragLeave={drag.handleDragleave}
      >
        {!displayFiles.length && (
          <div className={`${uploadPrefix}__flow-empty`}>
            {dragActive ? locale.dragger.dragDropText : locale.dragger.clickAndDragText}
          </div>
        )}
        {!!displayFiles.length && (
          <ul className={`${uploadPrefix}__card clearfix`}>
            {displayFiles.map((file, index) => renderImgItem(file, index))}
          </ul>
        )}
      </div>

      {!props.autoUpload && (
        <div className={`${uploadPrefix}__flow-bottom`}>
          <TButton theme="default" onClick={(e) => props.cancelUpload?.({ e })} disabled={disabled || !uploading}>
            {locale?.cancelUploadText}
          </TButton>
          <TButton
            disabled={disabled || uploading || !displayFiles.length}
            theme="primary"
            loading={uploading}
            onClick={() => props.uploadFiles?.()}
          >
            {uploadText}
          </TButton>
        </div>
      )}
    </div>
  );
};

ImageFlowList.displayName = 'ImageFlowList';

export default ImageFlowList;
