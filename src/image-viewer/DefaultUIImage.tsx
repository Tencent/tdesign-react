import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import useConfig from 'tdesign-react/_util/useConfig';
import { IconFont } from 'tdesign-icons-react';

export const LoadingError = ({ style, classPrefix }) => (
  <div style={style} className={`${classPrefix}-image-viewer-error ${classPrefix}-image-viewer-img`}>
    {/* 脱离文档流 */}
    <div className={`${classPrefix}-image-viewer-error-content`}>
      <IconFont name="image" size="4em" />
      <div>加载失败</div>
    </div>
  </div>
);

// 默认展示UI
interface DefaultUIImageProps {
  alt: string;
  src: string;
  style: CSSProperties;
  className: string;
  onOpen: () => void;
}
export const DefaultUIImage = ({ alt, src, style, onOpen, className }: DefaultUIImageProps) => {
  const [error, setError] = useState(false);
  const { classPrefix } = useConfig();
  const onError = useCallback(() => {
    setError(true);
  }, []);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error) return <LoadingError classPrefix={classPrefix} style={style} />;

  return (
    <img
      alt={alt}
      src={src}
      style={style}
      onClick={onOpen}
      onError={onError}
      className={classnames(`${classPrefix}-image-viewer-img`, className)}
    />
  );
};
