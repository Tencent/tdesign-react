import React, { useEffect, useRef } from 'react';

import classnames from 'classnames';

import CollapseContext from './CollapseContext';
import CollapsePanel from './CollapsePanel';
import { collapseDefaultProps } from './defaultProps';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';

import type { StyledProps } from '../common';
import type { CollapsePanelProps } from './CollapsePanel';
import type { TdCollapseProps, CollapsePanelValue, CollapseValue } from './type';
import type { MouseEvent } from 'react';

export interface CollapseProps extends TdCollapseProps, StyledProps {
  children?: React.ReactNode;
}

const Collapse = forwardRefWithStatics(
  (originalProps: CollapseProps, ref: React.Ref<HTMLDivElement>) => {
    const props = useDefaultProps<CollapseProps>(originalProps, collapseDefaultProps);
    const { classPrefix } = useConfig();
    const componentName = `${classPrefix}-collapse`;
    const borderlessClass = `${classPrefix}--border-less`;
    const { defaultExpandAll, disabled, expandIconPlacement, expandOnRowClick, expandIcon, ...rest } = props;
    const { children, className, style, expandMutex, borderless, onChange } = rest;
    const [collapseValue, setCollapseValue] = useControlled(props, 'value', onChange);
    const collapseValues = useRef(collapseValue);
    useEffect(() => {
      collapseValues.current = collapseValue;
    }, [collapseValue]);

    const updateCollapseValue = (value: CollapsePanelValue, context?: { e: MouseEvent }) => {
      let newValue: CollapseValue = [].concat(collapseValues.current || []);
      const index = newValue.indexOf(value);
      if (index >= 0) {
        newValue.splice(index, 1);
      } else if (expandMutex) {
        newValue = [value];
      } else {
        newValue.push(value);
      }
      collapseValues.current = [...newValue];
      setCollapseValue(newValue, context);
    };

    const classes = [
      componentName,
      {
        [borderlessClass]: !!borderless,
      },
      className,
    ];

    const childrenList = React.Children.toArray(children).filter(
      (child: React.ReactElement<CollapsePanelProps>) => (child.type as any).displayName === CollapsePanel.displayName,
    );

    const collapsePanelList = () =>
      childrenList.map((child: React.ReactElement<any>, index: number) => {
        const key = child.key || String(index);
        const childProps = {
          key,
          index: index + 1,
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
          collapseValue,
        }}
      >
        <div className={classnames(classes)} style={style} ref={ref}>
          {collapsePanelList()}
        </div>
      </CollapseContext.Provider>
    );
  },
  {
    Panel: CollapsePanel,
  },
);

Collapse.displayName = 'Collapse';

export default Collapse;
