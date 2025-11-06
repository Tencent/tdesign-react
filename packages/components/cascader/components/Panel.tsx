import React, { useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getPanels } from '../core/helper';
import { CascaderContextType } from '../interface';
import { TdCascaderProps } from '../type';
import { StyledProps } from '../../common';
import List from './List';
import { PanelContext } from '../context';

export interface CascaderPanelProps
  extends StyledProps,
    Pick<TdCascaderProps, 'trigger' | 'empty' | 'onChange' | 'loading' | 'loadingText' | 'option' | 'scroll'> {
  cascaderContext: CascaderContextType;
}

const Panel = (props: CascaderPanelProps) => {
  const { cascaderContext, option, scroll, trigger } = props;

  const [global] = useLocaleReceiver('cascader');
  const { classPrefix } = useConfig();
  const COMPONENT_NAME = `${classPrefix}-cascader`;

  const panels = useMemo(() => getPanels(cascaderContext.treeNodes), [cascaderContext.treeNodes]);

  const renderPanels = () => {
    const { inputVal, treeNodes } = props.cascaderContext;
    return inputVal ? (
      <List treeNodes={treeNodes} isFilter />
    ) : (
      panels.map((panelNodes, index: number) => (
        <List
          treeNodes={panelNodes}
          isFilter={false}
          segment={index !== panels.length - 1}
          key={`${COMPONENT_NAME}__menu${index}`}
          listKey={`${COMPONENT_NAME}__menu${index}`}
          level={index}
        />
      ))
    );
  };

  let content;
  if (props.loading) {
    content = <div className={`${COMPONENT_NAME}__panel--empty`}>{props.loadingText ?? global.loadingText}</div>;
  } else {
    content = panels?.length ? (
      renderPanels()
    ) : (
      <div className={`${COMPONENT_NAME}__panel--empty`}>{props.empty ?? global.empty}</div>
    );
  }

  const memoContext = useMemo(
    () => ({ option, cascaderContext, scroll, trigger }),
    [cascaderContext, option, scroll, trigger],
  );

  return (
    <PanelContext.Provider value={memoContext}>
      <div
        className={classNames(
          `${COMPONENT_NAME}__panel`,
          { [`${COMPONENT_NAME}--normal`]: panels.length && !props.loading },
          props.className,
        )}
        style={props.style}
      >
        {content}
      </div>
    </PanelContext.Provider>
  );
};

export default Panel;
