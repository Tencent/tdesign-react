import React, { useRef, useState, useEffect, useContext, Ref } from 'react';
import useResizeObserver from 'use-resize-observer';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useCommonClassName from '../_util/useCommonClassName';
import composeRefs from '../_util/composeRefs';
import { TdAvatarProps } from './type';
import { StyledProps } from '../common';
import AvatarContext from './AvatarContext';
import AvatarGroup from './AvararGroup';
import { avatarDefaultProps } from './defaultProps';

export interface AvatarProps extends TdAvatarProps, StyledProps {
  children?: React.ReactNode;
}

const Avatar = forwardRefWithStatics(
  (props: AvatarProps, ref: Ref<HTMLElement>) => {
    const {
      alt,
      hideOnLoadFailed,
      icon,
      image,
      shape,
      size: avatarSize,
      onError,
      children,
      style,
      className,
      ...avatarProps
    } = props;
    const groupSize = useContext(AvatarContext);
    const { classPrefix } = useConfig();
    const [scale, setScale] = useState(1);
    const [isImgExist, setIsImgExist] = useState(true);
    const avatarRef = useRef<HTMLElement>(null);
    const avatarChildrenRef = useRef<HTMLElement>(null);
    const size = avatarSize === 'default' ? groupSize : avatarSize;
    const gap = 4;
    const handleScale = () => {
      if (!avatarChildrenRef.current || !avatarRef.current) {
        return;
      }
      const childrenWidth = avatarChildrenRef.current.offsetWidth;
      const avatarWidth = avatarRef.current.offsetWidth;

      if (childrenWidth !== 0 && avatarWidth !== 0) {
        if (gap * 2 < avatarWidth) {
          setScale(avatarWidth - gap * 2 < childrenWidth ? (avatarWidth - gap * 2) / childrenWidth : 1);
        }
      }
    };
    const { ref: observerRef } = useResizeObserver<HTMLDivElement>({
      onResize: handleScale,
    });

    const handleImgLoadError = () => {
      onError && onError();
      !hideOnLoadFailed && setIsImgExist(false);
    };

    useEffect(() => {
      setIsImgExist(true);
      setScale(1);
    }, [props.image]);

    useEffect(() => {
      handleScale();
    }, []);

    const { SIZE } = useCommonClassName();
    const numSizeStyle: React.CSSProperties =
      size && !SIZE[size]
        ? {
            width: size,
            height: size,
            fontSize: `${Number.parseInt(size, 10) / 2}px`,
          }
        : {};
    const imageStyle: React.CSSProperties =
      size && !SIZE[size]
        ? {
            width: size,
            height: size,
          }
        : {};

    const preClass = `${classPrefix}-avatar`;

    const avatarClass = classNames(preClass, className, {
      [SIZE[size]]: !!SIZE[size],
      [`${preClass}--${shape}`]: !!shape,
      [`${preClass}-icon`]: !!icon,
    });

    let content;
    if (image && isImgExist) {
      content = <img src={image} alt={alt} style={imageStyle} onError={handleImgLoadError} />;
    } else if (icon) {
      content = icon;
    } else {
      const childrenStyle: React.CSSProperties = {
        transform: `scale(${scale})`,
      };
      content = (
        <span ref={composeRefs(ref, avatarChildrenRef, observerRef) as any} style={childrenStyle}>
          {children}
        </span>
      );
    }
    return (
      <div
        ref={composeRefs(ref, avatarRef) as any}
        className={avatarClass}
        style={{ ...numSizeStyle, ...style }}
        {...avatarProps}
      >
        {content}
      </div>
    );
  },
  { Group: AvatarGroup },
);

Avatar.displayName = 'Avatar';
Avatar.defaultProps = avatarDefaultProps;

export default Avatar;
