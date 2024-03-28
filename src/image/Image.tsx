import React, { Fragment, useEffect, useRef, useState, SyntheticEvent, MouseEvent } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import { ImageErrorIcon as TdImageErrorIcon, ImageIcon as TdImageIcon } from 'tdesign-icons-react';
import observe from '../_common/js/utils/observe';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdImageProps } from './type';
import { imageDefaultProps } from './defaultProps';
import Space from '../space';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import useImagePreviewUrl from '../hooks/useImagePreviewUrl';

export function isImageValid(src: string) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
    img.src = src;
  });
}

export type ImageProps = TdImageProps &
  StyledProps & {
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
    draggable?: boolean;
  };

const InternalImage: React.ForwardRefRenderFunction<HTMLDivElement, ImageProps> = (originalProps, ref) => {
  const props = useDefaultProps<ImageProps>(originalProps, imageDefaultProps);
  const {
    className,
    src,
    style,
    fit,
    position,
    shape,
    placeholder,
    loading,
    error,
    overlayTrigger,
    lazy,
    gallery,
    overlayContent,
    srcset,
    fallback,
    onLoad,
    onError,
    ...waitPassRest
  } = props;
  const {
    // penetrate pass to image tag element props
    alt,
    referrerpolicy,
    ...rest
  } = waitPassRest;

  const { classPrefix } = useConfig();
  const imageRef = useRef<HTMLDivElement>(null);
  const [local, t] = useLocaleReceiver('image');
  const { ImageErrorIcon, ImageIcon } = useGlobalIcon({
    ImageErrorIcon: TdImageErrorIcon,
    ImageIcon: TdImageIcon,
  });

  React.useImperativeHandle(ref, () => imageRef.current);

  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    const tmpUrl = isFunction(local.replaceImageSrc) ? local.replaceImageSrc(props) : src;
    if (tmpUrl === imageSrc && imageSrc) return;
    setImageSrc(tmpUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, local, props]);

  const { previewUrl } = useImagePreviewUrl(imageSrc);

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
    if (!lazy || !imageRef?.current) {
      return;
    }

    // https://stackoverflow.com/questions/67069827/cleanup-ref-issues-in-react
    let observerRefValue = null;

    const io = observe(imageRef.current, null, handleLoadImage, 0);
    observerRefValue = imageRef.current;

    return () => {
      observerRefValue && io && io.unobserve(observerRefValue);
    };
  }, [lazy, imageRef]);

  const [hasError, setHasError] = useState(false);

  // 判断是否执行过onError事件，要不在CSR模式下会执行两次onError
  const isFirstError = useRef(false);
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    isFirstError.current = true;
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
    onError?.({ e });
  };

  const imgRef = useRef();
  useEffect(() => {
    if (hasError && previewUrl) {
      setHasError(false);
    }
    // 在SSR在判断执行onError
    previewUrl &&
      isImageValid(previewUrl as string).then((isValid) => {
        //  SSR模式下会执行，CSR模式下不会执行
        //  这里添加setTimeout是因为CSR image渲染时，onError有时快有时慢，会导致执行顺序不同导致的bug
        setTimeout(() => {
          if (!isValid && !isFirstError.current) {
            //  SSR模式下获取不到 image 的合成事件，暂时传递 image 实例
            handleError(imgRef.current);
          }
        }, 0);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  useEffect(() => {
    // SSR下执行
    if (imgRef.current) {
      const { complete, naturalWidth, naturalHeight } = imgRef.current;
      if (complete && naturalWidth !== 0 && naturalHeight !== 0) {
        //  SSR模式下获取不到 image 的合成事件，暂时传递 image 实例
        handleLoad(imgRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMouseEvent = overlayTrigger === 'hover';
  const [shouldShowOverlay, setShouldShowOverlay] = useState(!hasMouseEvent);
  const handleToggleOverlay = (overlay: boolean) => {
    setShouldShowOverlay(overlay);
  };
  const renderOverlay = () => {
    if (!overlayContent) {
      return null;
    }
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
    if (!gallery) {
      return null;
    }
    return <div className={`${classPrefix}-image__gallery-shadow`} />;
  };

  const renderImage = () => {
    const url = typeof imageSrc === 'string' ? imageSrc : previewUrl;
    return (
      <img
        ref={imgRef}
        src={url}
        onError={handleError}
        onLoad={handleLoad}
        className={classNames(
          `${classPrefix}-image`,
          `${classPrefix}-image--fit-${fit}`,
          `${classPrefix}-image--position-${position}`,
        )}
        alt={alt}
        referrerPolicy={referrerpolicy}
      />
    );
  };

  const renderImageSrcset = () => (
    <picture>
      {Object.entries(props.srcset).map(([type, url]) => (
        <source key={url} type={type} srcSet={url} />
      ))}
      {props.src && renderImage()}
    </picture>
  );

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

      {!(hasError || !shouldLoad) && (
        <Fragment>
          {srcset && Object.keys(srcset).length ? renderImageSrcset() : renderImage()}
          {!(hasError || !shouldLoad) && !isLoaded && (
            <div className={`${classPrefix}-image__loading`}>
              {loading || (
                <Space direction="vertical" size={8} align="center">
                  <ImageIcon size={24} />
                  {/* support loading = '' to hide loading text */}
                  {typeof loading === 'string' ? loading : t(local.loadingText)}
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
              {typeof error === 'string' ? error : t(local.errorText)}
            </Space>
          )}
        </div>
      )}
      {renderOverlay()}
    </div>
  );
};

const Image = React.forwardRef<HTMLDivElement, ImageProps>(InternalImage);

Image.displayName = 'Image';

export default Image;
