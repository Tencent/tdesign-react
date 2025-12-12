import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import { get, isEqual, isFunction, isObject, isString, set } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { READONLY_SUPPORTED_COMP, ValidateStatus } from './const';
import { formItemDefaultProps } from './defaultProps';
import { useFormContext, useFormListContext } from './FormContext';
import { parseMessage, validate as validateModal } from './formModel';
import { HOOK_MARK } from './hooks/useForm';
import useFormItemInitialData, { ctrlKeyMap } from './hooks/useFormItemInitialData';
import useFormItemStyle from './hooks/useFormItemStyle';
import { calcFieldValue, concatName } from './utils';

import type { StyledProps } from '../common';
import type {
  FieldData,
  FormInstanceFunctions,
  FormItemValidateMessage,
  FormRule,
  NamePath,
  TdFormItemProps,
  TdFormProps,
  ValidateTriggerType,
  ValueType,
} from './type';

export interface FormItemProps extends TdFormItemProps, StyledProps {
  children?: React.ReactNode | React.ReactNode[] | ((form: FormInstanceFunctions) => React.ReactElement);
}

export interface FormItemInstance {
  name?: NamePath;
  fullPath?: NamePath[];
  value?: any;
  initialData?: any;
  isFormList?: boolean;
  formListMapRef?: React.MutableRefObject<Map<any, any>>;
  getValue?: () => any;
  setValue?: (newVal: any) => void;
  setField?: (field: Omit<FieldData, 'name'>) => void;
  validate?: (trigger?: ValidateTriggerType, showErrorMessage?: boolean) => Promise<Record<string, any>>;
  validateOnly?: (trigger?: ValidateTriggerType) => Promise<Record<string, any>>;
  resetField?: (type?: TdFormProps['resetType']) => void;
  setValidateMessage?: (message: FormItemValidateMessage[]) => void;
  getValidateMessage?: FormInstanceFunctions['getValidateMessage'];
  resetValidate?: () => void;
}

const FormItem = forwardRef<FormItemInstance, FormItemProps>((originalProps, ref) => {
  const [locale, t] = useLocaleReceiver('form');
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
    requiredMark: requiredMarkFromContext,
    requiredMarkPosition,
    labelAlign: labelAlignFromContext,
    labelWidth: labelWidthFromContext,
    showErrorMessage: showErrorMessageFromContext,
    disabled: disabledFromContext,
    readonly: readonlyFromContext,
    resetType: resetTypeFromContext,
    rules: rulesFromContext,
    statusIcon: statusIconFromContext,
    errorMessage,
    formMapRef,
    onFormItemValueChange,
  } = useFormContext();

  const {
    name: formListName,
    fullPath: parentFullPath,
    rules: formListRules,
    formListMapRef,
    form: formOfFormList,
  } = useFormListContext();

  const props = useDefaultProps<FormItemProps>(originalProps, formItemDefaultProps);

  const {
    children,
    style,
    label,
    name,
    status,
    tips,
    help,
    valueFormat,
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

  const fullPath = concatName(parentFullPath, name);
  const { defaultInitialData } = useFormItemInitialData(name, fullPath, initialData, children);

  const [, forceUpdate] = useState({}); // custom render state
  const [freeShowErrorMessage, setFreeShowErrorMessage] = useState(undefined);
  const [errorList, setErrorList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState('validating');
  const [resetValidating, setResetValidating] = useState(false);
  const [needResetField, setNeedResetField] = useState(false);
  const [formValue, setFormValue] = useState(defaultInitialData);

  const formItemRef = useRef<FormItemInstance>(null); // 当前 formItem 实例
  const innerFormItemsRef = useRef([]);
  const shouldEmitChangeRef = useRef(false); // onChange 冒泡开关
  const shouldValidate = useRef(false); // 校验开关
  const valueRef = useRef(formValue); // 当前最新值
  const errorListMapRef = useRef(new Map());

  const isSameForm = useMemo(() => isEqual(form, formOfFormList), [form, formOfFormList]); // 用于处理 Form 嵌套的情况
  const snakeName = []
    .concat(isSameForm ? formListName : undefined, name)
    .filter((item) => item !== undefined)
    .toString(); // 转化 name

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
      label,
      labelWidth,
      labelAlign,
      requiredMark,
      requiredMarkPosition,
      showErrorMessage,
      innerRules,
    });

  // 更新 form 表单字段
  const updateFormValue = (newVal: any, validate = true, shouldEmitChange = false) => {
    const { setPrevStore } = form?.getInternalHooks?.(HOOK_MARK) || {};
    setPrevStore?.(form?.getFieldsValue?.(true));
    shouldEmitChangeRef.current = shouldEmitChange;
    shouldValidate.current = validate;
    valueRef.current = newVal;
    const fieldValue = get(form?.store, fullPath);
    if (isEqual(fieldValue, newVal)) return;
    set(form?.store, fullPath, newVal);
    setFormValue(newVal);
  };

  // 初始化 rules，最终以 formItem 上优先级最高
  function getInnerRules(name, formRules, formListName, formListRules): FormRule[] {
    if (Array.isArray(name)) {
      return get(formRules?.[formListName], name) || get(formListRules, name) || get(formRules, name.join('.')) || [];
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

  async function analysisValidateResult(trigger: ValidateTriggerType) {
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
            // eslint-disable-next-line
            item.message = parseMessage(errorMessages[key], {
              validate: item[key],
              name: isString(label) ? label : String(name),
            });
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

  async function validate(trigger: ValidateTriggerType = 'all', showErrorMessage?: boolean) {
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

    // all 校验无错误信息时清空所有错误缓存
    if (!innerErrorList.length && trigger === 'all') {
      errorListMapRef.current.clear();
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

  async function validateOnly(trigger: ValidateTriggerType = 'all') {
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

  function getResetValue(resetType: TdFormProps['resetType']): ValueType {
    if (resetType === 'initial') {
      return defaultInitialData;
    }

    let emptyValue: ValueType;
    if (Array.isArray(formValue)) {
      emptyValue = [];
    } else if (isObject(formValue)) {
      emptyValue = {};
    } else if (isString(formValue)) {
      emptyValue = '';
    }

    return emptyValue;
  }

  function resetField(type: TdFormProps['resetType']) {
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

  function setField(field: Omit<FieldData, 'name'>) {
    const { value, status, validateMessage } = field;
    if (typeof status !== 'undefined') {
      setErrorList(validateMessage ? [validateMessage] : []);
      setSuccessList(validateMessage ? [validateMessage] : []);
      setNeedResetField(false);
      setVerifyStatus(status);
    }
    if (typeof value !== 'undefined') {
      // 手动设置 status 则不需要校验 交给用户判断
      updateFormValue(value, typeof status === 'undefined' ? true : false, true);
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

  function getValidateMessage() {
    return errorList;
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

    // FormList 下特殊处理
    if (formListName && isSameForm) {
      formListMapRef.current.set(fullPath, formItemRef);
      set(form?.store, fullPath, defaultInitialData);
      setFormValue(defaultInitialData);
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        formListMapRef.current.delete(fullPath);
        set(form?.store, fullPath, defaultInitialData);
      };
    }

    if (!formMapRef) return;
    formMapRef.current.set(fullPath, formItemRef);
    set(form?.store, fullPath, defaultInitialData);
    setFormValue(defaultInitialData);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formMapRef.current.delete(fullPath);
      set(form?.store, fullPath, defaultInitialData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeName, formListName]);

  useEffect(() => {
    // value 变化通知 watch 事件
    form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.(name);

    // 控制是否需要校验
    if (!shouldValidate.current) return;

    if (typeof name !== 'undefined' && shouldEmitChangeRef.current) {
      const fieldValue = calcFieldValue(fullPath, formValue);
      onFormItemValueChange?.(fieldValue);
    }

    const filterRules = innerRules.filter((item) => (item.trigger || 'change') === 'change');

    filterRules.length && validate('change');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue, snakeName]);

  // 暴露 ref 实例方法
  const instance: FormItemInstance = {
    name,
    fullPath,
    value: formValue,
    initialData,
    isFormList: false,
    getValue: () => valueRef.current,
    setValue: (newVal: any) => updateFormValue(newVal, true, true),
    setField,
    validate,
    validateOnly,
    resetField,
    setValidateMessage,
    getValidateMessage,
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
          {colon && t(locale.colonText)}
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
              const childProps = child.props as any;
              // @ts-ignore
              const readOnlyKey = READONLY_SUPPORTED_COMP.includes(child?.type?.displayName) ? 'readonly' : 'readOnly';
              return React.cloneElement(child, {
                disabled: disabledFromContext,
                [readOnlyKey]: readonlyFromContext,
                ...childProps,
                [ctrlKey]: formValue,
                onChange: (value: any, ...args: any[]) => {
                  const newValue = valueFormat ? valueFormat(value) : value;
                  updateFormValue(newValue, true, true);
                  childProps?.onChange?.call?.(null, value, ...args);
                },
                onBlur: (value: any, ...args: any[]) => {
                  handleItemBlur();
                  childProps?.onBlur?.call?.(null, value, ...args);
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

export default FormItem;
