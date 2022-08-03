import React, { Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import observe from '../_common/js/utils/observe';
import useConfig from '../hooks/useConfig';
import { TdImageProps } from './type';
import { imageDefaultProps } from './defaultProps';

export type ImageProps = TdImageProps;

const Image = (props: TdImageProps) => {
  const {
    className,
    src,
    style,
    alt,
    fit,
    position,
    shape,
    placeholder,
    loading,
    error,
    overlayTrigger,
    overlayContent,
    lazy,
    gallery,
    onLoad,
    ...rest
  } = props;

  const { classPrefix } = useConfig();
  const imageRef = useRef<HTMLDivElement>(null);

  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const handleLoadImage = () => {
    setShouldLoad(true);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  useEffect(() => {
    if (!lazy || !imageRef?.current) return;

    // https://stackoverflow.com/questions/67069827/cleanup-ref-issues-in-react
    let observerRefValue = null;

    const io = observe(imageRef.current, null, handleLoadImage, 0);
    observerRefValue = imageRef.current;

    return () => {
      observerRefValue && io && io.unobserve(observerRefValue);
    };
  }, [lazy, imageRef]);

  const [hasError, setHasError] = useState(false);
  const handleError = () => {
    setHasError(true);
  };

  const hasMouseEvent = overlayTrigger === 'hover';
  const [shouldShowOverlay, setShouldShowOverlay] = useState(!hasMouseEvent);
  const handleToggleOverlay = () => {
    setShouldShowOverlay(!shouldShowOverlay);
  };
  const renderOverlay = () => {
    if (!overlayContent) return null;
    return (
      <div
        className={classNames(
          `${classPrefix}-image-overlay-content`,
          !shouldShowOverlay && `${classPrefix}-image-overlay-content--hidden`,
        )}
      >
        {overlayContent}
      </div>
    );
  };

  const renderPlaceholder = () => {
    if (!placeholder) {
      return null;
    }
    return <div className={`${classPrefix}-image-placeholder`}>{placeholder}</div>;
  };

  const renderGalleryShadow = () => {
    if (!gallery) return null;
    return <div className={`${classPrefix}-image-gallery-shaddow`} />;
  };

  return (
    <div
      ref={imageRef}
      className={classNames(
        `${classPrefix}-image-wrapper`,
        `${classPrefix}-image-wrapper_shape--${shape}`,
        gallery && `${classPrefix}-image-wrapper_gallery`,
        hasMouseEvent && `${classPrefix}-image-wrapper--need-hover`,
        className,
      )}
      style={style}
      {...(hasMouseEvent
        ? {
            onMouseEnter: handleToggleOverlay,
            onMouseLeave: handleToggleOverlay,
          }
        : null)}
      {...rest}
    >
      {renderPlaceholder()}
      {renderGalleryShadow()}

      {hasError || !shouldLoad ? (
        <div className={`${classPrefix}-image`} />
      ) : (
        <Fragment>
          <img
            src={src}
            onError={handleError}
            onLoad={handleLoad}
            className={classNames(
              `${classPrefix}-image`,
              `${classPrefix}-image_fit--${fit}`,
              `${classPrefix}-image_position--${position}`,
            )}
            alt={alt}
          />
          {!isLoaded && loading && <div className={`${classPrefix}-image-loading`}>{loading}</div>}
        </Fragment>
      )}

      {hasError && <div className={`${classPrefix}-image-error`}>{error}</div>}

      {renderOverlay()}
    </div>
  );
};

Image.displayName = 'Image';
Image.defaultProps = imageDefaultProps;

export default Image;
