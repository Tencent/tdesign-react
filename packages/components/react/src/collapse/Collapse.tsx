import React, { useEffect, useRef, MouseEvent } from 'react';
import classnames from 'classnames';
import { TdCollapseProps, CollapsePanelValue, CollapseValue } from './type';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useControlled from '../hooks/useControlled';
import CollapsePanel from './CollapsePanel';
import CollapseContext from './CollapseContext';
import { collapseDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

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
      (child: JSX.Element) => child.type.displayName === CollapsePanel.displayName,
    );

    const collapsePanelList = () =>
      childrenList.map((child: React.ReactElement, index: number) => {
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
