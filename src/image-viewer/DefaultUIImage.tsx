import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import useConfig from 'tdesign-react/_util/useConfig';
import { IconFont } from 'tdesign-icons-react';

const LoadingError = ({ style, classPrefix }) => (
  <div style={style} className={`${classPrefix}-image-viewer-error ${classPrefix}-image-viewer-ui-image`}>
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
  title: string;
  style: CSSProperties;
  className: string;
  onOpen: () => void;
}
export const DefaultUIImage = ({ alt, src, style, onOpen, className, title }: DefaultUIImageProps) => {
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
    <div style={style} className={`${classPrefix}-image-viewer-ui-image`}>
      <img
        alt={alt}
        src={src}
        onClick={onOpen}
        onError={onError}
        className={classnames(`${classPrefix}-image-viewer-ui-image-img`, className)}
      />
      {!!title && <div className={`${classPrefix}-image-viewer-ui-image-footer`}>{title}</div>}
    </div>
  );
};
