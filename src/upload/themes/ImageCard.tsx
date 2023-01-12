import React, { MouseEvent } from 'react';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  AddIcon as TdAddIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import Loading from '../../loading';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { TdUploadProps, UploadFile } from '../type';
import { abridgeName } from '../../_common/js/upload/utils';

export interface ImageCardUploadProps extends CommonDisplayFileProps {
  multiple: TdUploadProps['multiple'];
  max: TdUploadProps['max'];
  disabled?: TdUploadProps['disabled'];
  showUploadProgress: TdUploadProps['showUploadProgress'];
  triggerUpload?: () => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent<HTMLElement>; file: UploadFile }) => void;
  onPreview?: TdUploadProps['onPreview'];
}

const ImageCard = (props: ImageCardUploadProps) => {
  const { displayFiles, locale, classPrefix, multiple, max = 0, onRemove, disabled } = props;
  const { BrowseIcon, DeleteIcon, AddIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    AddIcon: TdAddIcon,
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });

  const showTrigger = React.useMemo(() => {
    if (multiple) {
      return !max || displayFiles.length < max;
    }
    return !displayFiles?.[0];
  }, [displayFiles, max, multiple]);

  const renderMainContent = (file: UploadFile, index: number) => (
    <div className={`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`}>
      <img className={`${classPrefix}-upload__card-image`} src={file.url} />
      <div className={`${classPrefix}-upload__card-mask`}>
        <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
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
    <div className={loadCard}>
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
          <DeleteIcon onClick={({ e }: { e: MouseEvent }) => props?.onRemove?.({ e, file, index })} />
        </span>
      </div>
    </div>
  );

  const cardItemClasses = `${classPrefix}-upload__card-item ${classPrefix}-is-background`;
  return (
    <div>
      <ul className={`${classPrefix}-upload__card`}>
        {displayFiles?.map((file: UploadFile, index: number) => {
          const loadCard = `${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`;
          const fileName = props.abridgeName ? abridgeName(file.name, ...props.abridgeName) : file.name;
          return (
            <li className={cardItemClasses} key={index}>
              {file.status === 'progress' && renderProgressFile(file, loadCard)}
              {file.status === 'fail' && renderFailFile(file, index, loadCard)}
              {!['progress', 'fail'].includes(file.status) && file.url && renderMainContent(file, index)}
              <div className={`${classPrefix}-upload__card-name`}>{fileName}</div>
            </li>
          );
        })}
        {showTrigger && (
          <li className={cardItemClasses} onClick={props.triggerUpload}>
            <div className={`${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`}>
              <AddIcon />
              <p className={`${classPrefix}-size-s`}>{locale?.triggerUploadText?.image}</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

ImageCard.displayName = 'ImageCard';

export default ImageCard;
