import React, { useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import renderTNode from '../../_util/renderTNode';
import { ValidateStatus } from '../const';

export default function useFormItemStyle(props) {
  const { classPrefix } = useConfig();

  const {
    className,
    help,
    name,
    successBorder,
    errorList,
    successList,
    layout,
    verifyStatus,
    colon,
    label,
    labelWidth,
    labelAlign,
    requiredMark,
    showErrorMessage,
    innerRules,
  } = props;

  // formList 下 name 为数组
  const renderName = Array.isArray(name) ? name.join('-') : name;

  // help 文本
  const helpNode = help && <div className={`${classPrefix}-input__help`}>{renderTNode(help)}</div>;

  // 提示文本
  const extraNode = useMemo(() => {
    let extra = null;
    const list = errorList;
    if (showErrorMessage && list && list[0] && list[0].message) {
      extra = (
        <div className={`${classPrefix}-input__extra`} title={list[0].message}>
          {list[0].message}
        </div>
      );
    } else if (successList.length) {
      extra = (
        <div className={`${classPrefix}-input__extra`} title={successList[0].message}>
          {successList[0].message}
        </div>
      );
    }

    return extra;
  }, [showErrorMessage, errorList, successList, classPrefix]);

  const formItemClass = classNames(`${classPrefix}-form__item`, className, {
    [`${classPrefix}-form-item__${renderName}`]: renderName,
    [`${classPrefix}-form__item-with-help`]: helpNode,
    [`${classPrefix}-form__item-with-extra`]: extraNode,
  });

  const formItemLabelClass = classNames(`${classPrefix}-form__label`, {
    [`${classPrefix}-form__label--required`]:
      requiredMark && innerRules.filter((rule: any) => rule.required).length > 0,
    [`${classPrefix}-form__label--colon`]: colon && label,
    [`${classPrefix}-form__label--top`]: labelAlign === 'top' || !labelWidth,
    [`${classPrefix}-form__label--left`]: labelAlign === 'left' && labelWidth,
    [`${classPrefix}-form__label--right`]: labelAlign === 'right' && labelWidth,
  });

  const contentClass = () => {
    const controlCls = `${classPrefix}-form__controls`;
    if (!showErrorMessage) return controlCls;

    const isSuccess = verifyStatus === ValidateStatus.SUCCESS;
    if (isSuccess) {
      return classNames(controlCls, `${classPrefix}-is-success`, {
        [`${classPrefix}-form--success-border`]: successBorder,
      });
    }

    const firstErrorType = errorList.length && (errorList[0].type || 'error');
    return classNames(controlCls, {
      [`${classPrefix}-is-warning`]: firstErrorType === 'warning',
      [`${classPrefix}-is-error`]: firstErrorType === 'error',
    });
  };

  let labelStyle = {};
  let contentStyle = {};
  if (label && labelWidth && labelAlign !== 'top') {
    if (typeof labelWidth === 'number') {
      labelStyle = { width: `${labelWidth}px` };
      contentStyle = { marginLeft: layout !== 'inline' ? `${labelWidth}px` : '' };
    } else {
      labelStyle = { width: labelWidth };
      contentStyle = { marginLeft: layout !== 'inline' ? labelWidth : '' };
    }
  }

  return {
    formItemClass,
    formItemLabelClass,
    contentClass,
    labelStyle,
    contentStyle,
    helpNode,
    extraNode,
  };
}
