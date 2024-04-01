// @ts-nocheck
import React, { ReactElement, forwardRef, useRef, useState } from 'react';
import classNames from 'classnames';
import { CheckIcon, CopyIcon } from 'tdesign-icons-react';
import copy from 'copy-to-clipboard';

import Ellipsis from './Ellipsis';
import { TdTextProps } from './type';
import { titleDefaultProps } from './defaultProps';
import useConfig from '../hooks/useConfig';
import useEllipsis from './useEllipsis';
import Button from '../button/Button';
import Tooltip from '../tooltip';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export type TypographyTextProps = TdTextProps;

const TextFunction = (props: TypographyTextProps, ref: React.Ref<HTMLSpanElement>) => {
  const { classPrefix } = useConfig();
  const prefixCls = `${classPrefix}-typography`;

  const [local, t] = useLocaleReceiver('typography');
  const copiedText = t(local.copied);

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
    copy(copyProps?.text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
    copyProps.onCopy?.();
  };

  const renderContent = (withChildren: boolean) => {
    const { tooltipProps } = copyProps;
    const wrapWithTooltip = (wrapContent) =>
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
                shape="circle"
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
};

export const Text = forwardRef(TextFunction);

Text.displayName = 'Text';
Text.defaultProps = titleDefaultProps;

export default Text;
