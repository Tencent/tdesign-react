import React, { FC, Fragment, useState } from 'react';
import { BrowseIcon as TdBrowseIcon, DeleteIcon as TdDeleteIcon, AddIcon as TdAddIcon } from 'tdesign-icons-react';
import Loading from '../../loading';
import Dialog from '../../dialog';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { UploadRemoveContext } from '../type';
import { finishUpload } from '../util';
import { TdUploadFile } from '../types';
import BooleanRender from '../boolean-render';
import { UploadConfig } from '../../config-provider/type';

export interface ImageCardProps {
  files?: TdUploadFile[];
  multiple?: boolean;
  max?: number;
  onTrigger: () => void;
  onRemove?: (options: UploadRemoveContext) => void;
  showUploadProgress: boolean;
  disabled: boolean;
  localeFromProps?: UploadConfig;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const { files, multiple = false, max = 0, onRemove, showUploadProgress, disabled, localeFromProps } = props;
  const { classPrefix } = useConfig();
  const { BrowseIcon, DeleteIcon, AddIcon } = useGlobalIcon({
    AddIcon: TdAddIcon,
    BrowseIcon: TdBrowseIcon,
    DeleteIcon: TdDeleteIcon,
  });
  const [locale, t] = useLocaleReceiver('upload');
  const [showImg, setShowImg] = useState(false);
  const [imgURL, setImgURL] = useState();

  const preview = (file) => {
    setShowImg(true);
    setImgURL(file.url);
  };

  const showTrigger = React.useMemo(() => {
    if (multiple) {
      return !max || files.length < max;
    }

    return !(files && files[0]);
  }, [files, max, multiple]);

  return (
    <Fragment>
      <Dialog
        visible={showImg}
        showOverlay
        width="auto"
        top="10%"
        className={`${classPrefix}-upload__dialog`}
        footer={false}
        header={false}
        onClose={() => {
          setShowImg(false);
          setImgURL(null);
        }}
      >
        <p className={`${classPrefix}-dialog__dialog-body-img-box`}>
          <img src={imgURL} alt="" />
        </p>
      </Dialog>
      <ul className={`${classPrefix}-upload__card`}>
        <BooleanRender boolExpression={!!files}>
          {files.map((file, index) => (
            <li className={`${classPrefix}-upload__card-item ${classPrefix}-is--background`} key={index}>
              <BooleanRender
                falseRender={() => (
                  <div className={`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`}>
                    <img className={`${classPrefix}-upload__card-image`} src={file.url} />
                    <div className={`${classPrefix}-upload__card-mask`}>
                      <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
                        <BrowseIcon onClick={() => preview(file)} />
                      </span>
                      {!disabled && (
                        <>
                          <span className={`${classPrefix}-upload__card-mask-item-divider`} />
                          <span
                            className={`${classPrefix}-upload__card-mask-item`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DeleteIcon onClick={(e) => onRemove?.({ e, file, index })} />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                boolExpression={showUploadProgress && !finishUpload(file.status)}
              >
                <div className={`${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`}>
                  <Loading loading={true} size="medium" />
                  <p>
                    {localeFromProps?.progress?.uploadingText || t(locale.progress.uploadingText)}{' '}
                    {Math.min(files[index].percent, 99)}%
                  </p>
                </div>
              </BooleanRender>
            </li>
          ))}
        </BooleanRender>
        <BooleanRender boolExpression={showTrigger}>
          <li className={`${classPrefix}-upload__card-item ${classPrefix}-is--background`} onClick={props.onTrigger}>
            <div className={`${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`}>
              <AddIcon />
              <p className={`${classPrefix}-size-s`}>
                {localeFromProps?.triggerUploadText?.image || t(locale.triggerUploadText.image)}
              </p>
            </div>
          </li>
        </BooleanRender>
      </ul>
    </Fragment>
  );
};

export default ImageCard;
