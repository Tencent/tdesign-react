/**
 * 计算字符串字符的长度并可以截取字符串。
 * @param str 传入字符串
 * @param maxCharacter 规定最大字符串长度
 * @returns 当没有传入maxCharacter时返回字符串字符长度，当传入maxCharacter时返回截取之后的字符串和长度。
 */
export function getCharacterLength(str: string, maxCharacter?: number) {
  const hasMaxCharacter = typeof maxCharacter === 'number';
  if (!str || str.length === 0) {
    if (hasMaxCharacter) {
      return {
        length: 0,
        characters: str,
      };
    }
    return 0;
  }
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let currentStringLength = 0;
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      currentStringLength = 2;
    } else {
      currentStringLength = 1;
    }
    if (hasMaxCharacter && len + currentStringLength > maxCharacter) {
      return {
        length: len,
        characters: str.slice(0, i),
      };
    }
    len += currentStringLength;
  }
  if (hasMaxCharacter) {
    return {
      length: len,
      characters: str,
    };
  }
  return len;
}

/**
 * 兼容样式中支持 number/string 类型的传值 得出最后的结果。
 * @param param number 或 string 类型的可用于样式上的值
 * @returns 可使用的样式值。
 */
export function pxCompat(param: string | number) {
  return typeof param === 'number' ? `${param}px` : param;
}

/**
 * 修正 Unicode 最大字符长度
 * '👨👨👨'.slice(0, 2) === '👨'
 * limitUnicodeMaxLength('👨👨👨', 2) === '👨👨'
 * @param str
 * @param maxLength
 * @param oldStr
 * @returns {string}
 */
export function limitUnicodeMaxLength(str?: string, maxLength?: number, oldStr?: string): string {
  // 旧字符满足字数要求则返回
  if ([...(oldStr ?? '')].slice().length === maxLength) return oldStr || '';
  return [...(str ?? '')].slice(0, maxLength).join('');
}
