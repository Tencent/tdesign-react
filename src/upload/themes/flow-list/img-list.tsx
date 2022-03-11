import classNames from 'classnames';
import { BrowseIcon, DeleteIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import React, { MouseEvent } from 'react';
import type { CommonListProps, FlowListProps } from './index';
import useConfig from '../../../_util/useConfig';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import { abridgeName } from '../../util';
import Loading from '../../../loading';

type ImgListProps = CommonListProps & Pick<FlowListProps, 'onImgPreview' | 'remove'>;

const ImgList = (props: ImgListProps) => {
  const { showInitial, listFiles, renderDragger, onImgPreview, remove } = props;
  const { classPrefix: prefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');
  const UPLOAD_NAME = `${prefix}-upload`;
  const UPLOAD_NAME_CARD = `${UPLOAD_NAME}__card`;

  return (
    <div className={`${UPLOAD_NAME}__flow-card-area`}>
      {showInitial && renderDragger()}
      {!!listFiles.length && (
        <ul className={`${UPLOAD_NAME_CARD} clearfix`}>
          {listFiles.map((file, index) => (
            <li className={`${UPLOAD_NAME_CARD}-item`} key={index}>
              <div
                className={classNames({
                  [`${UPLOAD_NAME_CARD}-content`]: true,
                  [`${UPLOAD_NAME_CARD}-content-border`]: file.status !== 'waiting',
                })}
              >
                {file.status === 'fail' && (
                  <div className={`${UPLOAD_NAME_CARD}-status-wrap`}>
                    <ErrorCircleFilledIcon />
                    <p>{t(locale.progress.failText)}</p>
                  </div>
                )}
                {file.status === 'progress' && (
                  <div className={`${UPLOAD_NAME_CARD}-status-wrap`}>
                    <Loading />
                    <p>
                      {t(locale.progress.uploadingText)} {Math.min(file.percent, 99)}
                    </p>
                  </div>
                )}
                {(['waiting', 'success'].includes(file.status) || (!file.status && file.url)) && (
                  <img
                    className={`${UPLOAD_NAME_CARD}-image`}
                    src={file.url || '//tdesign.gtimg.com/tdesign-default-img.png'}
                    alt=""
                  />
                )}
                <div className={`${UPLOAD_NAME_CARD}-mask`}>
                  {file.url && (
                    <span className={`${UPLOAD_NAME_CARD}__mask__item`}>
                      <BrowseIcon onClick={(e: MouseEvent) => onImgPreview(file, e)} />
                      <span className={`${UPLOAD_NAME_CARD}__mask__item-divider`} />
                    </span>
                  )}
                  <span
                    className={`${UPLOAD_NAME_CARD}-mask__item`}
                    onClick={(e: MouseEvent<HTMLElement>) => remove({ e, index, file })}
                  >
                    <DeleteIcon />
                  </span>
                </div>
              </div>
              <p className={`${UPLOAD_NAME_CARD}-name`}>{abridgeName(file.name)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImgList;
