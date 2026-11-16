import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { CloseIcon } from 'tdesign-icons-react';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useDefault from '../_util/useDefault';
import useDefaultProps from '../hooks/useDefaultProps';
import { checkTagDefaultProps } from './defaultProps';
import { TdCheckTagProps } from './type';

export interface CheckTagProps extends TdCheckTagProps, StyledProps {}

const CheckTag = forwardRef<HTMLSpanElement, CheckTagProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, checkTagDefaultProps);
  const {
    checked,
    defaultChecked,
    content,
    children,
    style,
    className,
    icon,
    disabled,
    closable,
    size,
    shape,
    variant,
    onClick,
    onChange,
    onClose,
    ...otherProps
  } = props;

  const { classPrefix } = useConfig();

  const [innerChecked, onInnerChecked] = useDefault(checked, defaultChecked, onChange);

  const baseClass = `${classPrefix}-tag`;

  const checkTagClass = classNames(
    `${baseClass}`,
    // `${baseClass}--checkable`,
    `${baseClass}--${shape}`,
    `${baseClass}--${innerChecked ? 'primary' : 'default'}`,
    `${baseClass}--${size}`,
    `${baseClass}--${variant}`,

    {
      [`${baseClass}--closable`]: closable,
      [`${baseClass}--disabled`]: disabled,
      [`${baseClass}--checked`]: !disabled && innerChecked,
    },
    className,
  );

  const renderText = () => {
    // @ts-ignore
    if (Array.isArray(content) && content.length === 2) {
      return innerChecked ? content[0] : content[1];
    }
    return content;
  };

  const childNode = parseTNode(renderText()) || parseTNode(children);

  const tagStyle = {
    ...style,
  };

  const handleClick = (e) => {
    if (!props.disabled) {
      onClick?.(e);
      onInnerChecked(!innerChecked);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (!props.disabled) {
      onClose?.({ e });
    }
  };

  return (
    <span
      ref={ref}
      className={checkTagClass}
      aria-disabled={disabled}
      role="button"
      onClick={handleClick}
      style={tagStyle}
      {...otherProps}
    >
      {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
      <span className={`${baseClass}__text`}>{childNode}</span>
      {props.closable && (
        <span className={`${baseClass}__icon-close`} onClick={handleClose}>
          <CloseIcon />
        </span>
      )}
    </span>
  );
});

CheckTag.displayName = 'CheckTag';

export default CheckTag;
