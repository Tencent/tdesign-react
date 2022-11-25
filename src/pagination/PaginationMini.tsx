import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import {
  RoundIcon as TdRoundIcon,
  ChevronUpIcon as TdChevronUpIcon,
  ChevronDownIcon as TdChevronDownIcon,
  ChevronLeftIcon as TdChevronLeftIcon,
  ChevronRightIcon as TdChevronRightIcon,
} from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import Button from '../button';
import { StyledProps } from '../common';
import type { TdPaginationMiniProps } from './type';
import { paginationMiniDefaultProps } from './defaultProps';
import noop from '../_util/noop';

export interface PaginationMiniProps extends TdPaginationMiniProps, StyledProps {}

const PaginationMini = forwardRef((props: PaginationMiniProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { RoundIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } = useGlobalIcon({
    RoundIcon: TdRoundIcon,
    ChevronUpIcon: TdChevronUpIcon,
    ChevronDownIcon: TdChevronDownIcon,
    ChevronLeftIcon: TdChevronLeftIcon,
    ChevronRightIcon: TdChevronRightIcon,
  });

  const { variant, tips, showCurrent, disabled, layout, size, onChange = noop, className, style } = props;

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
    <div
      className={classNames(`${classPrefix}-pagination-mini`, className, {
        [`${classPrefix}-pagination-mini--outline`]: variant === 'outline',
      })}
      ref={ref}
      style={style}
    >
      <Button
        title={titleConfig.prev}
        variant={variant}
        size={size}
        shape="square"
        onClick={(e) => onChange({ e, trigger: 'prev' })}
        icon={layout === 'horizontal' ? <ChevronLeftIcon /> : <ChevronUpIcon />}
        className={`${classPrefix}-pagination-mini__prev`}
        disabled={disabledConfig.prev}
      />

      {showCurrent && (
        <Button
          title={titleConfig.current}
          variant={variant}
          size={size}
          shape="square"
          onClick={(e) => onChange({ e, trigger: 'current' })}
          icon={<RoundIcon />}
          className={`${classPrefix}-pagination-mini__current`}
          disabled={disabledConfig.current}
        />
      )}

      <Button
        title={titleConfig.next}
        variant={variant}
        size={size}
        shape="square"
        onClick={(e) => onChange({ e, trigger: 'next' })}
        icon={layout === 'horizontal' ? <ChevronRightIcon /> : <ChevronDownIcon />}
        className={`${classPrefix}-pagination-mini__next`}
        disabled={disabledConfig.next}
      />
    </div>
  );
});

PaginationMini.displayName = 'PaginationMini';
PaginationMini.defaultProps = paginationMiniDefaultProps;

export default PaginationMini;
