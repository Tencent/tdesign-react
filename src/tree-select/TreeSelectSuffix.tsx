import React, { useMemo } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import { TdTreeSelectProps, TreeSelectValue } from './type';
import useConfig from '../_util/useConfig';
import FakeArrow from '../common/FakeArrow';
import Loading from '../loading';

export interface TreeSelectSuffixProps extends TdTreeSelectProps {
  visible: boolean;
  isHover: boolean;
  showLoading: boolean;
  handleClear: React.MouseEventHandler<SVGSVGElement>;
}

export default function TreeSelectSuffix(props: TreeSelectSuffixProps) {
  const { visible, isHover, handleClear, showLoading, clearable, multiple, value, disabled, size } = props;
  const { classPrefix } = useConfig();

  const showArrow: boolean = useMemo(
    () =>
      !clearable ||
      !isHover ||
      disabled ||
      (!multiple && !value && value !== 0) ||
      (multiple && Array.isArray(value) && isEmpty(value)),
    [clearable, isHover, disabled, multiple, value],
  );

  const showClose: boolean = useMemo(
    () =>
      clearable &&
      isHover &&
      !disabled &&
      ((!multiple && (!!value || value === 0)) || (multiple && !isEmpty(value as Array<TreeSelectValue>))),
    [clearable, isHover, disabled, multiple, value],
  );

  return (
    <>
      {showArrow && !showLoading && (
        <FakeArrow overlayClassName={`${classPrefix}-select__right-icon`} isActive={visible} disabled={disabled} />
      )}
      {showClose && !showLoading && (
        <CloseCircleFilledIcon
          className={`${classPrefix}-select__right-icon ${classPrefix}-select__right-icon-clear`}
          size={size}
          onClick={handleClear}
        />
      )}
      {showLoading && (
        <Loading
          loading={true}
          className={classNames(`${classPrefix}-select__right-icon`, `${classPrefix}-select__active-icon`)}
          size="small"
        />
      )}
    </>
  );
}
