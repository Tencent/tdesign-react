import React from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import CheckTag from './CheckTag';

/**
 * Tag 组件支持的属性。
 */
export interface TagProps extends StyledProps {
  /**
   * 标签类型
   *
   *  @default 'middle'
   */
  theme?: string;

  /**
   * 按钮大小
   *
   * @default 'middle'
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
   */
  maxWidth?: React.CSSProperties['maxWidth'];

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

  /**
   * 标签内容
   */
  children?: React.ReactNode;
}

/**
 * 标签组件
 */
const Tag = forwardRefWithStatics(
  (props: TagProps, ref: React.Ref<HTMLSpanElement>) => {
    const {
      theme = 'default',
      size = 'middle',
      effect = 'dark',
      shape = 'square',
      closable,
      disabled,
      maxWidth,
      onClick = noop,
      onClose = noop,
      className,
      style,
      children,
      ...otherTagProps
    } = props;

    const { classPrefix } = useConfig();
    const tagClassPrefix = `${classPrefix}-tag`;

    const sizeMap = {
      large: `${classPrefix}-size-l`,
      small: `${classPrefix}-size-s`,
    };

    const tagClassNames = classNames(
      tagClassPrefix,
      `${tagClassPrefix}--${theme}`,
      `${tagClassPrefix}--${effect}`,
      `${tagClassPrefix}--${size}`,
      `${tagClassPrefix}--${shape}`,
      {
        [`${tagClassPrefix}--ellipsis`]: !!maxWidth,
        [`${tagClassPrefix}--disabled`]: disabled,
      },
      sizeMap[size],
      className,
    );

    /**
     * 删除 Icon
     */
    const deleteIcon = <i className="t-icon t-icon-close" onClick={onClose}></i>;

    const tag: JSX.Element = (
      <span
        ref={ref}
        className={tagClassNames}
        onClick={onClick}
        style={{ ...(style || {}), ...{ maxWidth } }}
        {...otherTagProps}
      >
        {children}
        {closable && deleteIcon}
      </span>
    );

    return tag;
  },
  {
    CheckTag,
  },
);

Tag.displayName = 'Tag';

export default Tag;
