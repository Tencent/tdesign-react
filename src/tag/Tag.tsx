import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from 'tdesign-icons-react';
import noop from '../_util/noop';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { TdTagProps } from '../_type/components/tag';
import CheckTag from './CheckTag';

/**
 * Tag 组件支持的属性。
 */
export interface TagProps extends TdTagProps, StyledProps {
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
      size = 'medium',
      shape = 'square',
      variant = 'dark',
      closable,
      maxWidth,
      icon,
      content,
      onClick = noop,
      onClose = noop,
      className,
      style,
      disabled,
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
      `${tagClassPrefix}--${variant}`,
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
    const deleteIcon = <CloseIcon onClick={(e) => onClose({ e })} className={`${tagClassPrefix}__icon-close`} />;

    const tag: JSX.Element = (
      <span ref={ref} className={tagClassNames} onClick={(e) => onClick({ e })} {...otherTagProps}>
        {icon}
        {maxWidth ? (
          <span className={`${tagClassPrefix}--text`} style={{ ...(style || {}), ...{ maxWidth } }}>
            {children || content}
          </span>
        ) : (
          children || content
        )}
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
