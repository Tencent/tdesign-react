import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import { VALIDATE_STATUS } from '../FormItem';

export default function useFormItemStyle(props) {
  const { classPrefix } = useConfig();

  const {
    className,
    help,
    name,
    successBorder,
    errorList,
    layout,
    verifyStatus,
    colon,
    label,
    labelWidth,
    labelAlign,
    requiredMark,
    showErrorMessage,
    innerRules,
    renderTipsInfo,
  } = props;

  // formList 下 name 为数组
  const renderName = Array.isArray(name) ? name.join('-') : name;

  const formItemClass = classNames(className, `${classPrefix}-form__item`, {
    [`${classPrefix}-form-item__${renderName}`]: renderName,
    [`${classPrefix}-form__item-with-help`]: help,
    [`${classPrefix}-form__item-with-extra`]: renderTipsInfo(),
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

    const isSuccess = verifyStatus === VALIDATE_STATUS.SUCCESS;
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
  };
}
