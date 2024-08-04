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

// 将数据整理成对象，数组 name 转化嵌套对象: ['user', 'name'] => { user: { name: '' } }
export function calcFieldValue(name: NamePath, value: any) {
  if (Array.isArray(name)) {
    const fieldValue = name.reduceRight((prev, curr) => {
      const arr = [];
      if (/^\d+$/.test(String(curr))) arr[curr] = prev;
      return arr.length ? arr : { [curr]: prev };
    }, value);
    return { ...fieldValue };
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
    // 支持嵌套数据结构
    if (Array.isArray(mapName)) {
      // 创建唯一临时变量 symbol
      const symbol = Symbol('name');
      let fieldValue = null;

      for (let i = 0; i < mapName.length; i++) {
        const item = mapName[i];
        if (Reflect.has(fieldValue || obj, item)) {
          fieldValue = Reflect.get(fieldValue || obj, item);
        } else {
          // 当反射无法获取到值则重置为 symbol
          fieldValue = symbol;
          break;
        }
      }

      // 非 symbol 说明获取到了值
      if (fieldValue !== symbol) {
        callback(formItemRef, fieldValue);
      }
    } else if (Reflect.has(obj, mapName)) {
      callback(formItemRef, obj[mapName]);
    }
  }
}
