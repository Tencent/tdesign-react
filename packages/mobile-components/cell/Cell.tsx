import React, { useMemo, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import { isString } from 'lodash-es';
import { ChevronRightIcon } from 'tdesign-icons-react';

import parseTNode from '../_util/parseTNode';
import { TdCellProps } from './type';
import { cellDefaultProps } from './defaultProps';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import useDefaultProps from '../hooks/useDefaultProps';
import useHover from '../hooks/useHover';
import useConfig from '../hooks/useConfig';

export interface CellProps extends TdCellProps, NativeProps {
  children?: ReactNode;
}

const Cell: React.FC<CellProps> = (originProps) => {
  const props = useDefaultProps(originProps, cellDefaultProps);
  const {
    align,
    arrow,
    bordered,
    description,
    hover,
    image,
    leftIcon,
    note,
    required,
    rightIcon,
    title,
    onClick,
    children,
  } = props;

  const { classPrefix } = useConfig();

  const name = `${classPrefix}-cell`;

  const classNames = useMemo(
    () => [
      `${name}`,
      {
        [`${name}--borderless`]: !bordered,
      },
    ],
    [bordered, name],
  );

  const hoverDisabled = useMemo(() => !hover, [hover]);
  const ref = useHover({ className: `${name}--hover`, disabled: hoverDisabled });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onClick?.({ e });
    },
    [onClick],
  );

  const renderImage = () => {
    if (isString(image)) {
      return <img src={image} className={`${name}__left-image`} />;
    }
    return parseTNode(image);
  };

  const renderLeft = () => (
    <div className={`${name}__left`}>
      {leftIcon && <div className={`${name}__left-icon`}>{parseTNode(leftIcon)}</div>}
      {renderImage()}
    </div>
  );

  const renderTitle = () => {
    if (!title) {
      return null;
    }
    return (
      <div className={`${name}__title`}>
        <div className={`${name}__title-text`}>
          {parseTNode(title)}
          {required && <span className={`${name}--required`}>&nbsp;*</span>}
        </div>
        {description && <div className={`${name}__description`}>{parseTNode(description)}</div>}
      </div>
    );
  };
  const renderRight = () => {
    const Icon = arrow ? <ChevronRightIcon /> : parseTNode(rightIcon);
    if (!Icon) {
      return null;
    }
    return (
      <div className={classnames(`${name}__right`, `${name}__right--${align}`)}>
        <div className={`${name}__right-icon`}>{Icon}</div>
      </div>
    );
  };

  return withNativeProps(
    props,
    <div ref={ref} className={classnames(classNames)} onClick={handleClick}>
      {renderLeft()}
      {renderTitle()}
      {note ? <div className={`${name}__note`}>{parseTNode(note)}</div> : parseTNode(children)}
      {renderRight()}
    </div>,
  );
};

Cell.displayName = 'Cell';

export default Cell;
