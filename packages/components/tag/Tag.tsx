import React, { FocusEvent, forwardRef, ForwardRefRenderFunction, useMemo } from 'react';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import tinycolor from 'tinycolor2';

import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { tagDefaultProps } from './defaultProps';

import type { StyledProps } from '../common';
import type { TdTagProps } from './type';

/**
 * Tag 组件支持的属性。
 */
export interface TagProps extends TdTagProps, StyledProps {
  /**
   * 标签内容
   */
  tabIndex?: number;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
}

export const TagFunction: ForwardRefRenderFunction<HTMLDivElement, TagProps> = (originalProps, ref) => {
  const props = useDefaultProps<TagProps>(originalProps, tagDefaultProps);
  const {
    theme,
    size,
    shape,
    variant,
    closable,
    maxWidth,
    icon,
    content,
    onClick = noop,
    onClose = noop,
    className,
    style,
    disabled,
    children,
    color,
    title: titleAttr,
    ...otherTagProps
  } = props;

  const { classPrefix, tag: tagConfig } = useConfig();
  const tagClassPrefix = `${classPrefix}-tag`;

  const { CloseIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
  });

  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
  };

  const tagClassNames = classNames(
    tagClassPrefix,
    `${tagClassPrefix}--${theme}`,
    `${tagClassPrefix}--${variant}`,
    {
      [`${tagClassPrefix}--${shape}`]: shape !== 'square',
      [`${tagClassPrefix}--ellipsis`]: !!maxWidth,
      [`${tagClassPrefix}--disabled`]: disabled,
    },
    sizeMap[size],
    className,
  );

  const tagCloseIcon = useMemo(() => {
    const iconNode = tagConfig?.closeIcon ? tagConfig.closeIcon : <CloseIcon />;
    if (React.isValidElement(iconNode)) {
      const element = iconNode as React.ReactElement<any>;
      return React.cloneElement<any>(element, {
        onClick: (e) => {
          if (disabled) return;
          element.props?.onClick?.(e);
          onClose({ e });
        },
        className: classNames(element.props?.className, `${tagClassPrefix}__icon-close`),
      });
    }
    return null;
  }, [CloseIcon, disabled, tagClassPrefix, tagConfig.closeIcon, onClose]);

  const title = useMemo(() => {
    if (Reflect.has(props, 'title')) return titleAttr;
    if (children && typeof children === 'string') return children;
    if (content && typeof content === 'string') return content;
  }, [children, content, props, titleAttr]);
  const titleAttribute = title ? { title } : undefined;

  const getTagStyle = useMemo(() => {
    if (!color) return style;
    const luminance = tinycolor(color).getLuminance();

    const calculatedStyle: React.CSSProperties = {};

    calculatedStyle.color = luminance > 0.5 ? 'black' : 'white';
    if (variant === 'outline' || variant === 'light-outline') {
      calculatedStyle.borderColor = color;
    }

    if (variant !== 'outline') {
      const getLightestShade = () => {
        const { r, g, b } = tinycolor(color).toRgb();
        // alpha 0.1  is designed by @wen1kang
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
      };

      calculatedStyle.backgroundColor = variant === 'dark' ? color : getLightestShade();
    }
    if (variant !== 'dark') {
      calculatedStyle.color = color;
    }
    return { ...calculatedStyle, ...style };
  }, [color, variant, style]);

  const getTextStyle = useMemo(() => {
    if (!maxWidth) return {};

    return {
      maxWidth: isNaN(Number(maxWidth)) ? String(maxWidth) : `${maxWidth}px`,
    };
  }, [maxWidth]);

  const tag = (
    <div
      ref={ref}
      className={tagClassNames}
      onClick={(e) => {
        if (disabled) return;
        onClick({ e });
      }}
      style={getTagStyle}
      {...otherTagProps}
    >
      <>
        {icon}
        <span className={maxWidth ? `${tagClassPrefix}--text` : undefined} style={getTextStyle} {...titleAttribute}>
          {children ?? content}
        </span>
        {closable && !disabled && tagCloseIcon}
      </>
    </div>
  );

  return tag;
};

export const Tag = forwardRef(TagFunction);

Tag.displayName = 'Tag';

export default Tag;
