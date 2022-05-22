import React, { CSSProperties, useCallback, useState } from 'react';
import classnames from 'classnames';
import useConfig from 'tdesign-react/_util/useConfig';

export const LoadingError = ({ style, classPrefix }) => (
  <div style={style} className={`${classPrefix}-image-viewer-error ${classPrefix}-image-viewer-img`}>
    加载失败
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
