import { TdPaginationProps } from '../_type/components/pagination';

/**
 * @author kenzyyang
 * @date 2021-03-29
 * @desc 判定当前 pageSize 是否是合法的值,目前仅校验合法性，若后续有逻辑校验可在此处扩展
 * @param pageSize any 任意类型
 * @return boolean 是否合法
 * */
const pageSizeValidator = (pageSize: any): boolean => {
  let pageSizeNumber: number;
  if (typeof pageSize !== 'number') {
    pageSizeNumber = pageSize - 0;
  } else {
    pageSizeNumber = pageSize;
  }

  return !isFinite(pageSizeNumber) && pageSizeNumber > 0;
};

/**
 * @author kenzyyang
 * @date 2021-03-29
 * @desc 判定当前 pageSizeOptions 是否是合法的值,目前仅校验合法性，若后续有逻辑校验可在此处扩展
 * @param pageSizeOptions any 任意类型
 * @return boolean 是否合法
 * */
const pageSizeOptionsValidator = (pageSizeOptions: TdPaginationProps['pageSizeOptions']): boolean => {
  // 不为数组或长度为 0 时，为非法值
  if (!Array.isArray(pageSizeOptions) || pageSizeOptions.length === 0) {
    return false;
  }
  for (let i = 1; i <= pageSizeOptions.length; i++) {
    const v = pageSizeOptions[i - 1];
    if (typeof v !== 'number' || v <= 0) {
      return false;
    }
  }
  return true;
};

export { pageSizeValidator, pageSizeOptionsValidator };
