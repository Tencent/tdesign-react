import React, { forwardRef, ReactNode, useState, useImperativeHandle, useEffect, useRef, useMemo } from 'react';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import get from 'lodash/get';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import lodashTemplate from 'lodash/template';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';

import { calcFieldValue } from './utils';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import type { TdFormItemProps, ValueType, FormItemValidateMessage, NamePath, FormInstanceFunctions } from './type';
import { StyledProps } from '../common';
import { HOOK_MARK } from './hooks/useForm';
import { validate as validateModal } from './formModel';
import { useFormContext, useFormListContext } from './FormContext';
import useFormItemStyle from './hooks/useFormItemStyle';
import { formItemDefaultProps } from './defaultProps';

import { ctrlKeyMap, getDefaultInitialData } from './useInitialData';
import { ValidateStatus } from './const';

export interface FormItemProps extends TdFormItemProps, StyledProps {
  children?: React.ReactNode | ((form: FormInstanceFunctions) => React.ReactElement);
}

export interface FormItemInstance {
  name?: NamePath;
  isUpdated?: boolean;
  value?: any;
  getValue?: Function;
  setValue?: Function;
  setField?: Function;
  validate?: Function;
  resetField?: Function;
  setValidateMessage?: Function;
  resetValidate?: Function;
  validateOnly?: Function;
  isFormList?: boolean;
}

const FormItem = forwardRef<FormItemInstance, FormItemProps>((props, ref) => {
  const { classPrefix, form: globalFormConfig } = useConfig();
  const { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });
  const {
    form,
    colon,
    layout,
    initialData: initialDataFromContext,
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
    status,
    tips,
    help,
    initialData,
    className,
    shouldUpdate,
    successBorder,
    statusIcon = statusIconFromContext,
    rules: innerRules = getInnerRules(name, rulesFromContext, formListName, formListRules),
    labelWidth = labelWidthFromContext,
    labelAlign = labelAlignFromContext,
    requiredMark = requiredMarkFromContext,
  } = props;

  const [, forceUpdate] = useState({}); // custom render state
  const [freeShowErrorMessage, setFreeShowErrorMessage] = useState(undefined);
  const [errorList, setErrorList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState('validating');
  const [resetValidating, setResetValidating] = useState(false);
  const [needResetField, setNeedResetField] = useState(false);
  const [formValue, setFormValue] = useState(
    getDefaultInitialData({
      name,
      formListName,
      children,
      initialData,
      initialDataFromContext,
    }),
  );

  const formItemRef = useRef<FormItemInstance>(); // 当前 formItem 实例
  const innerFormItemsRef = useRef([]);
  const isUpdatedRef = useRef(false); // 校验开关
  const shouldValidate = useRef(false); // 校验开关
  const valueRef = useRef(formValue); // 当前最新值
  const errorListMapRef = useRef(new Map());
  const snakeName = []
    .concat(formListName, name)
    .filter((item) => item !== undefined)
    .join('_'); // 转化 name

  const errorMessages = useMemo(() => errorMessage ?? globalFormConfig.errorMessage, [errorMessage, globalFormConfig]);

  const showErrorMessage = useMemo(() => {
    if (typeof freeShowErrorMessage === 'boolean') return freeShowErrorMessage;
    if (typeof props.showErrorMessage === 'boolean') return props.showErrorMessage;
    return showErrorMessageFromContext;
  }, [freeShowErrorMessage, props.showErrorMessage, showErrorMessageFromContext]);

  const { formItemClass, formItemLabelClass, contentClass, labelStyle, contentStyle, helpNode, extraNode } =
    useFormItemStyle({
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
    });

  // 更新 form 表单字段
  const updateFormValue = (newVal: any, validate = true) => {
    const { setPrevStore } = form?.getInternalHooks?.(HOOK_MARK) || {};
    setPrevStore?.(form?.getFieldsValue?.(true));

    isUpdatedRef.current = true;
    shouldValidate.current = validate;
    valueRef.current = newVal;
    setFormValue(newVal);
  };

  // 初始化 rules，最终以 formItem 上优先级最高
  function getInnerRules(name, formRules, formListName, formListRules) {
    if (Array.isArray(name)) {
      return get(formRules?.[formListName], name) || get(formListRules, name) || [];
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
      if (verifyStatus === ValidateStatus.SUCCESS) {
        return resultIcon(iconMap[verifyStatus]);
      }
      if (errorList && errorList[0]) {
        const type = errorList[0].type || 'error';
        return resultIcon(iconMap[type]);
      }
      return null;
    };

    if (React.isValidElement(statusIcon)) {
      // @ts-ignore
      return resultIcon(React.cloneElement(statusIcon, { style: { color: 'unset' }, ...statusIcon.props }));
    }
    if (statusIcon === true) {
      return getDefaultIcon();
    }

    return null;
  };

  async function analysisValidateResult(trigger) {
    const result = {
      successList: [],
      errorList: [],
      rules: [],
      resultList: [],
      allowSetValue: false,
    };
    result.rules = trigger === 'all' ? innerRules : innerRules.filter((item) => (item.trigger || 'change') === trigger);
    if (!result.rules?.length) {
      setResetValidating(false);
      return result;
    }
    result.allowSetValue = true;
    result.resultList = await validateModal(formValue, result.rules);
    result.errorList = result.resultList
      .filter((item) => item.result !== true)
      .map((item) => {
        Object.keys(item).forEach((key) => {
          if (!item.message && errorMessages[key]) {
            const compiled = lodashTemplate(errorMessages[key]);
            // eslint-disable-next-line
            item.message = compiled({ name: isString(label) ? label : name, validate: item[key] });
          }
        });
        return item;
      });
    // 仅有自定义校验方法才会存在 successList
    result.successList = result.resultList.filter(
      (item) => item.result === true && item.message && item.type === 'success',
    );

    return result;
  }

  async function validate(trigger = 'all', showErrorMessage?: boolean) {
    if (innerFormItemsRef.current.length) {
      return innerFormItemsRef.current.map((innerFormItem) => innerFormItem?.validate(trigger, showErrorMessage));
    }

    setResetValidating(true);
    // undefined | boolean
    setFreeShowErrorMessage(showErrorMessage);
    const {
      successList: innerSuccessList,
      errorList: innerErrorList,
      rules: validateRules,
      resultList,
      allowSetValue,
    } = await analysisValidateResult(trigger);

    // 缓存不同 trigger 下的错误信息 all 包含了所有场景需过滤
    if (innerErrorList.length && trigger !== 'all') {
      errorListMapRef.current.set(trigger, innerErrorList);
    } else {
      errorListMapRef.current.delete(trigger);
    }
    const cacheErrorList = [...errorListMapRef.current.values()].flat();

    if (allowSetValue) {
      setSuccessList(innerSuccessList);
      setErrorList(cacheErrorList.length ? cacheErrorList : innerErrorList);
    }
    // 根据校验结果设置校验状态
    if (validateRules.length) {
      let status = ValidateStatus.SUCCESS;
      if (innerErrorList.length || cacheErrorList.length) {
        status = innerErrorList?.[0]?.type || cacheErrorList?.[0]?.type || ValidateStatus.ERROR;
      }
      setVerifyStatus(status);
    } else {
      setVerifyStatus(ValidateStatus.VALIDATING);
    }
    // 重置处理
    if (needResetField) {
      resetHandler();
    }
    setResetValidating(false);

    return {
      [snakeName]: innerErrorList.length === 0 ? true : resultList,
    };
  }

  async function validateOnly(trigger = 'all') {
    const { errorList: innerErrorList, resultList } = await analysisValidateResult(trigger);

    return {
      [snakeName]: innerErrorList.length === 0 ? true : resultList,
    };
  }

  // blur 下触发校验
  function handleItemBlur() {
    const filterRules = innerRules.filter((item) => item.trigger === 'blur');

    filterRules.length && validate('blur');
  }

  function getResetValue(resetType: string): ValueType {
    if (resetType === 'initial') {
      return getDefaultInitialData({
        name,
        formListName,
        children,
        initialData,
        initialDataFromContext,
      });
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
    // reset 不校验
    updateFormValue(resetValue, false);

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
    setVerifyStatus(ValidateStatus.VALIDATING);
  }

  function setField(field: { value?: string; status?: ValidateStatus; validateMessage?: FormItemValidateMessage }) {
    const { value, status, validateMessage } = field;
    if (typeof status !== 'undefined') {
      setErrorList(validateMessage ? [validateMessage] : []);
      setSuccessList(validateMessage ? [validateMessage] : []);
      setNeedResetField(false);
      setVerifyStatus(status);
    }
    if (typeof value !== 'undefined') {
      // 手动设置 status 则不需要校验 交给用户判断
      updateFormValue(value, typeof status === 'undefined' ? true : false);
    }
  }

  function setValidateMessage(validateMessage: FormItemValidateMessage[]) {
    if (!validateMessage || !Array.isArray(validateMessage)) return;
    if (validateMessage.length === 0) {
      setErrorList([]);
      setVerifyStatus(ValidateStatus.SUCCESS);
      return;
    }
    setErrorList(validateMessage);
    const status = validateMessage?.[0]?.type || ValidateStatus.ERROR;
    setVerifyStatus(status);
  }

  useEffect(() => {
    // 注册自定义更新回调
    if (!shouldUpdate || !form) return;

    const { getPrevStore, registerWatch } = form?.getInternalHooks?.(HOOK_MARK) || {};
    const cancelRegister = registerWatch?.(() => {
      const currStore = form?.getFieldsValue?.(true) || {};
      let updateFlag = shouldUpdate as boolean;
      if (isFunction(shouldUpdate)) updateFlag = shouldUpdate(getPrevStore?.(), currStore);

      if (updateFlag) forceUpdate({});
    });

    return cancelRegister;
  }, [shouldUpdate, form]);

  useEffect(() => {
    // 记录填写 name 属性 formItem
    if (typeof name === 'undefined') return;

    // formList 下特殊处理
    if (formListName) {
      formListMapRef.current.set(name, formItemRef);
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        formListMapRef.current.delete(name);
      };
    }

    if (!formMapRef) return;
    formMapRef.current.set(name, formItemRef);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formMapRef.current.delete(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, formListName]);

  useEffect(() => {
    // value 变化通知 watch 事件
    form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.(name);

    // 控制是否需要校验
    if (!shouldValidate.current) return;

    // value change event
    if (typeof name !== 'undefined') {
      if (formListName) {
        // 整理 formItem 的值
        const formListValue = merge([], calcFieldValue(name, formValue));
        // 整理 formList 的值
        const fieldValue = calcFieldValue(formListName, formListValue);
        onFormItemValueChange?.({ ...fieldValue });
      } else {
        const fieldValue = calcFieldValue(name, formValue);
        onFormItemValueChange?.({ ...fieldValue });
      }
    }

    const filterRules = innerRules.filter((item) => (item.trigger || 'change') === 'change');

    filterRules.length && validate('change');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  // 暴露 ref 实例方法
  const instance: FormItemInstance = {
    name,
    value: formValue,
    isUpdated: isUpdatedRef.current,
    getValue: () => valueRef.current,
    setValue: (newVal: any) => updateFormValue(newVal),
    setField,
    validate,
    validateOnly,
    resetField,
    setValidateMessage,
    resetValidate: resetHandler,
  };
  useImperativeHandle(ref, (): FormItemInstance => instance);
  useImperativeHandle(formItemRef, (): FormItemInstance => instance);

  // 传入 form 实例支持自定义渲染
  if (isFunction(children)) return children(form);

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

            let ctrlKey = 'value';
            if (React.isValidElement(child)) {
              if (child.type === FormItem) {
                return React.cloneElement(child, {
                  // @ts-ignore
                  ref: (el) => {
                    if (!el) return;
                    innerFormItemsRef.current[index] = el;
                  },
                });
              }
              if (typeof child.type === 'object') {
                ctrlKey = ctrlKeyMap.get(child.type) || 'value';
              }
              return React.cloneElement(child, {
                disabled: disabledFromContext,
                ...child.props,
                [ctrlKey]: formValue,
                onChange: (value: any, ...args: any[]) => {
                  updateFormValue(value);
                  child.props.onChange?.call?.(null, value, ...args);
                },
                onBlur: (value: any, ...args: any[]) => {
                  handleItemBlur();
                  child.props.onBlur?.call?.(null, value, ...args);
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
