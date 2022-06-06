import React, {useCallback, useEffect, useState} from 'react';
import { ImageViewer } from 'tdesign-react';
import {IconFont} from "tdesign-icons-react";

const LoadingError = ({ style, classPrefix = 't' }) => (
  <div style={style} className={`${classPrefix}-image-viewer-error ${classPrefix}-image-viewer-ui-image`}>
    {/* 脱离文档流 */}
    <div className={`${classPrefix}-image-viewer-error-content`}>
      <IconFont name="image" size="4em" />
      <div>加载失败</div>
    </div>
  </div>
);

export default function BasicImageViewer() {
  const images = [
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/button-1@2x.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Grid_1.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211221143256.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3w.png'
  ]

  const style = {
    height: '100px',
    width: '100px',
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
          }, [imgSrc]);

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
