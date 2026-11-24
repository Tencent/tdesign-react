import React, { forwardRef, useState, useCallback, useMemo, ReactNode } from 'react';
import classNames from 'classnames';
import { CopyIcon, CheckIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import parseTNode from '../_util/parseTNode';
import { copy } from '../_util/copy-to-clipboard';
import { textDefaultProps } from './defaultProps';
import Ellipsis from './Ellipsis';

import type { StyledProps } from '../common';
import type { TdTextProps } from './type';

export interface TextProps extends TdTextProps, StyledProps {}

const Text = forwardRef<HTMLSpanElement, TextProps>((originalProps, ref) => {
  const props = useDefaultProps<TextProps>(originalProps, textDefaultProps);
  const { classPrefix } = useConfig();
  const prefixCls = `${classPrefix}-typography`;

  const {
    className,
    style,
    children,
    code,
    copyable,
    delete: del,
    disabled,
    ellipsis,
    italic,
    keyboard,
    mark,
    strong,
    theme,
    underline,
  } = props;

  const [isCopied, setIsCopied] = useState(false);

  const textClassNames = useMemo(() => {
    const list: string[] = [prefixCls];
    if (disabled) {
      list.push(`${prefixCls}--disabled`);
    } else if (theme && ['primary', 'secondary', 'success', 'warning', 'error'].includes(theme)) {
      list.push(`${prefixCls}--${theme}`);
    }
    return classNames(list, className);
  }, [prefixCls, disabled, theme, className]);

  /** 文本装饰 - 支持多装饰嵌套 */
  const wrapperDecorations = useCallback(
    (content: ReactNode): ReactNode => {
      let currentContent = content;

      const wrap = (needed: boolean, Tag: string, styles: React.CSSProperties = {}) => {
        if (!needed) return;
        currentContent = React.createElement(Tag, { style: styles }, currentContent);
      };

      wrap(!!strong, 'strong');
      wrap(!!underline, 'u');
      wrap(!!del, 'del');
      wrap(!!code, 'code');
      wrap(mark !== false && mark !== undefined, 'mark', typeof mark === 'string' ? { backgroundColor: mark } : {});
      wrap(!!keyboard, 'kbd');
      wrap(!!italic, 'i');

      return currentContent;
    },
    [strong, underline, del, code, mark, keyboard, italic],
  );

  /** 获取要复制的文本 */
  const getChildrenText = useCallback((): string => {
    if (typeof copyable === 'object' && copyable?.text) {
      return copyable.text;
    }
    if (typeof children === 'string') {
      return children;
    }
    if (Array.isArray(children)) {
      return children
        .map((child) => {
          if (typeof child === 'string') return child;
          return '';
        })
        .join('');
    }
    return '';
  }, [copyable, children]);

  /** 复制点击处理 */
  const handleCopyClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);

      copy(getChildrenText());

      if (typeof copyable === 'object' && typeof copyable.onCopy === 'function') {
        copyable.onCopy();
      }
    },
    [copyable, getChildrenText],
  );

  /** 渲染复制按钮 */
  const renderCopy = () => {
    if (!copyable) return null;

    let icon: ReactNode = null;

    if (typeof copyable === 'object' && copyable.suffix) {
      icon = parseTNode(copyable.suffix, { copied: isCopied });
    }

    // 如果没有自定义 suffix，使用默认图标
    if (!icon) {
      icon = isCopied ? <CheckIcon /> : <CopyIcon />;
    }

    return (
      <span className={`${prefixCls}__copy`} onClick={handleCopyClick}>
        {icon}
      </span>
    );
  };

  const decoratedContent = wrapperDecorations(children as ReactNode);

  if (ellipsis) {
    return (
      <Ellipsis
        className={textClassNames}
        style={style}
        ellipsis={ellipsis}
        renderCopy={copyable ? () => renderCopy() : undefined}
      >
        {decoratedContent}
      </Ellipsis>
    );
  }

  return (
    <span className={textClassNames} style={style} ref={ref}>
      {decoratedContent}
      {renderCopy()}
    </span>
  );
});

Text.displayName = 'Text';

export default Text;
