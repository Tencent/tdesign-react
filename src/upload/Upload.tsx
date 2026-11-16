import type { MouseEvent, InputHTMLAttributes } from 'react';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  AddIcon,
  CloseCircleIcon,
  CloseIcon,
  LoadingIcon,
  UploadIcon,
  DeleteIcon,
  ErrorCircleFilledIcon,
  File1Icon,
  FileZipFilledIcon,
  FileExcelFilledIcon,
  FilePdfFilledIcon,
  FileWordFilledIcon,
  FilePowerpointFilledIcon,
  VideoFilledIcon,
} from 'tdesign-icons-react';
import classNames from 'classnames';
import { isBoolean } from 'lodash-es';
import type { TdUploadProps, UploadFile } from './type';
import type { StyledProps } from '../common';
import Image from '../image';
import ImageViewer from '../image-viewer';
import Button from '../button';
import useUpload from './hooks/useUpload';
import useDrag from './hooks/useDrag';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import useConfig from '../hooks/useConfig';
import { uploadDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import {
  FILE_PDF_REGEXP,
  FILE_EXCEL_REGEXP,
  FILE_WORD_REGEXP,
  FILE_PPT_REGEXP,
  VIDEO_REGEXP,
  AUDIO_REGEXP,
  returnFileSize,
} from '../_common/js/upload/utils';

export interface UploadProps extends TdUploadProps, StyledProps {}

const FILE_ZIP_REGEXP = /(\.zip|\.rar|\.7z|\.tar|\.gz|\.bz2|\.xz)/i;

// 文件类型图标映射（按顺序匹配）
const FILE_TYPE_ICON_MAP: Array<{
  modifier: string;
  test: (fileType: string, mime: string) => boolean;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { modifier: 'pdf', test: (f) => FILE_PDF_REGEXP.test(f), Icon: FilePdfFilledIcon },
  {
    modifier: 'excel',
    test: (f, m) => FILE_EXCEL_REGEXP.test(f) || /spreadsheetml/i.test(m),
    Icon: FileExcelFilledIcon,
  },
  {
    modifier: 'ppt',
    test: (f, m) => FILE_PPT_REGEXP.test(f) || /presentationml/i.test(m),
    Icon: FilePowerpointFilledIcon,
  },
  {
    modifier: 'word',
    test: (f, m) => FILE_WORD_REGEXP.test(f) || /wordprocessingml/i.test(m),
    Icon: FileWordFilledIcon,
  },
  { modifier: 'media', test: (f) => VIDEO_REGEXP.test(f) || AUDIO_REGEXP.test(f), Icon: VideoFilledIcon },
  { modifier: 'zip', test: (f, m) => FILE_ZIP_REGEXP.test(f) || /zip|compressed/i.test(m), Icon: FileZipFilledIcon },
];

// 用于生成唯一 key
let globalFileKey = 0;
const fileKeyMap = new WeakMap<UploadFile, number>();
const getFileKey = (file: UploadFile): number => {
  if (!fileKeyMap.has(file)) {
    globalFileKey += 1;
    fileKeyMap.set(file, globalFileKey);
  }
  return fileKeyMap.get(file)!;
};

// 计算每个 file 的 removeBtn 是否显示，优先取 file 自身配置
const resolveRemoveBtn = (file: UploadFile, fallback: TdUploadProps['removeBtn']) => {
  const fileRemoveBtn = (file as UploadFile & { removeBtn?: boolean }).removeBtn;
  return isBoolean(fileRemoveBtn) ? fileRemoveBtn : fallback;
};

// 拖拽项通用属性（唯一 key + 触摸事件 + 拖拽中隐藏），grid/list item 共用
type DragItemProps = {
  'data-drag-key'?: string;
  style?: React.CSSProperties;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTouchCancel?: (e: React.TouchEvent) => void;
};

const Upload: React.FC<UploadProps> = (props) => {
  const [showViewer, setShowViewer] = useState(false);
  const [showImageIndex, setShowImageIndex] = useState(0);
  const rootClassName = usePrefixClass('upload');
  const globalConfig = useConfig();
  const {
    onPreview,
    onClickUpload,
    addBtn,
    addContent,
    accept,
    capture,
    className,
    style,
    max,
    multiple,
    imageProps,
    preview,
    theme,
    removeBtn,
    draggable,
  } = useDefaultProps(props, uploadDefaultProps);
  const { displayFiles, inputRef, disabled, isImageFile, onNormalFileChange, onInnerRemove, setUploadValue } =
    useUpload(props);
  const uploadGlobalConfig = globalConfig.upload;

  const {
    dragging,
    sortedFiles,
    cloneVisible,
    cloneStyle,
    cloneFile,
    dragIndex,
    getDragKey,
    syncFiles,
    onTouchstart,
    onTouchmove,
    onTouchend,
    onTouchcancel,
    dragEnded,
  } = useDrag(props, rootClassName, setUploadValue);

  const containerClassName = classNames(
    rootClassName,
    `${rootClassName}--${theme || 'grid'}`,
    {
      [`${rootClassName}--disabled`]: disabled,
      [`${rootClassName}--draggable`]: draggable,
      [`${rootClassName}--dragging`]: draggable && dragging,
    },
    className,
  );

  // 非拖拽状态时，同步 displayFiles 到 sortedFiles
  useEffect(() => {
    syncFiles(displayFiles);
  }, [displayFiles, syncFiles]);

  const previewImgs = displayFiles.filter((item) => isImageFile(item)).map((item) => item.url || '');

  const reachMax = max > 0 && displayFiles.length >= max;

  // 当前展示列表：非拖拽用 displayFiles，拖拽中用排序后的 sortedFiles
  const displayList = dragging && sortedFiles.length > 0 ? sortedFiles : displayFiles;

  // 是否为纯文件项（非图片且无预览图）
  const getIsFileItem = (file: UploadFile) => !isImageFile(file) && !file.url;

  // 当前项是否正在被拖拽
  const isItemDragging = (index: number) => draggable && dragIndex === index;

  // 拖拽项通用属性：唯一 key + 触摸事件 + 拖拽中隐藏，供 grid/list item 复用
  const getDragItemProps = (file: UploadFile, index: number): DragItemProps => {
    if (!draggable) return {};
    return {
      'data-drag-key': getDragKey(file),
      style: isItemDragging(index) ? { opacity: 0 } : undefined,
      onTouchStart: (e) => onTouchstart(e, index),
      onTouchMove: onTouchmove,
      onTouchEnd: onTouchend,
      onTouchCancel: onTouchcancel,
    };
  };

  // 删除文件（grid/list 共用）
  const handleRemove = (e: MouseEvent, file: UploadFile, index: number) => {
    e?.stopPropagation?.();
    onInnerRemove({ e: e as MouseEvent<HTMLDivElement>, file, index });
  };

  const handlePreview = (e: MouseEvent, file: UploadFile, index: number) => {
    if (dragging) return;
    // 拖拽刚结束 300ms 内屏蔽误触预览
    if (dragEnded) return;
    onPreview?.({
      e: e as MouseEvent<HTMLDivElement>,
      file,
      index,
    });
    if (!isImageFile(file)) return;
    const imageIndex = displayFiles.filter((item, i) => isImageFile(item) && i <= index).length - 1;
    setShowImageIndex(Math.max(0, imageIndex));
    setShowViewer(preview);
  };

  const handleImageViewerClose = ({ visible }: { visible: boolean }) => {
    setShowViewer(visible);
  };

  const triggerUpload = (e: MouseEvent) => {
    const input = inputRef.current as HTMLInputElement;
    if (disabled) {
      return;
    }
    input?.click();
    onClickUpload?.({ e: e as MouseEvent<HTMLDivElement> });
  };

  const getFileTypeIcon = (file: UploadFile) => {
    const mime = file.raw?.type || file.type || '';
    const fileType = `${file.name || ''} ${file.url || ''} ${mime}`;
    const baseClass = `${rootClassName}__file-type`;
    const matched = FILE_TYPE_ICON_MAP.find(({ test }) => test(fileType, mime));
    if (matched) {
      const { Icon, modifier } = matched;
      return <Icon className={classNames(baseClass, `${baseClass}--${modifier}`)} />;
    }
    return <File1Icon className={classNames(baseClass, `${baseClass}--other`)} />;
  };

  const renderStatus = (file: UploadFile) => {
    if (file.status !== 'fail' && file.status !== 'progress') {
      return null;
    }
    return (
      <div className={`${rootClassName}__progress-mask`}>
        {file.status === 'progress' ? (
          <>
            <LoadingIcon className={`${rootClassName}__progress-loading`} size="24" />
            <div className={`${rootClassName}__progress-text`}>
              {file.percent ? `${file.percent}%` : uploadGlobalConfig.progress.uploadingText}
            </div>
          </>
        ) : (
          <>
            <CloseCircleIcon className={`${rootClassName}__progress-fail-icon`} size="24" />
            <div className={`${rootClassName}__progress-text`}>{uploadGlobalConfig.progress.failText}</div>
          </>
        )}
      </div>
    );
  };

  const renderAddContent = () => {
    if (!addBtn || reachMax) return null;

    const addBtnNode = parseTNode(addBtn, null, <AddIcon />);
    const addContentNode = parseTNode(addContent, null, addBtnNode);

    return (
      <div className={`${rootClassName}__item ${rootClassName}__item--add`} onClick={triggerUpload}>
        <div className={`${rootClassName}__add-icon`}>{addContentNode}</div>
      </div>
    );
  };

  // grid 项主体内容（图片 / 文件内容 + 状态遮罩），grid item 与拖拽 clone 复用
  const renderGridItemContent = (file: UploadFile) => {
    const showFileContent = getIsFileItem(file) && file.status !== 'progress' && file.status !== 'fail';
    return (
      <>
        {file.url && <Image className={`${rootClassName}__image`} shape="round" {...imageProps} src={file.url} />}
        {showFileContent && (
          <div className={`${rootClassName}__file-content`}>
            <div className={`${rootClassName}__file-icon`}>{getFileTypeIcon(file)}</div>
            <div className={`${rootClassName}__file-name`}>{file.name}</div>
          </div>
        )}
        {renderStatus(file)}
      </>
    );
  };

  const renderGridLayout = () => (
    <>
      {displayList.map((file, index) => {
        const isFileItem = getIsFileItem(file);
        const showRemoveBtn = resolveRemoveBtn(file, removeBtn);
        const showDisabledMask = disabled && !isFileItem && file.status !== 'progress' && file.status !== 'fail';
        return (
          <div
            key={getFileKey(file)}
            className={classNames(`${rootClassName}__item`, {
              [`${rootClassName}__item--file`]: isFileItem,
              [`${rootClassName}__item--dragging`]: isItemDragging(index),
            })}
            onClick={(e: MouseEvent) => handlePreview(e, file, index)}
            {...getDragItemProps(file, index)}
          >
            {renderGridItemContent(file)}
            {showDisabledMask && <div className={`${rootClassName}__disabled-mask`} />}
            {showRemoveBtn && (
              <CloseIcon
                className={`${rootClassName}__delete-btn`}
                onClick={(e: MouseEvent) => handleRemove(e, file, index)}
              />
            )}
          </div>
        );
      })}
      {renderAddContent()}
    </>
  );

  const renderListItemIcon = (file: UploadFile) => {
    if (file.status === 'progress') {
      return <LoadingIcon className={`${rootClassName}__list-item-loading`} />;
    }
    if (file.status === 'fail') {
      return <ErrorCircleFilledIcon className={`${rootClassName}__list-item-error-icon`} />;
    }
    if (isImageFile(file) && file.url) {
      return (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Image className={`${rootClassName}__list-item-thumbnail`} shape="round" {...imageProps} src={file.url} />
          {disabled && <div className={`${rootClassName}__disabled-mask`} />}
        </div>
      );
    }
    return <span className={`${rootClassName}__list-item-icon`}>{getFileTypeIcon(file)}</span>;
  };

  const renderListItemSubText = (file: UploadFile) => {
    if (file.status === 'progress') {
      const percentText = file.percent ? ` ${file.percent}%` : '';
      return `${uploadGlobalConfig.progress.uploadingText}${percentText}`;
    }
    if (file.status === 'fail') {
      return file.response?.error || uploadGlobalConfig.progress.failText;
    }
    if (file.size != null) return returnFileSize(file.size);
    return '';
  };

  // list 项主体内容（图标 + 名称 / 副文本），list item 与拖拽 clone 复用
  const renderListItemContent = (file: UploadFile) => (
    <>
      {renderListItemIcon(file)}
      <div className={`${rootClassName}__list-item-content`}>
        <div className={`${rootClassName}__list-item-name`}>{file.name}</div>
        <div className={`${rootClassName}__list-item-size`}>{renderListItemSubText(file)}</div>
      </div>
    </>
  );

  const renderListLayout = () => {
    const addBtnNode = parseTNode(addBtn, null, null);
    const addContentNode = parseTNode(addContent, null, null);
    const defaultTriggerBtn = (
      <Button
        theme="primary"
        size="medium"
        disabled={disabled}
        icon={<UploadIcon />}
        onClick={(e) => triggerUpload(e as unknown as MouseEvent)}
      >
        Upload
      </Button>
    );
    const triggerNode = addContentNode || addBtnNode || defaultTriggerBtn;
    const showTrigger = addBtn && !reachMax;

    return (
      <>
        {showTrigger && <div className={`${rootClassName}__list-trigger`}>{triggerNode}</div>}
        {displayList.length > 0 && (
          <div className={`${rootClassName}__list`}>
            {displayList.map((file, index) => {
              const showRemoveBtn = resolveRemoveBtn(file, removeBtn);
              return (
                <div
                  key={getFileKey(file)}
                  className={classNames(`${rootClassName}__list-item`, {
                    [`${rootClassName}__list-item--fail`]: file.status === 'fail',
                    [`${rootClassName}__list-item--progress`]: file.status === 'progress',
                    [`${rootClassName}__list-item--dragging`]: isItemDragging(index),
                  })}
                  onClick={(e: MouseEvent) => handlePreview(e, file, index)}
                  {...getDragItemProps(file, index)}
                >
                  {renderListItemContent(file)}
                  <div className={`${rootClassName}__list-item-action`}>
                    {showRemoveBtn && !dragging && (
                      <DeleteIcon
                        className={`${rootClassName}__list-item-delete`}
                        onClick={(e: MouseEvent) => handleRemove(e, file, index)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  const renderDragClone = () => {
    if (!draggable || !cloneVisible || !cloneFile) return null;
    const file = cloneFile;

    const node =
      theme === 'list' ? (
        <div className={`${rootClassName}__list-item`} style={cloneStyle}>
          {renderListItemContent(file)}
        </div>
      ) : (
        <div className={classNames(`${rootClassName}__item`, `${rootClassName}__drag-clone`)} style={cloneStyle}>
          {renderGridItemContent(file)}
        </div>
      );

    return ReactDOM.createPortal(node, document.body);
  };

  return (
    <div className={containerClassName} style={style}>
      {theme === 'list' ? renderListLayout() : renderGridLayout()}
      <input
        hidden
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        capture={capture as InputHTMLAttributes<unknown>['capture']}
        onChange={onNormalFileChange}
      />
      <ImageViewer visible={showViewer} images={previewImgs} index={showImageIndex} onClose={handleImageViewerClose} />
      {renderDragClone()}
    </div>
  );
};

Upload.displayName = 'Upload';

export default Upload;
