import React, { useEffect } from 'react';
import { cloneDeep, get, isEmpty, unset } from 'lodash-es';

// 兼容特殊数据结构和受控 key
import Tree from '../../tree/Tree';
import Upload from '../../upload/upload';
import CheckTag from '../../tag/CheckTag';
import Checkbox from '../../checkbox/Checkbox';
import TagInput from '../../tag-input/TagInput';
import RangeInput from '../../range-input/RangeInput';
import Transfer from '../../transfer/Transfer';
import CheckboxGroup from '../../checkbox/CheckboxGroup';
import DateRangePicker from '../../date-picker/DateRangePicker';
import TimeRangePicker from '../../time-picker/TimeRangePicker';

import { useFormContext, useFormListContext } from '../FormContext';

import type { FormItemProps } from '../FormItem';
import type { NamePath } from '../type';

// FormItem 子组件受控 key
export const ctrlKeyMap = new Map();
ctrlKeyMap.set(Checkbox, 'checked');
ctrlKeyMap.set(CheckTag, 'checked');
ctrlKeyMap.set(Upload, 'files');

// FormItem 默认数据类型
export const initialDataMap = new Map();
[Tree, Upload, Transfer, TagInput, RangeInput, CheckboxGroup, DateRangePicker, TimeRangePicker].forEach((component) => {
  initialDataMap.set(component, []);
});
[Checkbox].forEach((component) => {
  initialDataMap.set(component, false);
});

export default function useFormItemInitialData(
  name: NamePath,
  fullPath: NamePath,
  initialData: FormItemProps['initialData'],
  children: FormItemProps['children'],
) {
  let hadReadFloatingFormData = false;

  const { form, floatingFormDataRef, initialData: formContextInitialData } = useFormContext();
  const { name: formListName, initialData: formListInitialData } = useFormListContext();

  // 组件渲染后删除对应游离值
  useEffect(() => {
    if (hadReadFloatingFormData) {
      const nameList = formListName ? [formListName, name].flat() : name;
      unset(floatingFormDataRef.current, nameList);
    }
  }, [hadReadFloatingFormData, floatingFormDataRef, formListName, name]);

  const defaultInitialData = cloneDeep(getDefaultInitialData(children, initialData));

  // 优先级：floatFormData > FormItem.initialData > FormList.initialData > Form.initialData
  function getDefaultInitialData(children: FormItemProps['children'], initialData: FormItemProps['initialData']) {
    if (name && floatingFormDataRef?.current && !isEmpty(floatingFormDataRef.current)) {
      const nameList = formListName ? [formListName, name].flat() : name;
      const defaultInitialData = get(floatingFormDataRef.current, nameList);
      if (typeof defaultInitialData !== 'undefined') {
        // 首次渲染
        hadReadFloatingFormData = true;
        return defaultInitialData;
      }
    }

    if (typeof initialData !== 'undefined') {
      return initialData;
    }

    if (formListName && Array.isArray(fullPath)) {
      const storeValue = get(form.store, fullPath);
      if (typeof storeValue !== 'undefined') {
        return storeValue;
      }
    }

    if (Array.isArray(name) && formListInitialData?.length) {
      let defaultInitialData;
      const [index, ...relativePath] = name;
      if (formListInitialData[index]) {
        defaultInitialData = get(formListInitialData[index], relativePath);
      }
      if (typeof defaultInitialData !== 'undefined') return defaultInitialData;
    }

    if (name && formContextInitialData) {
      const defaultInitialData = get(formContextInitialData, name);
      if (typeof defaultInitialData !== 'undefined') return defaultInitialData;
    }

    if (typeof children !== 'function') {
      const childList = React.Children.toArray(children);
      const lastChild = childList[childList.length - 1];
      if (lastChild && React.isValidElement(lastChild)) {
        // @ts-ignore
        const isMultiple = lastChild?.props?.multiple;
        return isMultiple ? [] : initialDataMap.get(lastChild.type);
      }
    }
  }

  return {
    defaultInitialData,
  };
}
