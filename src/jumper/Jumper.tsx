import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import { ChevronLeftIcon, RoundIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import Button from '../button';
import { StyledProps } from '../common';
import type { TdJumperProps } from './type';
import { jumperDefaultProps } from './defaultProps';

export interface JumperProps extends TdJumperProps, StyledProps {}

const Jumper = forwardRef((props: JumperProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();

  const { tips, showCurrent, disabled, layout, size, onChange, className, style } = props;

  const titleConfig = useMemo(() => {
    if (isObject(tips)) return tips;
    if (tips === true) return { prev: '上一页', current: '当前', next: '下一页' };
    return {};
  }, [tips]);

  const disabledConfig = useMemo(() => {
    if (isObject(disabled)) return disabled;
    if (disabled === true) return { prev: true, current: true, next: true };
    return { prev: false, current: false, next: false };
  }, [disabled]);

  return (
    <div className={classNames(`${classPrefix}-jumper`, className)} ref={ref} style={style}>
      <Button
        title={titleConfig.prev}
        variant="text"
        size={size}
        shape="square"
        onClick={(e) => onChange({ e, trigger: 'prev' })}
        icon={layout === 'horizontal' ? <ChevronLeftIcon /> : <ChevronUpIcon />}
        className={`${classPrefix}-jumper__btn`}
        disabled={disabledConfig.prev}
      />

      {showCurrent && (
        <Button
          title={titleConfig.current}
          variant="text"
          size={size}
          shape="square"
          onClick={(e) => onChange({ e, trigger: 'current' })}
          icon={<RoundIcon />}
          className={`${classPrefix}-jumper__btn`}
          disabled={disabledConfig.current}
        />
      )}

      <Button
        title={titleConfig.next}
        variant="text"
        size={size}
        shape="square"
        onClick={(e) => onChange({ e, trigger: 'next' })}
        icon={layout === 'horizontal' ? <ChevronRightIcon /> : <ChevronDownIcon />}
        className={`${classPrefix}-jumper__btn`}
        disabled={disabledConfig.next}
      />
    </div>
  );
});

Jumper.displayName = 'Jumper';
Jumper.defaultProps = jumperDefaultProps;

export default Jumper;
