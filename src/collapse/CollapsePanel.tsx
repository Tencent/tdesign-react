import React, { useRef } from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { useCollapseContext } from './CollapseContext';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../_util/useConfig';
import { TdCollapsePanelProps } from './type';
import { StyledProps } from '../common';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {
  children?: React.ReactNode;
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
  const innerValue = value || getUniqId();
  const showExpandIcon = expandIcon === undefined ? expandIconAll : expandIcon;
  const headRef = useRef();
  const contentRef = useRef<HTMLDivElement>();
  const bodyRef = useRef<HTMLDivElement>();
  const isDisabled = disabled || disableAll;

  if (defaultExpandAll) {
    updateCollapseValue(innerValue);
  }

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
      (expandOnRowClick && e.target === headRef.current) || ['svg', 'path'].includes((e.target as Element).tagName);

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

  return (
    <div className={classes} style={{ ...style }}>
      <div className={`${componentName}__wrapper`}>
        {renderHeader()}
        <CSSTransition
          in={isActive}
          appear
          timeout={300}
          nodeRef={bodyRef}
          onEnter={() => {
            bodyRef.current.style.height = `${contentRef?.current.clientHeight}px`;
          }}
          onExit={() => {
            bodyRef.current.style.height = `0px`;
          }}
          unmountOnExit={destroyOnCollapse}
        >
          <div
            style={{ height: 0 }}
            className={classnames(`${componentName}__body`, `${classPrefix}-slide-down-enter-active`)}
            ref={bodyRef}
          >
            <div className={`${componentName}__content`} ref={contentRef}>
              {children}
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

CollapsePanel.displayName = 'CollapsePanel';

export default CollapsePanel;
