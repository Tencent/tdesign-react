import React, { Fragment, useEffect, useRef, useState, SyntheticEvent } from 'react';
import classNames from 'classnames';
import { ImageErrorIcon as TdImageErrorIcon, ImageIcon as TdImageIcon } from 'tdesign-icons-react';
import observe from '../_common/js/utils/observe';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdImageProps } from './type';
import { imageDefaultProps } from './defaultProps';
import Space from '../space';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { StyledProps } from '../common';

export type ImageProps = TdImageProps & StyledProps;

const Image = (props: ImageProps) => {
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
    onError,
    ...rest
  } = props;

  const { classPrefix } = useConfig();
  const imageRef = useRef<HTMLDivElement>(null);
  const [local, t] = useLocaleReceiver('image');
  const { ImageErrorIcon, ImageIcon } = useGlobalIcon({
    ImageErrorIcon: TdImageErrorIcon,
    ImageIcon: TdImageIcon,
  });

  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const handleLoadImage = () => {
    setShouldLoad(true);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.({ e });
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
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.({ e });
  };

  const hasMouseEvent = overlayTrigger === 'hover';
  const [shouldShowOverlay, setShouldShowOverlay] = useState(!hasMouseEvent);
  const handleToggleOverlay = (overlay: boolean) => {
    setShouldShowOverlay(overlay);
  };
  const renderOverlay = () => {
    if (!overlayContent) return null;
    return (
      <div
        className={classNames(
          `${classPrefix}-image__overlay-content`,
          !shouldShowOverlay && `${classPrefix}-image__overlay-content--hidden`,
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
    return <div className={`${classPrefix}-image__placeholder`}>{placeholder}</div>;
  };

  const renderGalleryShadow = () => {
    if (!gallery) return null;
    return <div className={`${classPrefix}-image__gallery-shadow`} />;
  };

  return (
    <div
      ref={imageRef}
      className={classNames(
        `${classPrefix}-image__wrapper`,
        `${classPrefix}-image__wrapper--shape-${shape}`,
        gallery && `${classPrefix}-image__wrapper--gallery`,
        hasMouseEvent && `${classPrefix}-image__wrapper--need-hover`,
        className,
      )}
      style={style}
      {...(hasMouseEvent
        ? {
            onMouseEnter: () => handleToggleOverlay(true),
            onMouseLeave: () => handleToggleOverlay(false),
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
              `${classPrefix}-image--fit-${fit}`,
              `${classPrefix}-image--position-${position}`,
            )}
            alt={alt}
          />
          {!isLoaded && (
            <div className={`${classPrefix}-image__loading`}>
              {loading || (
                <Space direction="vertical" size={8} align="center">
                  <ImageIcon size={24} />
                  {t(local.loadingText)}
                </Space>
              )}
            </div>
          )}
        </Fragment>
      )}

      {hasError && (
        <div className={`${classPrefix}-image__error`}>
          {error || (
            <Space direction="vertical" size={8} align="center">
              <ImageErrorIcon size={24} />
              {t(local.errorText)}
            </Space>
          )}
        </div>
      )}

      {renderOverlay()}
    </div>
  );
};

Image.displayName = 'Image';
Image.defaultProps = imageDefaultProps;

export default Image;
