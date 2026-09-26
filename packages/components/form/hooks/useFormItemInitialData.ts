import React, { useEffect } from 'react';
import { get, has, isEmpty, isEqual, isNil, unset } from 'lodash-es';

import { TD_DEFAULT_VALUE_MAP } from '../const';
import { useFormContext, useFormListContext } from '../FormContext';
import { convertNameToArray } from '../utils';

import type { FormItemProps } from '../FormItem';
import type { NamePath } from '../type';

export default function useFormItemInitialData(
  name: NamePath,
  fullPath: NamePath,
  initialData: FormItemProps['initialData'],
  children: FormItemProps['children'],
) {
  let hadReadFloatingFormData = false;

  const { form, floatingFormDataRef, initialData: formContextInitialData, mountedFieldsRef } = useFormContext();
  const { name: rawFormListName, initialData: formListInitialData, form: formOfFormList } = useFormListContext();

  const isSameForm = isEqual(form, formOfFormList);
  const formListName = isSameForm ? rawFormListName : undefined;

  const hasName = !isNil(name);
  const isFormList = !isNil(formListName) && Array.isArray(fullPath);
  const fullPathKey = String(fullPath);

  // 组件渲染后删除对应游离值
  useEffect(() => {
    if (hadReadFloatingFormData) {
      unset(floatingFormDataRef.current, fullPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hadReadFloatingFormData, floatingFormDataRef, fullPathKey]);

  const defaultInitialData = getDefaultInitialData(children, initialData);

  // 优先级：floatFormData > store > FormItem.initialData > FormList.initialData > Form.initialData
  function getDefaultInitialData(children: FormItemProps['children'], initialData: FormItemProps['initialData']) {
    if (hasName && floatingFormDataRef?.current && !isEmpty(floatingFormDataRef.current)) {
      const defaultInitialData = get(floatingFormDataRef.current, fullPath);
      if (typeof defaultInitialData !== 'undefined') {
        // 首次渲染
        hadReadFloatingFormData = true;
        return defaultInitialData;
      }
    }

    if (typeof initialData !== 'undefined') {
      if (isFormList) {
        const storeValue = get(form.store, fullPath);
        if (typeof storeValue !== 'undefined') {
          return storeValue;
        }
      }
      return initialData;
    }

    if (isFormList) {
      const pathPrefix = fullPath.slice(0, -1);
      const pathExisted = has(form.store, pathPrefix);
      if (pathExisted) {
        // 只要路径存在，哪怕值为 undefined 也取 store 里的值
        // 兼容 add() 或者 add({}) 导致的空对象场景
        // https://github.com/Tencent/tdesign-react/issues/2329
        return get(form.store, fullPath);
      }
    }

    const fieldKey = JSON.stringify(fullPath);
    const isFirstMount = !(mountedFieldsRef?.current?.has(fieldKey) ?? false);
    if (!isFormList && isFirstMount && hasName && form?.store && has(form.store, fullPath)) {
      const storeValue = get(form.store, fullPath);
      if (typeof storeValue !== 'undefined') {
        return storeValue;
      }
    }

    // FormList.initialData 是当前列表的数据，name 是相对当前列表的路径
    // 既可能是 [index, ...relativePath]，也可能是纯索引
    if (isFormList && hasName && formListInitialData?.length) {
      const defaultInitialData = get(formListInitialData, convertNameToArray(name));
      if (typeof defaultInitialData !== 'undefined') return defaultInitialData;
    }

    if (hasName && formContextInitialData) {
      const defaultInitialData = get(formContextInitialData, isFormList ? fullPath : name);
      if (typeof defaultInitialData !== 'undefined') return defaultInitialData;
    }

    if (typeof children !== 'function') {
      const childList = React.Children.toArray(children);
      const lastChild = childList[childList.length - 1];
      if (lastChild && React.isValidElement(lastChild)) {
        const childProps = lastChild.props as { multiple?: boolean };
        const isMultiple = childProps.multiple;
        // @ts-ignore
        const componentName = lastChild.type.displayName;
        return isMultiple ? [] : TD_DEFAULT_VALUE_MAP.get(componentName);
      }
    }
  }

  return {
    defaultInitialData,
  };
}
