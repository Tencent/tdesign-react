import React, { ForwardRefRenderFunction, FocusEvent, forwardRef } from 'react';
import classNames from 'classnames';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { StyledProps } from '../common';
import { TdTagProps } from './type';
import { tagDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

/**
 * Tag 组件支持的属性。
 */
export interface TagProps extends TdTagProps, StyledProps {
  /**
   * 标签内容
   */
  children?: React.ReactNode;
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
    ...otherTagProps
  } = props;

  const { classPrefix } = useConfig();
  const { CloseIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
  });
  const tagClassPrefix = `${classPrefix}-tag`;

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

  /**
   * 删除 Icon
   */
  const deleteIcon = (
    <CloseIcon
      onClick={(e) => {
        if (disabled) return;
        onClose({ e });
      }}
      className={`${tagClassPrefix}__icon-close`}
    />
  );

  const title = (() => {
    if (children && typeof children === 'string') return children;
    if (content && typeof content === 'string') return content;
  })();
  const titleAttribute = title ? { title } : undefined;

  const tag = (
    <div
      ref={ref}
      className={tagClassNames}
      onClick={(e) => {
        if (disabled) return;
        onClick({ e });
      }}
      style={maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth, ...style } : style}
      {...otherTagProps}
    >
      <>
        {icon}
        <span className={maxWidth ? `${tagClassPrefix}--text` : undefined} {...titleAttribute}>
          {children ?? content}
        </span>
        {closable && !disabled && deleteIcon}
      </>
    </div>
  );

  return tag;
};

export const Tag = forwardRef(TagFunction);

Tag.displayName = 'Tag';

export default Tag;
