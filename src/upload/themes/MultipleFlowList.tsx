import React, { MouseEvent, useMemo, useState } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  TimeFilledIcon as TdTimeFilledIcon,
  FileExcelIcon as TdFileExcelIcon,
  FilePdfIcon as TdFilePdfIcon,
  FileWordIcon as TdFileWordIcon,
  FilePowerpointIcon as TdFilePowerpointIcon,
  FileIcon as TdFileIcon,
  VideoIcon as TdVideoIcon,
} from 'tdesign-icons-react';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import TButton, { ButtonProps } from '../../button';
import { UploadFile, TdUploadProps } from '../type';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import {
  abridgeName,
  returnFileSize,
  IMAGE_REGEXP,
  FILE_PDF_REGEXP,
  FILE_EXCEL_REGEXP,
  FILE_WORD_REGEXP,
  FILE_PPT_REGEXP,
  VIDEO_REGEXP,
} from '../../_common/js/upload/utils';
import TLoading from '../../loading';
import Link from '../../link';
import parseTNode from '../../_util/parseTNode';
import Image from '../../image';

export interface ImageFlowListProps extends CommonDisplayFileProps {
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file?: UploadFile }) => void;
  dragEvents: UploadDragEvents;
  disabled?: boolean;
  isBatchUpload?: boolean;
  draggable?: boolean;
  showThumbnail?: boolean;
  onPreview?: TdUploadProps['onPreview'];
  uploadButton?: TdUploadProps['uploadButton'];
  cancelUploadButton?: TdUploadProps['cancelUploadButton'];
  showImageFileName?: boolean;
}

const ImageFlowList = (props: ImageFlowListProps) => {
  const { draggable = true, accept, showThumbnail, cancelUploadButton, uploadButton, onPreview } = props;
  // locale 已经在 useUpload 中统一处理优先级
  const { locale, uploading, disabled, displayFiles, classPrefix } = props;
  const uploadPrefix = `${classPrefix}-upload`;

  const [currentPreviewFile, setCurrentPreviewFile] = useState<UploadFile[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const {
    BrowseIcon,
    DeleteIcon,
    CheckCircleFilledIcon,
    ErrorCircleFilledIcon,
    TimeFilledIcon,
    FileExcelIcon,
    FilePdfIcon,
    FileWordIcon,
    FilePowerpointIcon,
    FileIcon,
    VideoIcon,
  } = useGlobalIcon({
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    TimeFilledIcon: TdTimeFilledIcon,
    FileExcelIcon: TdFileExcelIcon,
    FilePdfIcon: TdFilePdfIcon,
    FileWordIcon: TdFileWordIcon,
    FilePowerpointIcon: TdFilePowerpointIcon,
    FileIcon: TdFileIcon,
    VideoIcon: TdVideoIcon,
  });

  const drag = useDrag({ ...props.dragEvents, accept });

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

  const browseIconClick = ({
    e,
    index,
    file,
    viewFiles,
  }: {
    e: MouseEvent<HTMLDivElement>;
    index: number;
    file: UploadFile;
    viewFiles: UploadFile[];
  }) => {
    setPreviewIndex(index);
    setCurrentPreviewFile(viewFiles);
    onPreview?.({ file, index, e });
  };

  const previewIndexChange = (index: number) => {
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setCurrentPreviewFile([]);
  };

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
    const fileName = props.abridgeName && file.name ? abridgeName(file.name, ...props.abridgeName) : file.name;
    return (
      <li className={`${uploadPrefix}__card-item`} key={file.name + index + file.percent + file.status}>
        <div
          className={classNames([
            `${uploadPrefix}__card-content`,
            { [`${classPrefix}-is-bordered`]: file.status !== 'waiting' },
          ])}
        >
          {['fail', 'progress'].includes(file.status) && (
            <div
              className={classNames([
                `${uploadPrefix}__card-status-wrap`,
                `${uploadPrefix}__${props.theme}-${file.status}`,
              ])}
            >
              {iconMap[file.status as 'fail' | 'progress']}
              <p>{textMap[file.status as 'fail' | 'progress']}</p>
            </div>
          )}
          {(['waiting', 'success'].includes(file.status) || (!file.status && file.url)) && (
            <Image className={`${uploadPrefix}__card-image`} src={file.url || file.raw} error="" loading="" />
          )}
          <div className={`${uploadPrefix}__card-mask`}>
            {(file.url || file.raw) && !['progress', 'fail'].includes(file.status) && (
              <span className={`${uploadPrefix}__card-mask-item`}>
                <BrowseIcon
                  onClick={(event) => {
                    const e = event.type ? event : event.e;
                    browseIconClick({
                      e,
                      index,
                      file,
                      viewFiles: displayFiles,
                    });
                  }}
                />
                <span className={`${uploadPrefix}__card-mask-item-divider`}></span>
              </span>
            )}
            {!disabled && (
              <span
                className={`${uploadPrefix}__card-mask-item ${uploadPrefix}__delete`}
                onClick={(e) => props.onRemove({ e, index, file })}
              >
                <DeleteIcon />
              </span>
            )}
          </div>
        </div>
        {props.showImageFileName && (
          <p className={classNames([`${uploadPrefix}__card-name`, `${uploadPrefix}__flow-status`])}>
            {['success', 'waiting'].includes(file.status) && iconMap[file.status]}
            {fileName}
          </p>
        )}
      </li>
    );
  };

  const renderStatus = (file: UploadFile) => {
    const { iconMap, textMap } = getStatusMap();
    return (
      <div className={`${uploadPrefix}__flow-status`}>
        {iconMap[file.status]}
        <span className={`${uploadPrefix}__${props.theme}-${file.status}`}>
          {file.response?.error ? file.response.error || textMap[file.status] : textMap[file.status]}
          {props.showUploadProgress && file.status === 'progress' ? ` ${file.percent || 0}%` : ''}
        </span>
      </div>
    );
  };

  const renderNormalActionCol = (file: UploadFile, index: number) => (
    <td>
      <Link
        theme="primary"
        hover="color"
        className={`${uploadPrefix}__delete`}
        onClick={(e) => props.onRemove({ e, index, file })}
      >
        {locale?.triggerUploadText?.delete}
      </Link>
    </td>
  );

  function getFileThumbnailIcon(fileType: string) {
    if (FILE_PDF_REGEXP.test(fileType)) {
      return <FilePdfIcon />;
    }
    if (FILE_EXCEL_REGEXP.test(fileType)) {
      return <FileExcelIcon />;
    }
    if (FILE_WORD_REGEXP.test(fileType)) {
      return <FileWordIcon />;
    }
    if (FILE_PPT_REGEXP.test(fileType)) {
      return <FilePowerpointIcon />;
    }
    if (VIDEO_REGEXP.test(fileType)) {
      return <VideoIcon />;
    }
    return <FileIcon />;
  }

  function renderFileThumbnail(file: UploadFile) {
    if (!file || (!file.raw && file.url)) return null;
    const fileType = file.raw.type;
    const className = `${uploadPrefix}__file-thumbnail`;
    if (IMAGE_REGEXP.test(fileType) && (file.url || file.raw)) {
      return (
        <Image
          className={className}
          src={file.url || file.raw}
          fit="scale-down"
          error=""
          loading=""
          onClick={(e) => {
            e.preventDefault();
            browseIconClick({
              e,
              index: 0,
              file,
              viewFiles: [file],
            });
          }}
        />
      );
    }
    return <div className={className}>{getFileThumbnailIcon(fileType)}</div>;
  }

  // batchUpload action col
  const renderBatchActionCol = (index: number) =>
    // 第一行数据才需要合并单元格
    index === 0 ? (
      <td rowSpan={displayFiles.length} className={`${uploadPrefix}__flow-table__batch-row`}>
        <Link
          theme="primary"
          hover="color"
          className={`${uploadPrefix}__delete`}
          onClick={(e) => props.onRemove({ e, index: -1, file: undefined })}
        >
          {locale?.triggerUploadText?.delete}
        </Link>
      </td>
    ) : null;

  const renderFileList = () => {
    if (props.fileListDisplay === null) return null;
    if (props.fileListDisplay) {
      return parseTNode(props.fileListDisplay, {
        cancelUpload: props.cancelUpload,
        uploadFiles: props.uploadFiles,
        onPreview: props.onPreview,
        onRemove: props.onRemove,
        toUploadFiles: props.toUploadFiles,
        sizeOverLimitMessage: props.sizeOverLimitMessage,
        locale: props.locale,
        files: displayFiles,
        dragEvents: innerDragEvents,
      });
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
              showBatchUploadAction && displayFiles.every((item) => item.status === 'success' || !item.status)
                ? renderBatchActionCol(index)
                : renderNormalActionCol(file, index);
            const fileName = props.abridgeName?.length ? abridgeName(file.name, ...props.abridgeName) : file.name;
            const thumbnailNode = showThumbnail ? (
              <div className={`${uploadPrefix}__file-info`}>
                {renderFileThumbnail(file)}
                {fileName}
              </div>
            ) : (
              fileName
            );
            const fileNameNode = file.url ? (
              <Link href={file.url} target="_blank" hover="color">
                {thumbnailNode}
              </Link>
            ) : (
              thumbnailNode
            );
            return (
              <tr key={file.name + index}>
                <td className={`${uploadPrefix}__file-name`}>{fileNameNode}</td>
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

  const renderImageList = () => {
    if (props.fileListDisplay) {
      return parseTNode(props.fileListDisplay, {
        ...props,
        files: displayFiles,
        dragEvents: innerDragEvents,
      });
    }
    return (
      <ul className={`${uploadPrefix}__card clearfix`}>
        {displayFiles.map((file, index) => renderImgItem(file, index))}
      </ul>
    );
  };

  const renderCancelUploadButton = () => {
    if (cancelUploadButton === null) return null;
    if (isFunction(cancelUploadButton)) return parseTNode(cancelUploadButton);
    const cancelButtonProps = (isObject(cancelUploadButton) ? cancelUploadButton : undefined) as ButtonProps;
    return (
      <TButton
        theme="default"
        disabled={disabled || !uploading}
        className={`${uploadPrefix}__cancel`}
        onClick={(e) => props.cancelUpload?.({ e })}
        {...cancelButtonProps}
      >
        {locale?.cancelUploadText}
      </TButton>
    );
  };

  const renderUploadButton = () => {
    if (uploadButton === null) return null;
    if (isFunction(uploadButton)) return parseTNode(uploadButton);
    const uploadButtonProps = (isObject(uploadButton) ? uploadButton : undefined) as ButtonProps;
    return (
      <TButton
        disabled={disabled || uploading || !displayFiles.length}
        theme="primary"
        loading={uploading}
        className={`${uploadPrefix}__continue`}
        onClick={() => props.uploadFiles?.()}
        {...uploadButtonProps}
      >
        {uploadText}
      </TButton>
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
          {displayFiles.length ? renderImageList() : renderEmpty()}
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
          {renderCancelUploadButton()}

          {renderUploadButton()}
        </div>
      )}

      <ImageViewer
        images={currentPreviewFile.map((t) => t.url || t.raw)}
        visible={!!currentPreviewFile.length}
        onClose={closePreview}
        index={previewIndex}
        onIndexChange={previewIndexChange}
        {...props.imageViewerProps}
      ></ImageViewer>
    </div>
  );
};

ImageFlowList.displayName = 'ImageFlowList';

export default ImageFlowList;
