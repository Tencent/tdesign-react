import React, { forwardRef, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import { FileCopyIcon, CheckIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import { TooltipLite } from '../tooltip';
import { Copyable } from './type';
import { StyledProps } from '../common';

export interface CopyProps extends Copyable, StyledProps {}

const TypographyCopy = forwardRef<HTMLSpanElement, CopyProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const timerRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const { className, style, text, icon, tooltips, onCopy, format, ...resetProps } = props;

  const renderIcon = useMemo(() => {
    if (Array.isArray(icon)) {
      const [beforeCopy = <FileCopyIcon size="16px" />, afterCopy = <CheckIcon size="16px" />] = icon;
      return isCopied ? afterCopy : beforeCopy;
    }
    return isCopied ? <CheckIcon size="16px" /> : <FileCopyIcon size="16px" />;
  }, [icon, isCopied]);

  function handleCopy(text: string) {
    const type = format || 'text/plain';
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(() => {
      onCopy?.(text);

      setIsCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsCopied(false), 2000);
    });
  }

  return (
    <span
      ref={ref}
      style={style}
      className={classNames(`${classPrefix}-typography-copy`, className)}
      {...resetProps}
      onClick={() => handleCopy(text)}
    >
      {tooltips ? <TooltipLite content={isCopied ? tooltips[1] : tooltips[0]}>{renderIcon}</TooltipLite> : renderIcon}
    </span>
  );
});

TypographyCopy.displayName = 'TypographyCopy';

export default TypographyCopy;
