import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useLayoutEffect from '../hooks/useLayoutEffect';
import { formDefaultProps } from './defaultProps';
import FormContext from './FormContext';
import FormItem from './FormItem';
import FormList from './FormList';
import useForm, { HOOK_MARK } from './hooks/useForm';
import useInstance from './hooks/useInstance';
import useWatch from './hooks/useWatch';

import type { StyledProps } from '../common';
import type { TdFormProps } from './type';

export interface FormProps extends TdFormProps, StyledProps {
  children?: React.ReactNode;
}

const Form = forwardRefWithStatics(
  (originalProps: FormProps, ref) => {
    const { classPrefix, form: globalFormConfig } = useConfig();
    const props = useDefaultProps<FormProps>(originalProps, formDefaultProps);
    const {
      style,
      className,
      labelWidth,
      statusIcon,
      labelAlign,
      layout,
      colon,
      initialData,
      requiredMark = globalFormConfig.requiredMark,
      requiredMarkPosition = globalFormConfig.requiredMarkPosition,
      scrollToFirstError,
      showErrorMessage,
      resetType,
      rules,
      errorMessage = globalFormConfig.errorMessage,
      disabled,
      children,
      id,
      onReset,
      onValuesChange = noop,
    } = props;

    const formClass = classNames(`${classPrefix}-form`, className, {
      [`${classPrefix}-form-inline`]: layout === 'inline',
    });

    const [form] = useForm(props.form); // 内部与外部共享 form 实例，外部不传则内部创建
    const formRef = useRef<HTMLFormElement>(null);
    const formMapRef = useRef(new Map()); // 收集所有包含 name 属性 formItem 实例
    const formItemElementsRef = useRef(new Set<HTMLElement>()); // 仅收集含 name 的真实表单项
    const lastFormItemsRef = useRef(new Set<HTMLElement>());
    const floatingFormDataRef = useRef({}); // 储存游离值的 formData
    const mountedFieldsRef = useRef<Set<string>>(new Set()); // Form 生命周期内所有曾经被 FormItem 挂载过的字段（fullPath 序列化后的字符串）

    const formInstance = useInstance(props, formRef, formMapRef, floatingFormDataRef, form);

    const refreshLastFormItem = useCallback(() => {
      const formElement = formRef.current;
      const lastClassName = `${classPrefix}-form__item--last`;
      const formItemSelector = `.${classPrefix}-form__item`;

      // 按父容器分组，标记每一组中最后一个真实表单项（排除提交/重置按钮等无 name 的 FormItem）
      const nextLastItems = new Set<HTMLElement>();
      if (layout !== 'inline' && formElement) {
        const formItems = [...formItemElementsRef.current].filter((item) => {
          if (!formElement.contains(item)) return false;
          const parentFormItem = item.parentElement?.closest<HTMLElement>(formItemSelector);
          return !parentFormItem || !formElement.contains(parentFormItem);
        });

        const groupedByParent = new Map<HTMLElement, HTMLElement[]>();
        formItems.forEach((item) => {
          const parent = item.parentElement;
          if (!parent) return;
          const siblings = groupedByParent.get(parent);
          if (siblings) siblings.push(item);
          else groupedByParent.set(parent, [item]);
        });

        groupedByParent.forEach((siblings) => {
          siblings.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
          const lastFormItem = siblings[siblings.length - 1];
          if (lastFormItem) nextLastItems.add(lastFormItem);
        });
      }

      lastFormItemsRef.current.forEach((item) => {
        if (!nextLastItems.has(item)) item.classList.remove(lastClassName);
      });
      nextLastItems.forEach((item) => {
        if (!lastFormItemsRef.current.has(item)) item.classList.add(lastClassName);
      });
      lastFormItemsRef.current = nextLastItems;
    }, [classPrefix, layout]);

    const registerFormItem = useCallback(
      (node: HTMLElement) => {
        formItemElementsRef.current.add(node);
        refreshLastFormItem();

        return () => {
          formItemElementsRef.current.delete(node);
          node.classList.remove(`${classPrefix}-form__item--last`);
          lastFormItemsRef.current.delete(node);
          refreshLastFormItem();
        };
      },
      [classPrefix, refreshLastFormItem],
    );

    useLayoutEffect(() => {
      const formElement = formRef.current;
      if (!formElement) return;

      refreshLastFormItem();

      const observer = new MutationObserver(refreshLastFormItem);
      observer.observe(formElement, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        lastFormItemsRef.current.forEach((item) => item.classList.remove(`${classPrefix}-form__item--last`));
        lastFormItemsRef.current.clear();
      };
    }, [classPrefix, refreshLastFormItem]);

    useImperativeHandle(ref, () => formInstance);
    Object.assign(form, { ...formInstance });
    form?.getInternalHooks?.(HOOK_MARK)?.setForm?.(formInstance);

    // form 初始化后清空队列
    useEffect(() => {
      form?.getInternalHooks?.(HOOK_MARK)?.flashQueue?.();
    }, [form]);

    // Dialog / Popup 等通过 Portal 渲染时，DOM 已脱离外层 Form，但 React 合成事件仍沿 Fiber 树冒泡
    // 会导致内层 Form 的 reset / submit 误触发外层 Form 的处理逻辑
    // 这里过滤掉来自嵌套 Form 的伪冒泡事件
    function isEventFromSelf(e: React.FormEvent<HTMLFormElement>) {
      return e?.target === formRef.current;
    }

    function onResetHandler(e: React.FormEvent<HTMLFormElement>) {
      if (!isEventFromSelf(e)) return;
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current.resetField();
      });
      form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.([]);
      form.store = {};
      floatingFormDataRef.current = {};
      mountedFieldsRef.current.clear();
      onReset?.({ e });
    }

    function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
      if (!isEventFromSelf(e)) return;
      formInstance.submit(e);
    }

    function onFormItemValueChange(changedValue: Record<string, unknown>) {
      const allFields = formInstance.getFieldsValue(true);
      onValuesChange(changedValue, allFields);
    }

    return (
      <FormContext.Provider
        value={{
          form,
          labelWidth,
          statusIcon,
          labelAlign,
          layout,
          colon,
          initialData,
          requiredMark,
          requiredMarkPosition,
          errorMessage,
          showErrorMessage,
          scrollToFirstError,
          resetType,
          rules,
          disabled,
          readOnly: props.readOnly || props.readonly,
          formMapRef,
          floatingFormDataRef,
          registerFormItem,
          mountedFieldsRef,
          onFormItemValueChange,
        }}
      >
        <form
          ref={formRef}
          id={id}
          style={style}
          className={formClass}
          onSubmit={onSubmitHandler}
          onReset={onResetHandler}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
  { useForm, useWatch, FormItem, FormList },
);

Form.displayName = 'Form';

export default Form;
