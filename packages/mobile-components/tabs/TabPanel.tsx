import React, { useContext, useEffect, useMemo, useState } from 'react';

import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import TabContext from './context';

import type { FC, ReactNode } from 'react';
import type { TdTabPanelProps } from './type';

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
