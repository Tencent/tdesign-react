import React, { ReactElement, useRef, forwardRef, useState } from 'react';
import classNames from 'classnames';
import { CheckIcon, CopyIcon } from 'tdesign-icons-react';

import Ellipsis from './ellipsis/Ellipsis';
import useConfig from '../hooks/useConfig';
import useEllipsis from './ellipsis/useEllipsis';
import Button from '../button/Button';
import Tooltip from '../tooltip';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import useDefaultProps from '../hooks/useDefaultProps';
import { textDefaultProps } from './defaultProps';
import copyText from '../_util/copyText';

import type { StyledProps } from '../common';
import type { TdTextProps } from './type';

export type TypographyTextProps = TdTextProps &
  StyledProps & {
    children: React.ReactNode;
  };

const Text = forwardRef<HTMLSpanElement, TypographyTextProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();
  const props = useDefaultProps<TypographyTextProps>(originalProps, textDefaultProps);

  const prefixCls = `${classPrefix}-typography`;

  const [local, t] = useLocaleReceiver('typography');
  const copiedText = t(local.copiedText);

  const {
    theme,
    disabled,
    className,
    copyable,
    strong,
    mark,
    code,
    keyboard,
    underline,
    delete: deleteProp,
    italic,
    children,
    ellipsis,
    ...rest
  } = props;

  const getComponent = () => {
    const componentMap = {
      strong: !!strong,
      mark: !!mark,
      code: !!code,
      kbd: !!keyboard,
      u: !!underline,
      del: !!deleteProp,
      i: !!italic,
    };
    return Object.entries(componentMap).find(([, condition]) => !!condition)?.[0] as keyof HTMLElementTagNameMap;
  };

  const currentRef = useRef();
  const { ellipsisProps } = useEllipsis(ellipsis);
  const Component = getComponent();

  const textEllipsisProps = {
    ...ellipsisProps,
  };

  const [isCopied, setIsCopied] = useState(false);

  const copyProps =
    typeof copyable === 'boolean'
      ? {
          text: children.toString(),
          onCopy: Function.prototype,
          tooltipProps: isCopied
            ? {
                content: copiedText,
              }
            : null,
        }
      : {
          text: copyable?.text || children.toString(),
          onCopy: copyable?.onCopy?.(),
          tooltipProps: {
            ...copyable?.tooltipProps,
            content: isCopied ? copiedText : copyable?.tooltipProps?.content,
          },
          suffix: copyable?.suffix,
        };

  const handleCopy = () => {
    copyText(copyProps?.text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
    if (typeof copyProps.onCopy === 'function') copyProps.onCopy();
  };

  const renderContent = (withChildren: boolean) => {
    const { tooltipProps } = copyProps;
    const wrapWithTooltip = (wrapContent: React.ReactNode) =>
      tooltipProps ? <Tooltip {...tooltipProps}>{wrapContent}</Tooltip> : wrapContent;

    const getSuffix = (): ReactElement => {
      if (typeof copyProps?.suffix === 'function') {
        return copyProps.suffix({ copied: isCopied }) as ReactElement;
      }
      return isCopied ? <CheckIcon /> : <CopyIcon />;
    };

    return (
      <>
        {withChildren ? children : null}
        {copyable
          ? wrapWithTooltip(
              <Button
                shape="square"
                theme="primary"
                variant="text"
                icon={getSuffix() as ReactElement}
                onClick={handleCopy}
              />,
            )
          : null}
      </>
    );
  };

  if (!ellipsis) {
    return Component ? (
      <span className={classNames(className, prefixCls)} ref={ref || currentRef} {...rest}>
        {/* @ts-ignore */}
        <Component>{renderContent(true)}</Component>
      </span>
    ) : (
      <span
        className={classNames(className, {
          [`${prefixCls}--${theme}`]: theme,
          [`${prefixCls}--disabled`]: disabled,
        })}
        {...rest}
      >
        {renderContent(true)}
      </span>
    );
  }

  return (
    <>
      {Component ? (
        <span className={classNames(className, prefixCls)} ref={ref || currentRef} {...rest}>
          <Ellipsis {...textEllipsisProps} component={Component}>
            {children}
          </Ellipsis>
        </span>
      ) : (
        <Ellipsis
          {...textEllipsisProps}
          className={classNames(className, {
            [`${prefixCls}--${theme}`]: theme,
            [`${prefixCls}--disabled`]: disabled,
          })}
          {...rest}
        >
          {children}
        </Ellipsis>
      )}
      {renderContent(false)}
    </>
  );
});

export default Text;
