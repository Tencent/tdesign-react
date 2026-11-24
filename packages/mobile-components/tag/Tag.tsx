import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { CloseIcon } from 'tdesign-icons-react';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import useConfig from '../hooks/useConfig';
import { tagDefaultProps } from './defaultProps';
import { TdTagProps } from './type';

export interface TagProps extends TdTagProps, StyledProps {}

const Tag = forwardRef<HTMLDivElement, TagProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, tagDefaultProps);
  const {
    className,
    style,
    closable,
    content,
    disabled,
    icon,
    maxWidth,
    children,
    shape,
    size,
    theme,
    variant,
    onClick,
    onClose,
    ...otherProps
  } = props;

  const { classPrefix } = useConfig();
  const baseClass = `${classPrefix}-tag`;

  const tagClassNames = classNames(
    `${baseClass}`,
    `${baseClass}--${theme}`,
    `${baseClass}--${shape}`,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    {
      [`${classPrefix}-is-closable ${baseClass}--closable`]: closable,
      [`${classPrefix}-is-disabled ${baseClass}--disabled`]: disabled,
    },
    className,
  );

  const tagStyle = {
    ...style,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (!props.disabled) {
      onClose?.({ e });
    }
  };

  const handleClick = (e) => {
    if (disabled) {
      return;
    }
    onClick?.({ e });
  };

  const ChildNode = parseTNode(content) || parseTNode(children);

  return (
    <span
      className={tagClassNames}
      style={tagStyle}
      aria-disabled={props.disabled}
      role="button"
      onClick={handleClick}
      ref={ref}
      {...otherProps}
    >
      {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
      <span className={`${baseClass}__text`}>{ChildNode}</span>
      {props.closable && (
        <span className={`${baseClass}__icon-close`} onClick={handleClose}>
          <CloseIcon />
        </span>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';

export default Tag;
