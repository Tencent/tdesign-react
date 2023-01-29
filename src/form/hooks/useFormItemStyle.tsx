import React, { useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import parseTNode from '../../_util/parseTNode';
import { ValidateStatus } from '../const';

export default function useFormItemStyle(props) {
  const { classPrefix } = useConfig();

  const {
    className,
    help,
    tips,
    snakeName,
    status,
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

  // 传入 status 时受控
  const renderStatus = status || verifyStatus;

  // help 文本
  const helpNode = help && <div className={`${classPrefix}-input__help`}>{parseTNode(help)}</div>;

  // 判断是否有星号
  const needRequiredMark = requiredMark || (requiredMark ?? innerRules.filter((rule: any) => rule.required).length > 0);

  // 提示文本
  const extraNode = useMemo(() => {
    let extra = tips ? (
      <div className={`${classPrefix}-input__extra`} title={tips}>
        {tips}
      </div>
    ) : null;

    if (showErrorMessage && errorList?.[0]?.message) {
      extra = (
        <div className={`${classPrefix}-input__extra`} title={errorList[0].message}>
          {errorList[0].message}
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
  }, [showErrorMessage, errorList, successList, tips, classPrefix]);

  const formItemClass = classNames(`${classPrefix}-form__item`, className, {
    [`${classPrefix}-form-item__${snakeName}`]: snakeName,
    [`${classPrefix}-form__item-with-help`]: helpNode,
    [`${classPrefix}-form__item-with-extra`]: extraNode,
  });

  const formItemLabelClass = classNames(`${classPrefix}-form__label`, {
    [`${classPrefix}-form__label--required`]: needRequiredMark,
    [`${classPrefix}-form__label--colon`]: colon && label,
    [`${classPrefix}-form__label--top`]: labelAlign === 'top' || !labelWidth,
    [`${classPrefix}-form__label--left`]: labelAlign === 'left' && labelWidth,
    [`${classPrefix}-form__label--right`]: labelAlign === 'right' && labelWidth,
  });

  const contentClass = () => {
    const controlCls = `${classPrefix}-form__controls`;
    if (!showErrorMessage) return controlCls;

    const isSuccess = renderStatus === ValidateStatus.SUCCESS;
    if (isSuccess) {
      return classNames(controlCls, `${classPrefix}-is-success`, {
        [`${classPrefix}-form--success-border`]: successBorder,
      });
    }

    return classNames(controlCls, {
      [`${classPrefix}-is-warning`]: renderStatus === 'warning',
      [`${classPrefix}-is-error`]: ['fail', 'error'].includes(renderStatus),
      [`${classPrefix}-form--has-error`]:
        renderStatus === ValidateStatus.ERROR || renderStatus === ValidateStatus.WARNING,
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
