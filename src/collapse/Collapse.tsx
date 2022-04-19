import React from 'react';
import classnames from 'classnames';
import { TdCollapseProps, CollapsePanelValue, CollapseValue } from './type';
import { StyledProps } from '../common';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import CollapsePanel from './CollapsePanel';
import CollapseContext from './CollapseContext';

export interface CollapseProps extends TdCollapseProps, StyledProps {
  children?: React.ReactNode;
}

const Collapse = (props: CollapseProps) => {
  const { classPrefix } = useConfig();
  const componentName = `${classPrefix}-collapse`;
  const borderlessClass = `${classPrefix}-border-less`;
  const {
    defaultExpandAll = false,
    disabled = false,
    expandIconPlacement = 'left',
    expandOnRowClick = true,
    expandIcon = true,
    ...rest
  } = props;
  const { children, className, style = {}, value, expandMutex, borderless, defaultValue, onChange } = rest;
  const [collapseValue, setCollapseValue] = useDefault(value, defaultValue, onChange);

  const updateCollapseValue = (value: CollapsePanelValue) => {
    let newValue: CollapseValue = [].concat(collapseValue || []);
    const index = newValue.indexOf(value);
    if (index >= 0) {
      newValue.splice(index, 1);
    } else if (expandMutex) {
      newValue = [value];
    } else {
      newValue.push(value);
    }
    setCollapseValue(newValue);
  };

  const classes = () => [
    componentName,
    {
      [borderlessClass]: !!borderless,
    },
    className,
  ];

  const getUniqId = (() => {
    let index = 0;
    return () => (index += 1);
  })();

  const childrenList = React.Children.toArray(children).filter(
    (child: JSX.Element) => child.type.displayName === CollapsePanel.displayName,
  );

  const collapsePanelList = () =>
    childrenList.map((child: React.ReactElement, index: number) => {
      const key = child.key || String(index);
      const childProps = {
        key,
        ...child.props,
      };
      return React.cloneElement(child, childProps);
    });

  return (
    <CollapseContext.Provider
      value={{
        defaultExpandAll,
        disabled,
        expandIconPlacement,
        expandOnRowClick,
        expandIcon,
        updateCollapseValue,
        getUniqId,
        collapseValue,
      }}
    >
      <div className={classnames(classes())} style={style}>
        {collapsePanelList()}
      </div>
    </CollapseContext.Provider>
  );
};

Collapse.Panel = CollapsePanel;
Collapse.displayName = 'Collapse';

export default Collapse;
