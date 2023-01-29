import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { useCollapseContext } from './CollapseContext';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../hooks/useConfig';
import { TdCollapsePanelProps } from './type';
import { StyledProps } from '../common';
import { collapsePanelDefaultProps } from './defaultProps';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {
  children?: React.ReactNode;
  index?: number;
}

const CollapsePanel = (props: CollapsePanelProps) => {
  const {
    value,
    disabled,
    destroyOnCollapse,
    expandIcon,
    className,
    style,
    header,
    headerRightContent,
    children,
    index,
  } = props;
  const {
    disabled: disableAll,
    defaultExpandAll,
    expandIconPlacement,
    expandOnRowClick,
    expandIcon: expandIconAll,
    updateCollapseValue,
    collapseValue,
  } = useCollapseContext();

  const { classPrefix } = useConfig();
  const componentName = `${classPrefix}-collapse-panel`;
  const innerValue = value || index;
  const finalExpandIcon = (expandIcon === undefined ? expandIconAll : expandIcon) || null;
  const headRef = useRef();
  const iconRef = useRef();
  const contentRef = useRef<HTMLDivElement>();
  const bodyRef = useRef<HTMLDivElement>();
  const isDisabled = disabled || disableAll;

  useEffect(() => {
    if (defaultExpandAll) {
      updateCollapseValue(innerValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = Array.isArray(collapseValue) ? collapseValue.includes(innerValue) : collapseValue === innerValue;

  const classes = classnames(
    componentName,
    {
      [`${classPrefix}-is-disabled`]: isDisabled,
    },
    className,
  );

  const handleClick = (e) => {
    const canExpand = (expandOnRowClick && e.currentTarget === headRef.current) || e.currentTarget === iconRef.current;

    if (canExpand && !isDisabled) {
      updateCollapseValue(innerValue);
    }
    e.stopPropagation();
  };

  const renderIcon = () => {
    let iconNode = null;
    if (React.isValidElement(finalExpandIcon)) {
      iconNode = finalExpandIcon;
    } else if (finalExpandIcon) {
      iconNode = <FakeArrow className={classnames(`${componentName}__icon--default`)} />;
    }
    return (
      iconNode && (
        <div
          className={`${componentName}__icon ${componentName}__icon--${expandIconPlacement} ${
            isActive ? `${componentName}__icon--active` : ''
          }`}
          ref={iconRef}
          onClick={handleClick}
        >
          {iconNode}
        </div>
      )
    );
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
        {expandIconPlacement === 'left' && renderIcon()}
        {header}
        <div className={`${componentName}__header--blank`}></div>
        {headerRightContent}
        {expandIconPlacement === 'right' && renderIcon()}
      </div>
    );
  };

  const renderBody = () => {
    const transitionCallbacks = {
      onEnter: () => {
        bodyRef.current.style.height = `${contentRef?.current.clientHeight}px`;
      },
      onEntered: () => {
        bodyRef.current.style.height = 'auto';
      },
      onExit: () => {
        bodyRef.current.style.height = `${contentRef?.current.clientHeight}px`;
      },
      onExiting: () => {
        bodyRef.current.style.height = '0px';
      },
    };
    return (
      <CSSTransition
        in={isActive}
        appear
        timeout={300}
        nodeRef={bodyRef}
        unmountOnExit={destroyOnCollapse}
        {...transitionCallbacks}
      >
        <div
          style={{ height: 0 }}
          className={classnames(`${componentName}__body`, `${classPrefix}-slide-down-enter-active`, {
            [`${componentName}__body--collapsed`]: !isActive,
          })}
          ref={bodyRef}
        >
          <div className={`${componentName}__content`} ref={contentRef}>
            {children}
          </div>
        </div>
      </CSSTransition>
    );
  };

  return (
    <div className={classes} style={{ ...style }}>
      <div className={`${componentName}__wrapper`}>
        {renderHeader()}
        {renderBody()}
      </div>
    </div>
  );
};

CollapsePanel.displayName = 'CollapsePanel';
CollapsePanel.defaultProps = collapsePanelDefaultProps;

export default CollapsePanel;
