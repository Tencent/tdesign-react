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

  const onDragSort1 = useCallback(
    debounce((contents) => {
      console.log('%c [ onDragSort1 ]-19', 'font-size:13px; background:#671c39; color:#ab607d;', contents);
      const temp = tabList1[contents.currentIndex];
      tabList1[contents.currentIndex] = tabList1[contents.targetIndex];
      tabList1[contents.targetIndex] = temp;
      setTabList1([...tabList1]);
    }, 500),
    [tabList1],
  );

  const onDragSort2 = useCallback(
    debounce(({ currentIndex, targetIndex }) => {
      const temp = tabList2[currentIndex];
      tabList2[currentIndex] = tabList2[targetIndex];
      tabList2[targetIndex] = temp;
      setTabList2([...tabList2]);
    }, 500),
    [tabList2],
  );

  const onDragStart = useCallback((dragStartContents) => {
    console.log('%c [ onDragStart ]-39', 'font-size:13px; background:#1b7980; color:#5fbdc4;', dragStartContents);
  }, []);

  const onDragEnd = useCallback((dragEndContents) => {
    console.log('%c [ onDragEnd ]-43', 'font-size:13px; background:#933e71; color:#d782b5;', dragEndContents);
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Tabs
        defaultValue={1}
        list={tabList1}
        dragSort
        onDragSort={onDragSort1}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
      <Tabs
        dragSort
        onDragSort={onDragSort2}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        placement={'top'}
        size={'medium'}
        defaultValue={1}
      >
        {tabList2.map(({ label, value, panel }) => (
          <TabPanel key={value} value={value} label={label}>
            {panel}
          </TabPanel>
        ))}
      </Tabs>
    </Space>
  );
}
