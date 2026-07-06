import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { composeRefs } from '../_util/ref';
import useCommonClassName from '../hooks/useCommonClassName';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useResizeObserver from '../hooks/useResizeObserver';
import Image from '../image';
import AvatarContext from './AvatarContext';
import AvatarGroup from './AvatarGroup';
import { avatarDefaultProps } from './defaultProps';

import type { Ref } from 'react';
import type { StyledProps } from '../common';
import type { ImageProps } from '../image';
import type { TdAvatarProps } from './type';

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
      onClick,
      onHover,
      onContextmenu,
      children,
      content,
      style,
      imageProps,
      className,
      ...avatarProps
    } = useDefaultProps<AvatarProps>(props, avatarDefaultProps);
    const groupSize = useContext(AvatarContext);

    const { classPrefix } = useConfig();
    const [scale, setScale] = useState(1);
    const [isImgExist, setIsImgExist] = useState(true);
    const avatarRef = useRef<HTMLElement>(null);
    const avatarChildrenRef = useRef<HTMLElement>(null);
    const size = avatarSize === undefined ? groupSize : avatarSize;
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
    useResizeObserver(avatarChildrenRef, handleScale);

    const handleImgLoadError: ImageProps['onError'] = (ctx) => {
      onError?.(ctx);
      setIsImgExist(!hideOnLoadFailed);
    };

    useEffect(() => {
      setIsImgExist(true);
      setScale(1);
    }, [image]);

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
      [`${preClass}__icon`]: !!icon,
    });
    let renderChildren: React.ReactNode;
    if (image && isImgExist) {
      renderChildren = (
        <Image
          src={image}
          alt={alt}
          error=""
          loading=""
          style={imageStyle}
          onError={handleImgLoadError}
          {...imageProps}
        />
      );
    } else if (icon) {
      renderChildren = icon;
    } else {
      const childrenStyle: React.CSSProperties = {
        transform: `scale(${scale})`,
      };
      renderChildren = (
        <span ref={composeRefs(ref, avatarChildrenRef)} style={childrenStyle}>
          {children || content}
        </span>
      );
    }
    return (
      <div
        ref={composeRefs(ref, avatarRef) as any}
        className={avatarClass}
        style={{ ...numSizeStyle, ...style }}
        onClick={(e) => onClick?.({ e })}
        onMouseEnter={(e) => onHover?.({ e })}
        onContextMenu={(e) => onContextmenu?.({ e })}
        {...avatarProps}
      >
        {renderChildren}
      </div>
    );
  },
  { Group: AvatarGroup },
);

Avatar.displayName = 'Avatar';

export default Avatar;
