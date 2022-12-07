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
import { UploadFile, TdUploadProps } from '../type';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import { abridgeName, returnFileSize } from '../../_common/js/upload/utils';
import TLoading from '../../loading';
import Link from '../../link';

export interface ImageFlowListProps extends CommonDisplayFileProps {
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file?: UploadFile }) => void;
  dragEvents: UploadDragEvents;
  disabled?: boolean;
  isBatchUpload?: boolean;
  draggable?: boolean;
  onPreview?: TdUploadProps['onPreview'];
}

const ImageFlowList = (props: ImageFlowListProps) => {
  const { draggable = true } = props;
  // locale 已经在 useUpload 中统一处理优先级
  const { locale, uploading, disabled, displayFiles, classPrefix } = props;
  const uploadPrefix = `${classPrefix}-upload`;

  const { BrowseIcon, DeleteIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, TimeFilledIcon } = useGlobalIcon({
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    TimeFilledIcon: TdTimeFilledIcon,
  });

  const drag = useDrag(props.dragEvents);

  const uploadText = useMemo(() => {
    if (uploading) return `${locale.progress.uploadingText}`;
    return locale.triggerUploadText.normal;
  }, [locale, uploading]);

  const innerDragEvents = draggable
    ? {
        onDrop: drag.handleDrop,
        onDragEnter: drag.handleDragenter,
        onDragOver: drag.handleDragover,
        onDragLeave: drag.handleDragleave,
      }
    : {};

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

  const renderEmpty = () => (
    <div className={`${uploadPrefix}__flow-empty`}>
      {drag.dragActive ? locale.dragger.dragDropText : locale.dragger.clickAndDragText}
    </div>
  );

  const renderImgItem = (file: UploadFile, index: number) => {
    const { iconMap, textMap } = getStatusMap();
    return (
      <li className={`${uploadPrefix}__card-item`} key={file.name + index + file.percent + file.status}>
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
                  trigger={({ onOpen }) => (
                    <BrowseIcon
                      onClick={(e) => {
                        props.onPreview?.({ file, index, e });
                        onOpen();
                      }}
                    />
                  )}
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

  const renderStatus = (file: UploadFile) => {
    const { iconMap, textMap } = getStatusMap();
    return (
      <div className={`${uploadPrefix}__flow-status`}>
        {iconMap[file.status]}
        <span>
          {textMap[file.status]}
          {file.status === 'progress' ? ` ${file.percent}%` : ''}
        </span>
      </div>
    );
  };

  const renderNormalActionCol = (file: UploadFile, index: number) => (
    <td>
      <TButton theme="primary" variant="text" onClick={(e: MouseEvent) => props.onRemove({ e, index, file })}>
        {locale?.triggerUploadText?.delete}
      </TButton>
    </td>
  );

  // batchUpload action col
  const renderBatchActionCol = (index: number) =>
    // 第一行数据才需要合并单元格
    index === 0 ? (
      <td rowSpan={displayFiles.length} className={`${uploadPrefix}__flow-table__batch-row`}>
        <TButton
          theme="primary"
          variant="text"
          onClick={(e: MouseEvent) => props.onRemove({ e, index: -1, file: null })}
        >
          {locale?.triggerUploadText?.delete}
        </TButton>
      </td>
    ) : null;

  const renderFileList = () => {
    if (props.fileListDisplay) {
      const list = props.fileListDisplay({
        files: displayFiles,
        dragEvents: innerDragEvents,
      });
      return list;
    }
    return (
      <table className={`${uploadPrefix}__flow-table`} {...innerDragEvents}>
        <thead>
          <tr>
            <th>{locale.file?.fileNameText}</th>
            <th>{locale.file?.fileSizeText}</th>
            <th>{locale.file?.fileStatusText}</th>
            {disabled ? null : <th>{locale.file?.fileOperationText}</th>}
          </tr>
        </thead>
        <tbody>
          {!displayFiles.length && (
            <tr>
              <td colSpan={4}>{renderEmpty()}</td>
            </tr>
          )}
          {displayFiles.map((file, index) => {
            // 合并操作出现条件为：当前为合并上传模式且列表内没有待上传文件
            const showBatchUploadAction = props.isBatchUpload;
            const deleteNode =
              showBatchUploadAction && !displayFiles.find((item) => item.status !== 'success')
                ? renderBatchActionCol(index)
                : renderNormalActionCol(file, index);
            const fileName = props.abridgeName?.length ? abridgeName(file.name, ...props.abridgeName) : file.name;
            return (
              <tr key={file.name + index}>
                <td>
                  {file.url ? (
                    <Link href={file.url} target="_blank" hover="color">
                      {fileName}
                    </Link>
                  ) : (
                    fileName
                  )}
                </td>
                <td>{returnFileSize(file.size)}</td>
                <td>{renderStatus(file)}</td>
                {disabled ? null : deleteNode}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const cardClassName = `${uploadPrefix}__flow-card-area`;
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

      {props.theme === 'image-flow' && (
        <div className={cardClassName} {...innerDragEvents}>
          {displayFiles.length ? (
            <ul className={`${uploadPrefix}__card clearfix`}>
              {displayFiles.map((file, index) => renderImgItem(file, index))}
            </ul>
          ) : (
            renderEmpty()
          )}
        </div>
      )}

      {props.theme === 'file-flow' &&
        (displayFiles.length ? (
          renderFileList()
        ) : (
          <div className={cardClassName} {...innerDragEvents}>
            {renderEmpty()}
          </div>
        ))}

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
