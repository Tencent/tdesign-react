import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
// import { CSSTransition } from 'react-transition-group';
import { useCollapseContext } from './CollapseContext';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../_util/useConfig';
import { TdCollapsePanelProps, CollapseValue } from './type';
import { StyledProps } from '../common';
// import getTransitionParams from './getTransitionParams';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {
  children?: React.ReactNode;
  index?: number;
}

const CollapsePanel = (props: CollapsePanelProps) => {
  const {
    value,
    disabled,
    destroyOnCollapse = false,
    expandIcon,
    className,
    style = {},
    header,
    headerRightContent,
    children,
  } = props;
  const {
    disabled: disableAll,
    defaultExpandAll,
    expandIconPlacement,
    expandOnRowClick,
    expandIcon: expandIconAll,
    getUniqId,
    updateCollapseValue,
    collapseValue,
  } = useCollapseContext();

  const { classPrefix } = useConfig();
  const componentName = `${classPrefix}-collapse-panel`;
  const collapseValueRef = useRef<CollapseValue>(collapseValue);
  const innerValue = value || getUniqId();
  const showExpandIcon = expandIcon === undefined ? expandIconAll : expandIcon;
  const headRef = useRef();
  const isDisabled = disabled || disableAll;

  if (defaultExpandAll) {
    updateCollapseValue(innerValue);
  }

  useEffect(() => {
    // collapseValueRef.current = [...collapseValueRef.current, ...collapseValue];
  }, [collapseValue]);
  console.log('==collapseValueRef', destroyOnCollapse, collapseValue, collapseValueRef.current);

  const isActive = Array.isArray(collapseValue) ? collapseValue.includes(innerValue) : collapseValue === innerValue;

  const classes = classnames(
    componentName,
    {
      [`${classPrefix}-is-disabled`]: isDisabled,
    },
    className,
  );

  const renderIcon = (direction: string) => (
    <FakeArrow isActive={isActive} overlayClassName={`${componentName}__icon ${componentName}__icon--${direction}`} />
  );

  const handleClick = (e) => {
    const canExpand =
      (expandOnRowClick && e.target === headRef.current) || (e.target as Element).getAttribute('name') === 'arrow';

    if (canExpand && !isDisabled) {
      updateCollapseValue(innerValue);
    }
  };

  const renderHeader = () => {
    const cls = [
      `${componentName}__header`,
      {
        [`${classPrefix}-is-clickable`]: expandOnRowClick && !isDisabled,
      },
    ];
    return (
      <div ref={headRef} className={classnames(cls)} onClick={handleClick}>
        {showExpandIcon && expandIconPlacement === 'left' ? renderIcon(expandIconPlacement) : null}
        {header && header}
        <div className={`${componentName}__header--blank`}></div>
        {headerRightContent && headerRightContent}
        {showExpandIcon && expandIconPlacement === 'right' ? renderIcon(expandIconPlacement) : null}
      </div>
    );
  };

  const renderBodyByNormal = () => (
    <div style={{ display: `${isActive ? 'block' : 'none'}` }} className={`${componentName}__body`}>
      <div className={`${componentName}__content`}>{children}</div>
    </div>
  );

  const renderBodyDestroyOnCollapse = () =>
    isActive ? (
      <div className={`${componentName}__body`}>
        <div className={`${componentName}__content`}>{children}</div>
      </div>
    ) : null;

  return (
    <div className={classes} style={{ ...style }}>
      <div className={`${componentName}__wrapper`}>
        {renderHeader()}
        {/* <CSSTransition
            timeout={500}
            classNames="fade"
            key={1}
          >
            {renderBody()}
          </CSSTransition> */}
        {destroyOnCollapse ? renderBodyDestroyOnCollapse() : renderBodyByNormal()}
      </div>
    </div>
  );
};

CollapsePanel.displayName = 'CollapsePanel';

export default CollapsePanel;
