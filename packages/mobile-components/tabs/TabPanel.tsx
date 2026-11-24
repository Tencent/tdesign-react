import React, { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { TdTabPanelProps } from './type';
import TabContext from './context';
import { usePrefixClass } from '../hooks/useClass';
import parseTNode from '../_util/parseTNode';

export interface TabPanelProps extends TdTabPanelProps {
  children?: ReactNode;
}

const TabPanel: FC<TabPanelProps> = (props) => {
  const { value, lazy, destroyOnHide, children, panel } = props;

  const tabPanelClass = usePrefixClass('tab-panel');
  const tabClass = usePrefixClass('tabs');
  const tabProps = useContext(TabContext);
  const { currentValue } = tabProps;
  const isActive = useMemo(() => value === currentValue, [currentValue, value]);
  const [isMount, setIsMount] = useState(lazy ? isActive : true);

  useEffect(() => {
    if (isActive) {
      if (!isMount) {
        setIsMount(true);
      }
    } else if (destroyOnHide) {
      setIsMount(false);
    }
  }, [destroyOnHide, isActive, isMount, lazy]);

  return (
    isMount && (
      <div
        style={{ display: isActive ? 'block' : 'none' }}
        className={`${tabPanelClass} ${tabClass}__panel`}
        key={value}
      >
        {parseTNode(children, panel)}
      </div>
    )
  );
};
TabPanel.displayName = 'TabPanel';
export default TabPanel;
