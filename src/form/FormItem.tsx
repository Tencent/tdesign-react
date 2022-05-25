import React, { forwardRef, ReactNode, useState, useImperativeHandle, useEffect, useRef } from 'react';
import isObject from 'lodash/isObject';
import lodashTemplate from 'lodash/template';
import { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import type { TdFormItemProps, ValueType, FormItemValidateMessage } from './type';
import { StyledProps } from '../common';
import { validate as validateModal, isValueEmpty } from './formModel';
import { useFormContext, useFormListContext } from './FormContext';
import useFormItemStyle from './hooks/useFormItemStyle';
import { formItemDefaultProps } from './defaultProps';

import { ctrlKeyMap, getDefaultInitialData } from './useInitialData';

export enum VALIDATE_STATUS {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}
export interface FormItemProps extends TdFormItemProps, StyledProps {
  children?: React.ReactNode;
}

export interface FormItemInstance {
  name?: string | number | Array<string | number>;
  value?: any;
  setValue?: Function;
  setField?: Function;
  validate?: Function;
  resetField?: Function;
  setValidateMessage?: Function;
  resetValidate?: Function;
}

const FormItem = forwardRef<FormItemInstance, FormItemProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const {
    colon,
    layout,
    requiredMark: requiredMarkFromContext,
    labelAlign: labelAlignFromContext,
    labelWidth: labelWidthFromContext,
    showErrorMessage: showErrorMessageFromContext,
    disabled: disabledFromContext,
    resetType: resetTypeFromContext,
    rules: rulesFromContext,
    statusIcon: statusIconFromContext,
    errorMessage,
    formMapRef,
    onFormItemValueChange,
  } = useFormContext();

  const { name: formListName, rules: formListRules, formListMapRef } = useFormListContext();

  const {
    children,
    style,
    label,
    name,
    help,
    initialData,
    className,
    successBorder,
    statusIcon = statusIconFromContext,
    rules: innerRules = getInnerRules(name, rulesFromContext, formListName, formListRules),
    labelWidth = labelWidthFromContext,
    labelAlign = labelAlignFromContext,
    requiredMark = requiredMarkFromContext,
    showErrorMessage = showErrorMessageFromContext,
  } = props;

  const [errorList, setErrorList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(VALIDATE_STATUS.TO_BE_VALIDATED);
  const [resetValidating, setResetValidating] = useState(false);
  const [needResetField, setNeedResetField] = useState(false);
  const [formValue, setFormValue] = useState(getDefaultInitialData(children, initialData));

  const currentFormItemRef = useRef<FormItemInstance>(); // 当前 formItem 实例
  const innerFormItemsRef = useRef([]);
  const shouldValidate = useRef(null);
  const isMounted = useRef(false);

  const { formItemClass, formItemLabelClass, contentClass, labelStyle, contentStyle, helpNode, extraNode } =
    useFormItemStyle({
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
    });

  // 初始化 rules，最终以 formItem 上优先级最高
  function getInnerRules(name, formRules, formListName, formListRules) {
    if (Array.isArray(name)) {
      const [, itemKey] = name;
      return formRules?.[formListName]?.[itemKey] || formListRules?.[itemKey] || [];
    }
    return formRules?.[name] || formListRules || [];
  }

  const renderSuffixIcon = () => {
    if (statusIcon === false) return null;

    const resultIcon = (iconSlot: ReactNode) => <span className={`${classPrefix}-form__status`}>{iconSlot}</span>;

    const getDefaultIcon = () => {
      const iconMap = {
        success: <CheckCircleFilledIcon size="25px" />,
        error: <CloseCircleFilledIcon size="25px" />,
        warning: <ErrorCircleFilledIcon size="25px" />,
      };
      if (verifyStatus === VALIDATE_STATUS.SUCCESS) {
        return resultIcon(iconMap[verifyStatus]);
      }
      if (errorList && errorList[0]) {
        const type = errorList[0].type || 'error';
        return resultIcon(iconMap[type]);
      }
      return null;
    };

    if (React.isValidElement(statusIcon)) {
      return resultIcon(React.cloneElement(statusIcon, { style: { color: 'unset' }, ...statusIcon.props }));
    }
    if (statusIcon === true) {
      return getDefaultIcon();
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
        const filterErrorList = r
          .filter((item) => item.result !== true)
          .map((item) => {
            Object.keys(item).forEach((key) => {
              if (!item.message && errorMessage[key]) {
                const compiled = lodashTemplate(errorMessage[key]);
                // eslint-disable-next-line no-param-reassign
                item.message = compiled({ name: label, validate: item[key] });
              }
            });
            return item;
          });
        setErrorList(filterErrorList);
        // 仅有自定义校验方法才会存在 successList
        setSuccessList(r.filter((item) => item.result === true && item.message && item.type === 'success'));
        // 根据校验结果设置校验状态
        let nextVerifyStatus = filterErrorList.length && rules.length ? VALIDATE_STATUS.FAIL : VALIDATE_STATUS.SUCCESS;
        // 非 require 且值为空 状态置为默认，无校验规则的都为默认
        if ((!rules.some((rule) => rule.required) && isValueEmpty(formValue)) || !rules.length) {
          nextVerifyStatus = VALIDATE_STATUS.TO_BE_VALIDATED;
        }
        setVerifyStatus(nextVerifyStatus);
        needResetField && resetHandler();
        setResetValidating(false);

        resolve({ [name as string]: !filterErrorList.length ? true : r });
      });
    });
  }

  // blur 下触发校验
  function handleItemBlur() {
    const filterRules = innerRules.filter((item) => item.trigger === 'blur');

    filterRules.length && validate('blur');
  }

  function getResetValue(resetType: string): ValueType {
    if (resetType === 'initial') {
      return getDefaultInitialData(children, initialData);
    }

    let emptyValue: ValueType = '';
    if (Array.isArray(formValue)) {
      emptyValue = [];
    } else if (isObject(formValue)) {
      emptyValue = {};
    }
    return emptyValue;
  }

  function resetField(type: string) {
    if (typeof name === 'undefined') return;

    const resetType = type || resetTypeFromContext;
    const resetValue = getResetValue(resetType);
    // 防止触发校验
    if (resetValue !== formValue) {
      shouldValidate.current = false;
    }
    setFormValue(resetValue);

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
    setVerifyStatus(VALIDATE_STATUS.TO_BE_VALIDATED);
  }

  function setField(field: { value?: string; status?: VALIDATE_STATUS }) {
    const { value, status } = field;
    // 手动设置 status 则不需要校验 交给用户判断
    if (typeof status !== 'undefined') {
      shouldValidate.current = false;
      setErrorList([]);
      setSuccessList([]);
      setNeedResetField(false);
      setVerifyStatus(status);
    }
    if (typeof value !== 'undefined') {
      setFormValue(value);
    }
  }

  function setValidateMessage(validateMessage: FormItemValidateMessage[]) {
    if (!validateMessage || !Array.isArray(validateMessage)) return;
    if (validateMessage.length === 0) {
      setErrorList([]);
      setVerifyStatus(VALIDATE_STATUS.SUCCESS);
      return;
    }
    setErrorList(validateMessage);
    setVerifyStatus(VALIDATE_STATUS.FAIL);
  }

  useEffect(() => {
    // 首次渲染不触发校验 后续判断是否检验也通过此字段控制
    if (!shouldValidate.current || !isMounted.current) {
      isMounted.current = true;
      shouldValidate.current = true;
      return;
    }

    // value change event
    if (typeof name !== 'undefined') {
      if (formListName) {
        const formListValue = [];
        if (Array.isArray(name)) {
          const [index, itemKey] = name;
          formListValue[index] = { [itemKey]: formValue };
        } else {
          formListValue[name] = formValue;
        }
        onFormItemValueChange?.({ [formListName]: formListValue });
      } else if (Array.isArray(name)) {
        const fieldValue = name.reduceRight((prev, curr) => ({ [curr]: prev }), formValue);
        onFormItemValueChange?.({ ...fieldValue });
      } else {
        onFormItemValueChange?.({ [name as string]: formValue });
      }
    }

    const filterRules = innerRules.filter((item) => (item.trigger || 'change') === 'change');

    filterRules.length && validate('change');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  useEffect(() => {
    if (typeof name === 'undefined') return;

    // formList 下特殊处理
    if (formListName) {
      formListMapRef.current.set(name, currentFormItemRef);
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        formListMapRef.current.delete(name);
      };
    }

    if (!formMapRef) return;
    formMapRef.current.set(name, currentFormItemRef);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formMapRef.current.delete(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, formListName]);

  // 暴露 ref 实例方法
  const instance: FormItemInstance = {
    name,
    value: formValue,
    setValue: setFormValue,
    setField,
    validate,
    resetField,
    setValidateMessage,
    resetValidate: resetHandler,
  };
  useImperativeHandle(ref, (): FormItemInstance => instance);
  useImperativeHandle(currentFormItemRef, (): FormItemInstance => instance);

  return (
    <div className={formItemClass} style={style}>
      {label && (
        <div className={formItemLabelClass} style={labelStyle}>
          <label htmlFor={props?.for}>{label}</label>
        </div>
      )}
      <div className={contentClass()} style={contentStyle}>
        <div className={`${classPrefix}-form__controls-content`}>
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
                ctrlKey = ctrlKeyMap.get(child.type) || 'value';
              }
              return React.cloneElement(child, {
                disabled: disabledFromContext,
                ...child.props,
                [ctrlKey]: formValue,
                onChange: (value: any, ...args: any[]) => {
                  onChangeFromProps.call(null, value, ...args);
                  setFormValue(value);
                },
                onBlur: (value: any, ...args: any[]) => {
                  onBlurFromProps.call(null, value, ...args);
                  handleItemBlur();
                },
              });
            }
            return child;
          })}
          {renderSuffixIcon()}
        </div>
        {helpNode}
        {extraNode}
      </div>
    </div>
  );
});

FormItem.displayName = 'FormItem';
FormItem.defaultProps = formItemDefaultProps;

export default FormItem;
