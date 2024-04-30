import React, { useState, useCallback } from 'react';
import { Space, Tabs } from 'tdesign-react';
import debounce from 'lodash/debounce';

const { TabPanel } = Tabs;

const defaultList = [
  { label: '选项卡一', value: 1, panel: <p style={{ padding: 25 }}>这是选项卡一的内容，使用 Tabs 渲染</p> },
  { label: '选项卡二', value: 2, panel: <p style={{ padding: 25 }}>这是选项卡二的内容，使用 Tabs 渲染</p> },
  { label: '选项卡三', value: 3, panel: <p style={{ padding: 25 }}>这是选项卡三的内容，使用 Tabs 渲染</p> },
];

export default function DragSortExample() {

  const [tabList1, setTabList1] = useState([...defaultList]);
  const [tabList2, setTabList2] = useState([...defaultList]);

  const onDragSort1 = useCallback(debounce(({ currentIndex, targetIndex }) => {
    const temp = tabList1[currentIndex];
    tabList1[currentIndex] = tabList1[targetIndex];
    tabList1[targetIndex] = temp;
    setTabList1([...tabList1]);
  }, 500), [tabList1]);

  const onDragSort2 = useCallback(debounce(({ currentIndex, targetIndex }) => {
    const temp = tabList2[currentIndex];
    tabList2[currentIndex] = tabList2[targetIndex];
    tabList2[targetIndex] = temp;
    setTabList2([...tabList2]);
  }, 500), [tabList2]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Tabs
        defaultValue={1}
        list={tabList1}
        dragSort
        onDragSort={onDragSort1}
      />
      <Tabs
        dragSort
        onDragSort={onDragSort2}
        placement={'top'}
        size={'medium'}
        defaultValue={1}
      >
        {
          tabList2.map(({ label, value, panel }) => 
            <TabPanel key={value} value={value} label={label}>
              {panel}
            </TabPanel>
          )
        }
      </Tabs>
    </Space>
  );
}
