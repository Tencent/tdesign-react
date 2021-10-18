import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TIconChevronRight } from '@tencent/tdesign-icons-react';
import { DropdownOption, TdDropdownProps } from '../_type/components/dropdown';
import useConfig from '../_util/useConfig';
import useRipple from '../_util/useRipple';
import TDivider from '../divider';

type DropdownItemProps = Pick<DropdownOption, 'content' | 'value' | 'divider' | 'onClick'> &
  Pick<TdDropdownProps, 'maxColumnWidth' | 'minColumnWidth'> & {
    path: string;
    hasChildren: boolean;
    active: boolean;
    disabled: boolean;
    onHover: (path: string) => void;
  };

const DropdownItem = forwardRef((props: DropdownItemProps, ref: React.RefObject<HTMLButtonElement>) => {
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
  } = props;

  const { classPrefix } = useConfig();
  const dropdownItemRef = useRef(null);

  useRipple(ref || dropdownItemRef);

  const dropdownItemClass = `${classPrefix}-dropdown__item`;
  const renderSuffix = () => (hasChildren ? <TIconChevronRight className="children-suffix" /> : null);
  const handleItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!hasChildren && !disabled) {
      const data = {
        value,
        path,
        content,
      };
      props.onClick(data, { e });
    }
  };
  const handleMouseover = (): void => {
    props.onHover(path);
  };
  return (
    <div>
      <div
        className={classNames(dropdownItemClass, {
          'has-suffix': hasChildren,
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-active`]: active,
        })}
        style={{
          maxWidth: `${maxColumnWidth}px`,
          minWidth: `${minColumnWidth}px`,
        }}
        onClick={handleItemClick}
        onMouseOver={handleMouseover}
        ref={ref || dropdownItemRef}
      >
        <div className={`${dropdownItemClass}__content`}>
          <span className={`${dropdownItemClass}__content__text`}>{content}</span>
        </div>
        {renderSuffix()}
      </div>
      {divider ? <TDivider /> : null}
    </div>
  );
});

export default DropdownItem;
