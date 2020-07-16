import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { StyledProps, Combine, Omit } from '../_type';
import { CheckTag, CheckTagProps } from './CheckTag';
import useConfig from '../_util/useConfig';

/**
 * Tag 组件支持的属性。
 */
export interface TagProps
  extends Combine<StyledProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>> {
  /**
   * 标签类型
  /*
   * theme?: 'default'|'primary'|'info'|'warning'|'danger'|'success'
   *
   *  @default "middle"
   */
  theme?: string;
  /**
   * 按钮大小
   *
   * @default "middle"
   */
  size?: 'large' | 'middle' | 'small';
  /**
   * 设置按钮为禁用状态
   *
   * @default false
   * */
  disabled?: boolean;
  /**
   * 设置按钮为禁用状态
   *
   *@default false
   * */
  closable?: boolean;
  /**
   * 最大长度
   *
   */
  maxWidth?: string | number;
  /**
   * 形状
   *
   * @default 'square'
   */
  shape?: 'square' | 'round' | 'mark';
  /**
   * 样式模式
   *
   * @default 'dark'
   */
  effect?: 'dark' | 'light' | 'plain';
  /**
   * 点击回调函数
   */
  onClick?: (e?: React.MouseEvent) => void;

  /**
   * 关闭回调函数
   */
  onClose?: (e?: React.MouseEvent) => void;
}

/*
 * 因为checkTag不属于props，需要单独写一个声明
 * 参照 https://segmentfault.com/q/1010000019012848/
 */

interface ExtraTagRef extends React.ForwardRefExoticComponent<TagProps> {
  CheckTag: React.FunctionComponent<CheckTagProps>;
}

/**
 * 标签组件
 *
 * @see https://tdesign.tencent.com/react/tag
 */
export const Tag = forwardRef((props: TagProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    theme = 'default',
    size = 'middle',
    effect = 'dark',
    closable,
    maxWidth,
    shape = 'square',
    disabled,
    className,
    style,
    onClick,
    onClose,
    children,
    ...otherTagProps
  } = props;

  const { classPrefix } = useConfig();
  const tagClassPrefix = `${classPrefix}-tag`;

  /**
   * 根据用户配置,获取标签class列表
   */
  const classList = {
    [`${tagClassPrefix}--ellipsis`]: !!maxWidth,
    [`${tagClassPrefix}--disabled`]: disabled,
  };
  /**
   * size比较特殊，用的是简写
   */
  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
  };

  /*
   * 解析所有参数，获取对应的className
   */
  const tagClassNames = classNames(
    tagClassPrefix,
    `${tagClassPrefix}--${theme}`,
    `${tagClassPrefix}--${effect}`,
    `${tagClassPrefix}--${size}`,
    `${tagClassPrefix}--${shape}`,
    classList,
    sizeMap[size] || '',
  );

  /**
   * 校验maxwidth
   *
   * @param {string} classType class类型
   * @param {string}  classVal 用户传过来的class值
   * @return {string} 返回class名称
   */
  const getMaxWidth = (maxWidth: string | number): string | number => {
    // 没有%并且没有px的时候，手动添加%
    const isNeedPx = `${maxWidth}`.indexOf('px') === -1 && `${maxWidth}`.indexOf('%') === -1;

    return isNeedPx ? `${maxWidth}px` : maxWidth;
  };

  /**
   * 处理用户提供的最大长度，转化为标准的css
   */
  const formatMaxWidth = getMaxWidth(maxWidth);
  const tagStyle = { ...style, ...{ maxWidth: formatMaxWidth } };

  /**
   * 删除icon变量
   */
  const deleteIcon = <i className="t-icon t-icon-close" onClick={onClose || null}></i>;

  /**
   * 合并用户自己传过来长度className
   */
  const mergedClassName = `${tagClassNames} ${className || ''}`;

  const tag: JSX.Element = (
    <span
      ref={ref}
      className={mergedClassName}
      onClick={onClick || null}
      style={tagStyle}
      {...otherTagProps}
    >
      {children}
      {closable && deleteIcon}
    </span>
  );

  return tag;
}) as ExtraTagRef;

/*
 * 给Tag新增一个CheckTag组件
 */
Tag.CheckTag = CheckTag;

Tag.displayName = 'Tag';
