export const urlCreator = () => window.webkitURL || window.URL;

/**
 * 移除对象最外层所指定的属性
 * @param obj
 * @param key
 * @returns
 */
export const removeProperty = <T>(obj: T, key: string): T => {
  const copyObj = { ...obj };
  if (typeof copyObj[key] !== 'undefined') {
    delete copyObj[key];
  }
  return copyObj;
};

/**
 *
 * @param arr
 * @param key
 * @returns
 */
export const removePropertyAtArray = <T>(arr: T[], key: string): T[] => {
  if (arr.length) {
    return [...arr].map((item) => removeProperty(item, key));
  }
  return arr;
};

/**
 * 获取当前 index，
 * 注意：index 是累加的
 * @returns
 */
export const getIndex = (): (() => number) => {
  let index = 0;
  return () => {
    const tempIndex = index;
    index += 1;
    return tempIndex;
  };
};

/**
 * 获取最新的 uid 工厂函数
 * @returns
 */
export const getNewestUidFactory = (): (() => string) => {
  let index = 0;
  return () => {
    const tempIndex = index;
    index += 1;
    return `td__upload__${Date.now()}_${tempIndex}__`;
  };
};
