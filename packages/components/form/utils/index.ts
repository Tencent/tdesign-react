import { get, has, isArray, isEmpty, isObject } from 'lodash-es';
import type { FormItemInstance } from '../FormItem';
import type { NamePath } from '../type';

/**
 * 在 `formMap` 中查找指定的 `FormItem`
 * (仅查找当前层级)
 */
export function findFormItem(
  name: NamePath,
  formMapRef: React.MutableRefObject<Map<any, any>>,
): React.RefObject<FormItemInstance> | undefined {
  if (!formMapRef.current) return;
  // 提取所有 map key
  const mapKeys = [...formMapRef.current.keys()];
  // 转译为字符串后比对 key 兼容数组格式
  const key = mapKeys.find((key) => String(key) === String(name));
  // 拿到 key 引用地址获取 value
  return formMapRef.current.get(key);
}

/**
 * 在 `formMap` 中查找指定的 `FormItem`
 * (包括在嵌套的 FormList 中递归查找）
 */
export function findFormItemDeep(
  name: NamePath,
  formMapRef: React.MutableRefObject<Map<any, any>>,
): React.RefObject<FormItemInstance> | undefined {
  if (!formMapRef?.current) return;
  const targetPath = Array.isArray(name) ? name : [name];
  for (const [key, ref] of formMapRef.current.entries()) {
    const formItem = ref?.current;
    if (!formItem?.isFormList || !formItem.formListMapRef) continue;
    const { formListMapRef } = formItem;
    for (const [itemKey, itemRef] of formListMapRef.current.entries()) {
      const fullPath = [key, itemKey].flat();
      if (String(fullPath) === String(targetPath)) return itemRef;
    }
    const found = findFormItemDeep(name, formListMapRef);
    if (found) return found;
  }
}

// { user: { name: '' } } => [['user', 'name']]
// 不处理数组类型
// { user: [{ name: '' }]} => [['user']]
export function objectToArray(obj: Record<string | number, any>) {
  const result: (string | number)[][] = [];

  function traverse(current: any, path: string[] = []) {
    if (isObject(current) && !isArray(current) && !isEmpty(current)) {
      Object.keys(current).forEach((key) => {
        traverse(current[key], [...path, key]);
      });
    } else {
      result.push(path);
    }
  }

  traverse(obj);
  return result;
}

// 将数据整理成对象，数组 name 转化嵌套对象: ['user', 'name'] => { user: { name: '' } }
export function calcFieldValue(name: NamePath, value: any, isFormList = true) {
  if (Array.isArray(name)) {
    if (isFormList) {
      const fieldValue = name.reduceRight((prev, curr) => {
        const arr = [];
        if (/^\d+$/.test(String(curr))) arr[curr] = prev;
        return arr.length ? arr : { [curr]: prev };
      }, value);
      return { ...fieldValue };
    }
    return name.reduceRight((prev, curr, currentIndex) => {
      if (currentIndex === name.length - 1) {
        return { [curr]: value };
      }
      return { [curr]: prev };
    }, {});
  }

  return { [name]: value };
}

// 通过对象数据类型获取 map 引用: { user: { name: '' } } => formMap.get(['user', 'name'])
export function travelMapFromObject(
  obj: Record<any, any>,
  formMapRef: React.MutableRefObject<Map<any, any>>,
  callback: Function,
) {
  for (const [mapName, formItemRef] of formMapRef.current.entries()) {
    if (has(obj, mapName)) {
      callback(formItemRef, get(obj, mapName));
    }
  }
}
