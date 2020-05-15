/**
 * @fileoverview 用于从完整props中筛选出默认支持的全局props特性
 * @author kirkzheng
 */

/**
 * 从props中获取dataSet数据
 * @param props 参数
 */
export const getDataSet = (props: Record<string | number, any> = {}): Record<string | number, any> => {
    const result: Record<string | number, any> = {};
    Object.keys(props).forEach((key) => {
        if (key && key.indexOf('data-') === 0) {
            result[key] = props[key];
        }
    });
    return result;
};

/**
 * 从props中获取全局属性
 * @param props 参数
 */
export const getGlobalAttributes = (props: Record<string | number, any> = {}): Record<string | number, any> => {
    let result: Record<string | number, any> = {};

    result = getDataSet(props);

    return result;
};
