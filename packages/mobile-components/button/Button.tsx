import React, { useMemo } from 'react';
import classnames from 'classnames';
import TLoading from '../loading';
import parseTNode from '../_util/parseTNode';
import { TdButtonProps } from './type';
import { buttonDefaultProps } from './defaultProps';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import useHover from '../hooks/useHover';

export interface ButtonProps
  extends
    TdButtonProps,
    Omit<React.AllHTMLAttributes<HTMLElement>, 'content' | 'children' | 'size' | 'type' | 'shape'> {}

const Button: React.FC<ButtonProps> = (originProps) => {
  const props = useDefaultProps(originProps, buttonDefaultProps);
  const {
    className,
    style,
    block,
    children,
    content,
    disabled,
    form,
    ghost,
    href,
    icon,
    suffix,
    loading,
    shape,
    size,
    tag,
    theme,
    type,
    variant,
    onClick,
    loadingProps,
    ...otherProps
  } = props;
  const buttonClass = usePrefixClass('button');
  const childNode = content || children;

  const hoverDisabled = useMemo(() => disabled || loading, [disabled, loading]);
  const ref = useHover({ className: `${buttonClass}--hover`, disabled: hoverDisabled });

  const renderTag = useMemo(() => (!tag && href ? 'a' : tag || 'button'), [tag, href]);
  const isNativeButton = useMemo(() => renderTag === 'button', [renderTag]);
  const isAriaDisabled = useMemo(() => loading || (!isNativeButton && disabled), [loading, isNativeButton, disabled]);
  const shouldInterceptClick = useMemo(
    () => loading || (!isNativeButton && disabled),
    [loading, isNativeButton, disabled],
  );

  const tabIndex = useMemo(() => {
    if (!disabled) return 0;
    return isNativeButton ? undefined : -1;
  }, [disabled, isNativeButton]);

  const handleDisabledClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return React.createElement(
    renderTag,
    {
      ...otherProps,
      ref,
      role: isNativeButton ? undefined : 'button',
      type: isNativeButton ? type : undefined,
      disabled: isNativeButton ? disabled || loading : undefined,
      'aria-disabled': isAriaDisabled || undefined,
      href: href || undefined,
      tabIndex,
      form: isNativeButton ? form : undefined,
      className: classnames(
        [
          `${buttonClass}`,
          `${buttonClass}--size-${size}`,
          `${buttonClass}--${variant}`,
          `${buttonClass}--${theme}`,
          `${buttonClass}--${shape}`,
          className,
        ],
        {
          [`${buttonClass}--ghost`]: ghost,
          [`${buttonClass}--loading`]: loading,
          [`${buttonClass}--disabled`]: disabled,
          [`${buttonClass}--block`]: block,
        },
      ),
      style,
      onClick: shouldInterceptClick ? handleDisabledClick : onClick,
    },
    <>
      {loading ? <TLoading inheritColor {...loadingProps} /> : parseTNode(icon)}
      {childNode && <span className={`${buttonClass}__content`}> {parseTNode(childNode)}</span>}
      {parseTNode(suffix)}
    </>,
  );
};

Button.displayName = 'Button';

export default Button;
