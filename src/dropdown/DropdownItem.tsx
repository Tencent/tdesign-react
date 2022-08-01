import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TdIconChevronRight } from 'tdesign-icons-react';
import { DropdownOption, TdDropdownProps } from './type';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useRipple from '../_util/useRipple';
import { pxCompat } from '../_util/helper';
import TDivider from '../divider';
import { dropdownItemDefaultProps } from './defaultProps';

type DropdownItemProps = Pick<DropdownOption, 'content' | 'value' | 'divider' | 'onClick'> &
  Pick<TdDropdownProps, 'maxColumnWidth' | 'minColumnWidth'> & {
    path?: string;
    hasChildren?: boolean;
    active?: boolean;
    disabled?: boolean;
    onHover?: (path: string) => void;
    children?: React.ReactChild;
  };

const DropdownItem = forwardRef((props: DropdownItemProps, ref: React.RefObject<HTMLDivElement>) => {
  const {
    path = '',
    hasChildren = false,
    maxColumnWidth,
    minColumnWidth,
    active,
    disabled,
    content,
    value,
    divider,
    children,
  } = props;
  const { classPrefix } = useConfig();
  const { ChevronRightIcon } = useGlobalIcon({ ChevronRightIcon: TdIconChevronRight });
  const dropdownItemRef = useRef(null);

  useRipple(ref || dropdownItemRef);

  const dropdownItemClass = `${classPrefix}-dropdown__item`;
  const renderSuffix = () =>
    hasChildren ? <ChevronRightIcon className={`${classPrefix}-dropdown__item-icon`} /> : null;
  const handleItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!hasChildren && !disabled) {
      const data = {
        value,
        path,
        content,
      };
      props?.onClick?.(data, { e });
    }
  };
  const handleMouseover = (): void => {
    props.onHover(path);
  };
  return (
    <div>
      <div
        className={classNames(dropdownItemClass, {
          [`${classPrefix}-dropdown--suffix`]: hasChildren,
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-active`]: active,
        })}
        style={{
          maxWidth: pxCompat(maxColumnWidth),
          minWidth: pxCompat(minColumnWidth),
        }}
        onClick={handleItemClick}
        onMouseOver={handleMouseover}
        ref={ref || dropdownItemRef}
      >
        <div className={`${dropdownItemClass}-content`}>
          <span className={`${dropdownItemClass}-text`}>{children || content}</span>
        </div>
        {renderSuffix()}
      </div>
      {divider ? <TDivider /> : null}
    </div>
  );
});

DropdownItem.displayName = 'DropdownItem';
DropdownItem.defaultProps = dropdownItemDefaultProps;

export default DropdownItem;
