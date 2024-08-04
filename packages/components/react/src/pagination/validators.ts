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

  return !Number.isFinite(pageSizeNumber) && pageSizeNumber > 0;
};

export { pageSizeValidator };
