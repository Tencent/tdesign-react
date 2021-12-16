import classNames from 'classnames';
import { BrowseIcon, DeleteIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import Loading from 'tdesign-react/loading';
import React, { MouseEvent } from 'react';
import { abridgeName } from 'tdesign-react/upload/util';
import useConfig from 'tdesign-react/_util/useConfig';

const ImgList = (props) => {
  const { showInitial, listFiles, renderDragger, onImgPreview, remove } = props;
  const { classPrefix: prefix } = useConfig();
  const UPLOAD_NAME = `${prefix}-upload`;
  return (
    <div className={`${UPLOAD_NAME}__flow-card-area`}>
      {showInitial && renderDragger()}
      {!!listFiles.length && (
        <ul className={`${UPLOAD_NAME}-card clearfix`}>
          {listFiles.map((file, index) => (
            <li className={`${UPLOAD_NAME}-card__item`} key={index}>
              <div
                className={classNames([
                  `${UPLOAD_NAME}-card__content`,
                  { [`${UPLOAD_NAME}-card__content-border`]: file.status !== 'waiting' },
                ])}
              >
                {file.status === 'fail' && (
                  <div className={`${UPLOAD_NAME}-card__status-wrap`}>
                    <ErrorCircleFilledIcon />
                    <p>上传失败</p>
                  </div>
                )}
                {file.status === 'progress' && (
                  <div className={`${UPLOAD_NAME}-card__status-wrap`}>
                    <Loading />
                    <p>上传中 {Math.min(file.percent, 99)}</p>
                  </div>
                )}
                {(['waiting', 'success'].includes(file.status) || (!file.status && file.url)) && (
                  <img
                    className={`${UPLOAD_NAME}-card__image`}
                    src={file.url || '//tdesign.gtimg.com/tdesign-default-img.png'}
                    alt=""
                  />
                )}
                <div className={`${UPLOAD_NAME}-card__mask`}>
                  {file.url && (
                    <span className={`${UPLOAD_NAME}-card__mask__item`}>
                      <BrowseIcon onClick={(e: MouseEvent) => onImgPreview(e, file)} />
                      <span className={`${UPLOAD_NAME}-card__mask__item-divider`} />
                    </span>
                  )}
                  <span
                    className={`${UPLOAD_NAME}-card__mask__item`}
                    onClick={(e: MouseEvent<HTMLElement>) => remove({ e, index, file })}
                  >
                    <DeleteIcon />
                  </span>
                </div>
              </div>
              <p className={`${UPLOAD_NAME}-card__name`}>{abridgeName(file.name)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImgList;
