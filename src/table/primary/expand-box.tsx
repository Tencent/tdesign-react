import React, { FC, useContext } from 'react';
import { ConfigContext } from '@tencent/tdesign-react/config-provider';
import TIconChevronCircleDown from '../../icon/icons/ChevronDownCircleIcon';
import { Styles, TNode } from '../../_type/common';

interface Props {
  expanded?: boolean;
  handleExpandChange?: Function;
  rowKeyValue?: any;
  row?: Record<string, any>;
  showExpandArrow?: TNode;
  expandOnRowClick?: boolean;
}

const ExpandButton: FC<Props> = (props) => {
  const { expanded, handleExpandChange, rowKeyValue, row, showExpandArrow, expandOnRowClick } = props;
  const { classPrefix } = useContext(ConfigContext);

  const renderIcon = (icon: TNode) => {
    let result: React.ReactNode = null;
    if (icon && typeof icon !== 'boolean') result = icon;
    if (typeof icon === 'function') result = icon();

    if (result) {
      result = <span className={`${classPrefix}-table-expand-icon`}>{result}</span>;
    } else if (typeof icon === 'boolean' && icon === false) {
      result = <span className={`${classPrefix}-table-expand-icon`}></span>;
    } else {
      result = <TIconChevronCircleDown className={`${classPrefix}-table-expand-icon`} size="16px" />;
    }
    return result;
  };

  function getExpandIcon(expanded: boolean) {
    const style: Styles = {
      transition: 'all .2s',
      display: 'flex',
      alignItems: 'center',
    };
    if (!expanded) {
      style.transform = 'rotate(-180deg)';
    }
    return <span style={style}>{renderIcon(showExpandArrow)}</span>;
  }

  return expandOnRowClick ? (
    <span className={`${classPrefix}-table-expand-box`}>{getExpandIcon(expanded)}</span>
  ) : (
    <span
      className={`${classPrefix}-table-expand-box`}
      onClick={() => {
        handleExpandChange(row, rowKeyValue);
      }}
    >
      {getExpandIcon(expanded)}
    </span>
  );
};
export default ExpandButton;
