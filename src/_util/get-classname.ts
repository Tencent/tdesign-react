/**
 * @fileoverview 处理className方法
 * @author kirkzheng
 */

import classNames from 'classnames';

interface Config {
    prefixCls: string;
    className?: string;
    size?: string;
    disabled?: boolean;
    classNames?: Function;
}

/**
 * 计算类名公共方法
 * @param config 配置参数
 */
const getClassName = (config: Config = {
    prefixCls: '',
}): string => {
    const {
        prefixCls = '',
        className = '',
        size = '',
        disabled = false,
    } = config;
    const classList: (string | object)[] = [];

    if (className) {
        classList.push(className);
    }

    if (prefixCls) {
        classList.push(prefixCls);

        // 类型类名
        if (size) {
            classList.push(`${prefixCls}-${size}`);
        }

        if (disabled) {
            classList.push(`${prefixCls}-disabled`);
        }

        if (config.classNames) {
            classList.push(config.classNames(prefixCls));
        }
    }

    return classNames(...classList);
};

export default getClassName;
