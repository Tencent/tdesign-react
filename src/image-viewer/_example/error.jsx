import React, {useCallback, useEffect, useState} from 'react';
import { ImageViewer } from 'tdesign-react';
import {IconFont} from "tdesign-icons-react";
import img from '../img/img.png';

const LoadingError = ({ style, classPrefix = 't' }) => (
  <div style={style} className={`${classPrefix}-image-viewer-error ${classPrefix}-image-viewer-ui-image`}>
    {/* 脱离文档流 */}
    <div className={`${classPrefix}-image-viewer-error-content`}>
      <IconFont name="image" size="2em" />
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

  const style = {
    height: '160px',
    width: '160px',
    margin: '10px'
  }

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

          if (error) return <LoadingError style={style} />;

          return (
            <div style={style} className={`t-image-viewer-ui-image`}>
              <img
                alt={'test'}
                src={imgSrc}
                onClick={onOpen}
                onError={onError}
                className={`t-image-viewer-ui-image-img`}
              />
            </div>
          )
        }

        return <ImageViewer key={imgSrc} trigger={Trigger} images={images} defaultIndex={index}/>
      })}
    </>
  );
}
