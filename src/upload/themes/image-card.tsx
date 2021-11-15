import React, { FC, Fragment, useState } from 'react';
import { BrowseIcon, DeleteIcon, AddIcon } from 'tdesign-icons-react';
import Loading from '../../loading';
import Dialog from '../../dialog';
import useConfig from '../../_util/useConfig';
import { UploadRemoveContext } from '../../_type/components/upload';
import { finishUpload } from '../util';
import { TdUploadFile } from '../types';

export interface ImageCardProps {
  files?: TdUploadFile[];
  multiple?: boolean;
  max?: number;
  onTrigger: () => void;
  onRemove?: (options: UploadRemoveContext) => void;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const { files, multiple = false, max = 0, onRemove } = props;
  const { classPrefix } = useConfig();
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
        className={`${classPrefix}-upload-dialog`}
        footer={false}
        header={false}
        onClose={() => {
          setShowImg(false);
          setImgURL(null);
        }}
      >
        <p className={`${classPrefix}-dialog__body-img-box`}>
          <img src={imgURL} alt="" />
        </p>
      </Dialog>
      <ul className={`${classPrefix}-upload-card`}>
        {files &&
          files.map((file, index) => (
            <li className={`${classPrefix}-upload-card__item ${classPrefix}-is--background`} key={index}>
              {!finishUpload(file.status) ? (
                <div className={`${classPrefix}-upload-card-container ${classPrefix}-upload-card__box`}>
                  <Loading loading={true} size="medium" />
                  <p>上传中 {Math.min(files[0].percent, 99)}%</p>
                </div>
              ) : (
                <div className={`${classPrefix}-upload-card__content ${classPrefix}-upload-card__box`}>
                  <img className={`${classPrefix}-upload-card__image`} src={file.url} />
                  <div className={`${classPrefix}-upload-card__mask`}>
                    <span className={`${classPrefix}-upload-card__mask__item`} onClick={(e) => e.stopPropagation()}>
                      <BrowseIcon
                        onClick={() => {
                          preview(file);
                        }}
                      />
                    </span>
                    <span className={`${classPrefix}-upload-card__mask__item-divider`} />
                    <span className={`${classPrefix}-upload-card__mask__item`} onClick={(e) => e.stopPropagation()}>
                      <DeleteIcon
                        onClick={(e) => {
                          onRemove?.({ e, file, index });
                        }}
                      />
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        {showTrigger && (
          <li className={`${classPrefix}-upload-card__item ${classPrefix}-is--background`} onClick={props.onTrigger}>
            <div className={`${classPrefix}-upload-card-container ${classPrefix}-upload-card__box`}>
              <AddIcon />
              <p className={`${classPrefix}-upload__small`}>点击上传图片</p>
            </div>
          </li>
        )}
      </ul>
    </Fragment>
  );
};

export default ImageCard;
