import { has, get, isObject, isArray, isEmpty } from 'lodash-es';
import type { NamePath } from '../type';

// 获取 formMap 管理的数据
export function getMapValue(name: NamePath, formMapRef: React.MutableRefObject<Map<any, any>>) {
  if (!formMapRef.current) return;

  // 提取所有 map key
  const mapKeys = [...formMapRef.current.keys()];
  // 转译为字符串后比对 key 兼容数组格式
  const key = mapKeys.find((key) => String(key) === String(name));
  // 拿到 key 引用地址获取 value
  return formMapRef.current.get(key);
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

/**
 * 将表单名成路径中的数字转化为字符串
 *
 * 将 name 是 number 类型，转化为字符串
 * 当 name 是数组格式时，需要将数组中的 number 元素转化为字符串
 * 覆盖：路径中，数字 1 和字符串 '1' 会被视为同一路径，后者会覆盖前者的值。
 *
 * @param {NamePath} name
 * @returns
 */
export function convertNamePathToString(name: NamePath) {
  if (typeof name === 'number') return `${name}`;
  if (Array.isArray(name)) {
    return name.map((item) => (typeof item === 'number' ? `${item}` : item));
  }
  return name;
}
