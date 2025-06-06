import React, { MouseEvent } from 'react';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  AddIcon as TdAddIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import classNames from 'classnames';
import { abridgeName } from '@tdesign/common-js/upload/utils';
import Loading from '../../loading';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { TdUploadProps, UploadFile } from '../type';
import parseTNode from '../../_util/parseTNode';
import Link from '../../link';
import Image from '../../image';

export interface ImageCardUploadProps extends CommonDisplayFileProps {
  multiple: TdUploadProps['multiple'];
  max: TdUploadProps['max'];
  disabled?: TdUploadProps['disabled'];
  showUploadProgress: TdUploadProps['showUploadProgress'];
  triggerUpload?: () => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file: UploadFile }) => void;
  onPreview?: TdUploadProps['onPreview'];
  showImageFileName?: boolean;
  imageProps?: TdUploadProps['imageProps'];
}

const ImageCard = (props: ImageCardUploadProps) => {
  const {
    displayFiles,
    locale,
    classPrefix,
    multiple,
    max = 0,
    onRemove,
    disabled,
    fileListDisplay,
    imageProps = {},
  } = props;
  const { BrowseIcon, DeleteIcon, AddIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    AddIcon: TdAddIcon,
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });
  const { className: imageClassName, ...restImageProps } = imageProps;

  const showTrigger = React.useMemo(() => {
    if (multiple) {
      return !max || displayFiles.length < max;
    }
    return !displayFiles?.[0];
  }, [displayFiles, max, multiple]);

  const renderMainContent = (file: UploadFile, index: number) => (
    <div className={`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`}>
      <Image
        fit="contain"
        className={classNames(`${classPrefix}-upload__card-image`, imageClassName)}
        {...restImageProps}
        src={file.url || file.raw}
      />
      <div className={`${classPrefix}-upload__card-mask`}>
        <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
          <ImageViewer
            trigger={({ open }) => (
              <BrowseIcon
                onClick={(e) => {
                  props.onPreview?.({ file, index, e });
                  open();
                }}
              />
            )}
            images={displayFiles.map((t) => t.url || t.raw)}
            defaultIndex={index}
            {...props.imageViewerProps}
          />
        </span>
        {!disabled && (
          <>
            <span className={`${classPrefix}-upload__card-mask-item-divider`} />
            <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
              <DeleteIcon onClick={(e) => onRemove?.({ e, file, index })} />
            </span>
          </>
        )}
      </div>
    </div>
  );

  const renderProgressFile = (file: UploadFile, loadCard: string) => (
    <div className={classNames([loadCard, `${classPrefix}-upload__${props.theme}-${file.status}`])}>
      <Loading loading={true} size="medium" />
      <p>
        {locale?.progress?.uploadingText}
        {props.showUploadProgress ? ` ${file.percent}%` : ''}
      </p>
    </div>
  );

  const renderFailFile = (file: UploadFile, index: number, loadCard: string) => (
    <div className={loadCard}>
      <ErrorCircleFilledIcon />
      <p>{file.response?.error || locale?.progress?.failText}</p>
      <div className={`${classPrefix}-upload__card-mask`}>
        <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
          <DeleteIcon onClick={(e) => props.onRemove?.({ e, file, index })} />
        </span>
      </div>
    </div>
  );

  const cardItemClasses = `${classPrefix}-upload__card-item ${classPrefix}-is-background`;

  if (fileListDisplay) {
    return (
      <div>
        {parseTNode(fileListDisplay, {
          triggerUpload: props.triggerUpload,
          uploadFiles: props.uploadFiles,
          cancelUpload: props.cancelUpload,
          onPreview: props.onPreview,
          onRemove: props.onRemove,
          toUploadFiles: props.toUploadFiles,
          sizeOverLimitMessage: props.sizeOverLimitMessage,
          locale: props.locale,
          files: displayFiles,
        })}
      </div>
    );
  }

  return (
    <div>
      <ul className={`${classPrefix}-upload__card`}>
        {displayFiles?.map((file: UploadFile, index: number) => {
          const loadCard = `${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`;
          const fileName = props.abridgeName ? abridgeName(file.name, ...props.abridgeName) : file.name;
          const fileNameClassName = `${classPrefix}-upload__card-name`;
          return (
            <li className={cardItemClasses} key={index}>
              {file.status === 'progress' && renderProgressFile(file, loadCard)}
              {file.status === 'fail' && renderFailFile(file, index, loadCard)}
              {!['progress', 'fail'].includes(file.status) && renderMainContent(file, index)}
              {fileName &&
                props.showImageFileName &&
                (file.url ? (
                  <Link href={file.url} className={fileNameClassName} target="_blank" hover="color" size="small">
                    {fileName}
                  </Link>
                ) : (
                  <span className={fileNameClassName}>{fileName}</span>
                ))}
            </li>
          );
        })}
        {showTrigger && (
          <li className={cardItemClasses} onClick={props.triggerUpload}>
            <div
              className={classNames([
                `${classPrefix}-upload__image-add`,
                `${classPrefix}-upload__card-container`,
                `${classPrefix}-upload__card-box`,
                {
                  [`${classPrefix}-is-disabled`]: props.disabled,
                },
              ])}
            >
              <AddIcon />
              <p className={classNames([`${classPrefix}-size-s`, `${classPrefix}-upload__add-text`])}>
                {locale?.triggerUploadText?.image}
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

ImageCard.displayName = 'ImageCard';

export default ImageCard;
