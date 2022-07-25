import React, {useCallback, useEffect, useState} from 'react';
import { ImageViewer } from 'tdesign-react';
import {BrowseIcon, ImageErrorIcon} from "tdesign-icons-react";
import img from '../img/img.png';
import './style.less';

const LoadingError = ({ classPrefix = 't' }) => (
  <div className={`${classPrefix}-image-viewer__error ${classPrefix}-image-viewer__ui-image ${classPrefix}-image-viewer__base`}>
    {/* 脱离文档流 */}
    <div className={`${classPrefix}-image-viewer__error--content`}>
      <ImageErrorIcon name="image-error" size="2em" />
      <div>图片无法显示</div>
    </div>
  </div>
);

export default function BasicImageViewer() {
  const images = [
    img,
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3w1.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3w2.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3w24.png'
  ]

  return (
    <>
      {images.map((imgSrc, index) => {
        const Trigger = ({ onOpen }) => {
          const [error, setError] = useState(false);
          const onError = useCallback(() => {
            setError(true);
          }, []);

          useEffect(() => {
            setError(false);
          }, []);

          if (error) return <LoadingError />;

          return (
            <div className={`t-image-viewer__ui-image t-image-viewer__base`}>
              <img
                alt={'test'}
                src={imgSrc}
                onError={onError}
                className={`t-image-viewer__ui-image--img`}
              />
              <div className={`t-image-viewer__ui-image--hover`} onClick={onOpen}>
                <span><BrowseIcon size="1.4em"/> 预览</span>
              </div>
            </div>
          )
        }

        return <ImageViewer key={imgSrc} trigger={Trigger} images={images} defaultIndex={index}/>
      })}
    </>
  );
}
