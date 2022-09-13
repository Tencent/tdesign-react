import React, { MouseEvent } from 'react';
import { BrowseIcon as TdBrowseIcon, DeleteIcon as TdDeleteIcon, AddIcon as TdAddIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import Loading from '../../loading';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { TdUploadProps, UploadFile } from '../type';

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
  const { displayFiles, locale, classPrefix, multiple, max = 0, onRemove, showUploadProgress, disabled } = props;
  const { BrowseIcon, DeleteIcon, AddIcon } = useGlobalIcon({
    AddIcon: TdAddIcon,
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
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

  const cardItemClasses = `${classPrefix}-upload__card-item ${classPrefix}-is-background`;
  return (
    <div>
      <ul className={`${classPrefix}-upload__card`}>
        {displayFiles?.map((file, index) => {
          if (file.status === 'progress') {
            return (
              <li className={cardItemClasses} key={file.name + index}>
                <div className={`${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`}>
                  <Loading
                    loading={true}
                    size="medium"
                    text={
                      <p>
                        {locale?.progress?.uploadingText}
                        {showUploadProgress ? `${file.percent}%` : ''}
                      </p>
                    }
                  />
                </div>
              </li>
            );
          }
          return (
            <li className={cardItemClasses} key={file.name + index}>
              {renderMainContent(file, index)}
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

      {props.tips && <small className={classNames(props.tipsClasses)}>{props.tips}</small>}
    </div>
  );
};

ImageCard.displayName = 'ImageCard';

export default ImageCard;
