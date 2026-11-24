import { useMemo } from 'react';
import { isNumber, isObject } from 'lodash-es';
import { getCharacterLength, getUnicodeLength, limitUnicodeMaxLength } from '../_common/js/utils/helper';
import log from '../_common/js/log';

export interface UseLengthLimitParams {
  value?: string | number;
  maxlength?: string | number;
  maxcharacter?: number;
  allowInputOverMax?: boolean;
}

export interface UseLengthLimitReturn {
  /**
   * 根据限制条件处理输入值
   * @param inputValue 输入的值
   * @returns 处理后的值
   */
  getValueByLimitNumber: (inputValue: string) => string;
  /**
   * 当前字符长度显示，格式：currentLength/maxLength
   */
  limitNumber: string;
  /**
   * 当前字符长度
   */
  length: number;
}

/**
 * 处理输入框长度限制的通用 Hook
 *
 * @param params 长度限制参数
 * @returns 包含长度限制处理方法和当前长度信息
 *
 */
export default function useLengthLimit(params: UseLengthLimitParams): UseLengthLimitReturn {
  const { value, maxlength, maxcharacter, allowInputOverMax } = params;

  /**
   * 根据限制条件处理输入值
   */
  const getValueByLimitNumber = (inputValue: string): string => {
    if (!(maxlength || maxcharacter) || allowInputOverMax || !inputValue) {
      return inputValue;
    }

    if (maxlength) {
      // input value could be unicode 😊
      return limitUnicodeMaxLength(inputValue, Number(maxlength));
    }

    if (maxcharacter) {
      const result = getCharacterLength(inputValue, maxcharacter);
      if (isObject(result)) {
        return result.characters;
      }
    }

    return inputValue;
  };

  /**
   * 计算当前字符长度
   */
  const length = useMemo(() => {
    const strValue = value == null ? '' : String(value);

    if (maxlength) {
      const maxLengthNum = Number(maxlength);
      if (!isNaN(maxLengthNum) && maxLengthNum > 0) {
        return strValue?.length ? getUnicodeLength(strValue) : 0;
      }
    }

    if (maxcharacter && maxcharacter > 0) {
      const result = getCharacterLength(strValue, maxcharacter);
      return typeof result === 'object' ? result.length : Number(result) || 0;
    }

    return strValue.length;
  }, [value, maxlength, maxcharacter]);

  /**
   * 格式化的长度显示字符串
   */
  const limitNumber = useMemo(() => {
    const strValue = value == null ? '' : String(value);

    if (isNumber(value)) {
      return String(value);
    }

    if (maxlength && maxcharacter) {
      log.warn('TDesign', 'Pick one of maxlength and maxcharacter please.');
    }

    if (maxlength) {
      const maxLengthNum = Number(maxlength);
      if (!isNaN(maxLengthNum) && maxLengthNum > 0) {
        const currentLength = strValue?.length ? getUnicodeLength(strValue) : 0;
        return `${currentLength}/${maxlength}`;
      }
    }

    if (maxcharacter && maxcharacter > 0) {
      return `${getCharacterLength(strValue || '')}/${maxcharacter}`;
    }

    return '';
  }, [value, maxlength, maxcharacter]);

  return {
    getValueByLimitNumber,
    limitNumber,
    length,
  };
}
