import { get, has } from 'lodash-es';
import type { FormItemInstance } from '../FormItem';
import type { NamePath } from '../type';

export function swap<T>(arr: T[], i: number, j: number) {
  // eslint-disable-next-line no-param-reassign
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function convertNameToArray(name: NamePath) {
  if (name === undefined || name === null) return [];
  return Array.isArray(name) ? name : [name];
}

export function concatName(...name: NamePath[]) {
  return name.flatMap((p) => convertNameToArray(p));
}

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
  const ref = formMapRef.current.get(key);
  return ref ?? findFormItemDeep(name, formMapRef);
}

/**
 * 在 `formMap` 中查找指定的 `FormItem`
 * (包括在嵌套的 FormList 中递归查找）
 */
function findFormItemDeep(
  name: NamePath,
  formMapRef: React.MutableRefObject<Map<any, any>>,
): React.RefObject<FormItemInstance> | undefined {
  if (!formMapRef?.current) return;
  const targetPath = convertNameToArray(name);

  // 直接查找
  for (const [key, ref] of formMapRef.current.entries()) {
    const keyPath = convertNameToArray(key);
    if (String(keyPath) === String(targetPath)) {
      return ref;
    }
  }

  // 递归查找嵌套的 FormList
  for (const [, ref] of formMapRef.current.entries()) {
    const formItem = ref?.current;
    if (!formItem?.isFormList || !formItem.formListMapRef) continue;
    const found = findFormItemDeep(name, formItem.formListMapRef);
    if (found) return found;
  }
}

export function calcFieldValue(name: NamePath, value: any, numericKeyAsIndex = true) {
  if (!Array.isArray(name)) return { [name]: value };
  let result: any = value;
  for (let i = name.length - 1; i >= 0; i--) {
    const key = name[i];
    const isNumberKey = typeof key === 'number' && numericKeyAsIndex;
    if (isNumberKey) {
      const arr: any[] = [];
      arr[key] = result; // 稀疏数组
      result = arr;
    } else {
      result = { [key]: result };
    }
  }
  return result;
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
