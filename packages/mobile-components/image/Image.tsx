import React, { Fragment, useRef, useMemo, useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import classNames from 'classnames';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';
import Loading from '../loading';
import observe from '../_common/js/utils/observe';
import { StyledProps } from '../common';
import { TdImageProps } from './type';
import { imageDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';

export interface ImageProps extends TdImageProps, StyledProps {}

const Image: React.FC<ImageProps> = (props) => {
  const {
    className,
    style,
    src,
    alt,
    error,
    fallback,
    fit,
    lazy,
    loading,
    shape,
    position,
    referrerpolicy,
    srcset,
    onError,
    onLoad,
  } = useDefaultProps<ImageProps>(props, imageDefaultProps);

  const imageClass = usePrefixClass('image');
  const imageRef = useRef<HTMLDivElement>(null);

  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  const rootClasses = classNames(
    {
      [`${imageClass}`]: true,
      [`${imageClass}--${shape}`]: true,
    },
    className,
  );

  // Loading Element
  const LoadingStatus = useMemo(() => {
    if (!(isError || !shouldLoad) && !isLoaded) return loading || <Loading theme="dots" inheritColor={true} />;
  }, [isError, shouldLoad, isLoaded, loading]);

  // Loading Failed Element
  const FailedStatus = useMemo(() => {
    if (isError) return error || <TdCloseIcon size="22px" />;
  }, [isError, error]);

  const handleLoadImage = () => {
    setShouldLoad(true);
  };

  useEffect(() => {
    if (!lazy || !imageRef?.current) {
      return;
    }

    const handleUnObserve = (element) => {
      const observer = observe(element, null, handleLoadImage, 0);
      return () => {
        observer?.unobserve(element);
      };
    };

    return handleUnObserve(imageRef.current);
  }, [lazy, imageRef]);

  // 图片加载完成回调
  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.({ e });
  };

  // 图片加载失败回调
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    setIsError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
    onError?.({ e });
  };

  const renderMask = () =>
    LoadingStatus || FailedStatus ? (
      <div className={`${imageClass}__mask`}>{parseTNode(LoadingStatus || FailedStatus)}</div>
    ) : null;

  const renderImage = () => (
    <img
      className={classNames(`${imageClass}__img`, `${imageClass}--fit-${fit}`, `${imageClass}--position-${position}`)}
      src={imageSrc}
      alt={alt}
      referrerPolicy={referrerpolicy}
      onLoad={handleLoad}
      onError={handleError}
    />
  );

  const renderImageSrcset = () => (
    <picture>
      {Object.entries(srcset).map(([type, url]) => (
        <source key={url} type={type} srcSet={url} />
      ))}
      {src && renderImage()}
    </picture>
  );

  return (
    <div ref={imageRef} className={rootClasses} style={style}>
      {renderMask()}
      {!isError && shouldLoad && (
        <Fragment>{srcset && Object.keys(srcset).length ? renderImageSrcset() : renderImage()}</Fragment>
      )}
    </div>
  );
};

Image.displayName = 'Image';

export default Image;
