import React, { forwardRef, ReactNode, useState, useImperativeHandle, useEffect, useRef } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } from '@tencent/tdesign-icons-react';
import useConfig from '../_util/useConfig';
import { TdFormItemProps, ValueType, FormRule } from '../_type/components/form';
import Checkbox from '../checkbox';
import Tag from '../tag';
import { StyledProps } from '../_type';
import { validate as validateModal, isValueEmpty } from './formModel';
import { useFormContext } from './FormContext';

enum ValidateStatus {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}
export interface FormItemProps extends TdFormItemProps, StyledProps {
  // 子节点
  children?: React.ReactNode;
}

const { CheckTag } = Tag;
const CHECKED_TYPE = [Checkbox, CheckTag];

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const {
    children,
    label,
    name,
    help,
    statusIcon: statusIconFromProp,
    rules: rulesFromProp,
    labelWidth,
    labelAlign,
    initialData = '',
    className,
    style: formItemStyle,
  } = props;
  const {
    colon,
    requiredMark,
    layout,
    labelAlign: labelAlignFromContext,
    labelWidth: labelWidthFromContext,
    showErrorMessage,
    resetType,
    rules: rulesFromContext,
    statusIcon: statusIconFromContext,
  } = useFormContext();

  const [errorList, setErrorList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(ValidateStatus.TO_BE_VALIDATED);
  const [resetValidating, setResetValidating] = useState(false);
  const [needResetField, setNeedResetField] = useState(false);
  const [formValue, setFormValue] = useState(initialData);

  const innerFormItemsRef = useRef([]);
  const shouldValidate = useRef(null);

  const innerRules: FormRule[] = (rulesFromContext && rulesFromContext[name]) || rulesFromProp || [];
  const innerLabelWidth = isNil(labelWidth) ? labelWidthFromContext : labelWidth;
  const innerLabelAlign = isNil(labelAlign) ? labelAlignFromContext : labelAlign;

  const formItemClass = classNames(className, `${classPrefix}-form__item`);
  const formItemLabelClass = classNames(`${classPrefix}-form__label`, `${classPrefix}-form-item__${name}`, {
    [`${classPrefix}-form__label--required`]:
      requiredMark && innerRules.filter((rule: any) => rule.required).length > 0,
    [`${classPrefix}-form__label--colon`]: colon && label,
    [`${classPrefix}-form__label--top`]: innerLabelAlign === 'top' || !innerLabelWidth,
    [`${classPrefix}-form__label--left`]: innerLabelAlign === 'left' && innerLabelWidth,
    [`${classPrefix}-form__label--right`]: innerLabelAlign === 'right' && innerLabelWidth,
  });

  const contentClasses = classNames(`${classPrefix}-form__controls`, {
    [`${classPrefix}-is-success`]: showErrorMessage && verifyStatus === ValidateStatus.SUCCESS,
    [`${classPrefix}-is-warning`]: showErrorMessage && errorList.length && errorList[0].type === 'warning',
    [`${classPrefix}-is-error`]: showErrorMessage && errorList.length && errorList[0].type === 'error',
  });

  let labelStyle = {};
  let contentStyle = {};
  if (innerLabelWidth && innerLabelAlign !== 'top') {
    if (typeof innerLabelWidth === 'number') {
      labelStyle = { width: `${innerLabelWidth}px` };
      contentStyle = { marginLeft: layout !== 'inline' ? `${innerLabelWidth}px` : '' };
    } else {
      labelStyle = { width: innerLabelWidth };
      contentStyle = { marginLeft: layout !== 'inline' ? innerLabelWidth : '' };
    }
  }

  const renderTipsInfo = () => {
    let helpNode = null;
    if (help) helpNode = <div className={`${classPrefix}-form__help`}>{help}</div>;

    if (showErrorMessage && errorList.length && errorList[0].message) {
      return <p className={`${classPrefix}-input__extra`}>{errorList[0].message}</p>;
    }
    if (successList.length) {
      return <p className={`${classPrefix}-input__extra`}>{successList[0].message}</p>;
    }

    return helpNode;
  };

  const renderSuffixIcon = () => {
    if (statusIconFromProp === false) return null;

    const resultIcon = (iconSlot: ReactNode) => <span className={`${classPrefix}-form__status`}>{iconSlot}</span>;

    const getDefaultIcon = () => {
      const iconMap = {
        success: <CheckCircleFilledIcon size="25px" />,
        error: <CloseCircleFilledIcon size="25px" />,
        warning: <ErrorCircleFilledIcon size="25px" />,
      };
      if (verifyStatus === ValidateStatus.SUCCESS) {
        return resultIcon(iconMap[verifyStatus]);
      }
      if (errorList && errorList[0]) {
        const type = errorList[0].type || 'error';
        return resultIcon(iconMap[type]);
      }
      return null;
    };

    if (React.isValidElement(statusIconFromProp)) {
      return resultIcon(
        React.cloneElement(statusIconFromProp, { style: { color: 'unset' }, ...statusIconFromProp.props }),
      );
    }
    if (statusIconFromContext === true) {
      return getDefaultIcon();
    }
    if (React.isValidElement(statusIconFromContext)) {
      return resultIcon(statusIconFromProp);
    }

    return null;
  };

  function validate(trigger) {
    if (innerFormItemsRef.current.length) {
      return innerFormItemsRef.current.map((innerFormItem) => innerFormItem?.validate());
    }
    // 过滤不需要校验的规则
    const rules = trigger === 'all' ? innerRules : innerRules.filter((item) => (item.trigger || 'change') === trigger);
    setResetValidating(true);
    // 校验结果，包含正确的校验信息
    return new Promise((resolve) => {
      validateModal(formValue, rules).then((r) => {
        const filterErrorList = r.filter((item) => item.result !== true);
        setErrorList(filterErrorList);
        // 仅有自定义校验方法才会存在 successList
        setSuccessList(r.filter((item) => item.result === true && item.message && item.type === 'success'));
        let nextVerifyStatus = filterErrorList.length && rules.length ? ValidateStatus.FAIL : ValidateStatus.SUCCESS;
        // 非 require 且值为空 状态置为默认，无校验规则的都为默认
        if ((!rules.some((rule) => rule.required) && isValueEmpty(formValue)) || !rules.length) {
          nextVerifyStatus = ValidateStatus.TO_BE_VALIDATED;
        }
        setVerifyStatus(nextVerifyStatus);
        needResetField && resetHandler();
        setResetValidating(false);

        resolve({ [name]: !filterErrorList.length ? true : r });
      });
    });
  }

  // blur 下触发校验
  function handleItemBlur() {
    const filterRules = innerRules.filter((item) => item.trigger === 'blur');

    filterRules.length && validate('blur');
  }

  useEffect(() => {
    // 首次渲染不触发校验 后续判断是否检验也通过此字段控制
    if (!shouldValidate.current) {
      shouldValidate.current = true;
      return;
    }

    const filterRules = innerRules.filter((item) => (item.trigger || 'change') === 'change');

    filterRules.length && validate('change');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  function getEmptyValue(): ValueType {
    const type = Object.prototype.toString.call(initialData);
    let emptyValue: ValueType = '';
    if (type === '[object Array]') {
      emptyValue = [];
    }
    if (type === '[object Object]') {
      emptyValue = {};
    }
    return emptyValue;
  }

  function resetField() {
    if (!name) return;
    if (resetType === 'empty') {
      setFormValue(getEmptyValue());
    }
    if (resetType === 'initial') {
      setFormValue(initialData);
    }

    if (resetValidating) {
      setNeedResetField(true);
    } else {
      resetHandler();
    }
  }

  function resetHandler() {
    setNeedResetField(false);
    setErrorList([]);
    setSuccessList([]);
    setVerifyStatus(ValidateStatus.TO_BE_VALIDATED);
  }

  function setField(field: { value?: string; status?: ValidateStatus }) {
    const { value, status } = field;
    // 手动设置 status 则不需要校验 交给用户判断
    if (typeof status !== 'undefined') {
      shouldValidate.current = false;
      setErrorList([]);
      setSuccessList([]);
      setNeedResetField(false);
    }
    setFormValue(value);
    setVerifyStatus(status);
  }

  // 暴露 ref 实例方法
  useImperativeHandle(ref, (): any => ({
    name,
    value: formValue,
    setValue: setFormValue,
    setField,
    validate,
    resetField,
  }));

  return (
    <div className={formItemClass} style={formItemStyle} ref={ref}>
      {label && (
        <div className={formItemLabelClass} style={labelStyle}>
          <label htmlFor={props?.for}>{label}</label>
        </div>
      )}
      <div className={contentClasses} style={contentStyle}>
        <div className={`${classPrefix}-form__controls--content`}>
          {React.Children.map(children, (child, index) => {
            if (!child) return null;

            let onChangeFromProps = () => ({});
            let onBlurFromProps = () => ({});
            let ctrlKey = 'value';
            if (React.isValidElement(child)) {
              if (child.type === FormItem) {
                return React.cloneElement(child, {
                  ref: (el) => {
                    if (!el) return;
                    innerFormItemsRef.current[index] = el;
                  },
                });
              }
              if (typeof child.props.onChange === 'function') {
                onChangeFromProps = child.props.onChange;
              }
              if (typeof child.props.onBlur === 'function') {
                onBlurFromProps = child.props.onBlur;
              }
              if (typeof child.type === 'object') {
                ctrlKey = CHECKED_TYPE.includes(child.type) ? 'checked' : 'value';
              }
              return React.cloneElement(child, {
                ...child.props,
                [ctrlKey]: formValue,
                onChange: (value) => {
                  onChangeFromProps.call(null, value);
                  setFormValue(value);
                },
                onBlur: (value) => {
                  onBlurFromProps.call(null, value);
                  handleItemBlur();
                },
              });
            }
            return child;
          })}
          {renderSuffixIcon()}
        </div>
        {renderTipsInfo()}
      </div>
    </div>
  );
});

export default FormItem;
