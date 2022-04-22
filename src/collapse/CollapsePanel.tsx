import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
// import { CSSTransition } from 'react-transition-group';
import { useCollapseContext } from './CollapseContext';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../_util/useConfig';
import { TdCollapsePanelProps } from './type';
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
  const innerValue = value || getUniqId();
  const showExpandIcon = expandIcon === undefined ? expandIconAll : expandIcon;
  const headRef = useRef();
  const contentRef = useRef<HTMLDivElement>();
  const isDisabled = disabled || disableAll;

  if (defaultExpandAll) {
    updateCollapseValue(innerValue);
  }

  const isActive = Array.isArray(collapseValue) ? collapseValue.includes(innerValue) : collapseValue === innerValue;
  useEffect(() => {
    if (!contentRef.current) return;
    const panelBodyNode = contentRef.current?.parentNode as HTMLElement;
    panelBodyNode.style.height = isActive ? `${contentRef.current.clientHeight}px` : '0px';
  }, [isActive]);

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

  const renderBodyByNormal = () => (
    <div
      // style={{ height: `${isActive ? contentRef.current.clientHeight : 0}` }}
      // style={{ height: `${isActive ? 'auto' : 0}` }}
      className={classnames(`${componentName}__body`, `${classPrefix}-slide-down-enter-active`)}
    >
      <div className={`${componentName}__content`} ref={contentRef}>
        {children}
      </div>
    </div>
  );

  const renderBodyDestroyOnCollapse = () =>
    isActive ? (
      <div className={classnames(`${componentName}__body`, `${classPrefix}-slide-down-enter-active`)}>
        <div className={`${componentName}__content`} ref={contentRef}>
          {children}
        </div>
      </div>
    ) : null;

  return (
    <div className={classes} style={{ ...style }}>
      <div className={`${componentName}__wrapper`}>
        {renderHeader()}
        {/* <CSSTransition timeout={500} classNames={classnames(`${classPrefix}-slide-down-enter-active`)} key={1}>
          {destroyOnCollapse ? renderBodyDestroyOnCollapse() : renderBodyByNormal()}
        </CSSTransition> */}
        {destroyOnCollapse ? renderBodyDestroyOnCollapse() : renderBodyByNormal()}
      </div>
    </div>
  );
};

CollapsePanel.displayName = 'CollapsePanel';

export default CollapsePanel;
