import React, { useMemo } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { TdTreeSelectProps, TreeSelectValue } from '../_type/components/tree-select';
import useConfig from '../_util/useConfig';
import FakeArrow from '../common/FakeArrow';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
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
        <FakeArrow overlayClassName={`${classPrefix}-select-right-icon`} isActive={visible} disabled={disabled} />
      )}
      {showClose && !showLoading && (
        <CloseCircleFilledIcon className={`${classPrefix}-select-right-icon ${classPrefix}-select-right-icon__clear`} size={size} onClick={handleClear} />
      )}
      {showLoading && (
        <Loading loading={true} className={classNames(`${classPrefix}-select-right-icon`, `${classPrefix}-select-active-icon`)} size="small" />
      )}
    </>
  );
}
