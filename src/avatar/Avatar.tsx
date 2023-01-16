import React, { useRef, useState, useEffect, useContext, Ref } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useCommonClassName from '../_util/useCommonClassName';
import composeRefs from '../_util/composeRefs';
import { TdAvatarProps } from './type';
import { StyledProps } from '../common';
import AvatarContext from './AvatarContext';
import AvatarGroup from './AvatarGroup';
import { avatarDefaultProps } from './defaultProps';
import useResizeObserver from '../hooks/useResizeObserver';

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
      content,
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
    useResizeObserver(avatarChildrenRef.current, handleScale);

    const handleImgLoadError = (e) => {
      onError?.({ e });
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
    let renderChildren;
    if (image && isImgExist) {
      renderChildren = <img src={image} alt={alt} style={imageStyle} onError={handleImgLoadError} />;
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
        {...avatarProps}
      >
        {renderChildren}
      </div>
    );
  },
  { Group: AvatarGroup },
);

Avatar.displayName = 'Avatar';
Avatar.defaultProps = avatarDefaultProps;

export default Avatar;
