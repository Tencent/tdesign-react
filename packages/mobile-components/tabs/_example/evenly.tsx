import React from 'react';
import { Tabs, TabPanel } from 'tdesign-mobile-react';

export default () => {
  const stickyProps = {
    zIndex: 999,
  };
  const tabPanels = [
    {
      value: 'first',
      label: '选项',
    },
    {
      value: 'second',
      label: '选项',
    },
    {
      value: 'third',
      label: '选项',
    },
    {
      value: 'four',
      label: '选项',
    },
  ];

  const tabPanelsNext = [
    {
      value: '1',
      label: '选项',
    },
    {
      value: '2',
      label: '选项',
    },
    {
      value: '3',
      label: '选项',
    },
    {
      value: '4',
      label: '选项',
    },
    {
      value: '5',
      label: '选项',
    },
  ];

  const onChange = ($event: number, label: string) => {
    console.log(`change to ${$event}`, label);
  };

  const onNextChange = ($event: number) => {
    console.log(`changeNext to ${$event}`);
  };

  return (
    <div>
      <Tabs defaultValue={'first'}>
        <TabPanel value={'first'} label={<div>选项</div>}></TabPanel>
        <TabPanel value={'second'} label={<div>选项</div>}></TabPanel>
      </Tabs>
      <Tabs defaultValue={0}>
        <TabPanel value={0} label={'选项'}></TabPanel>
        <TabPanel value={1} label={'选项'}></TabPanel>
        <TabPanel value={2} label={'选项'}></TabPanel>
      </Tabs>
      <Tabs defaultValue={'first'} sticky={true} stickyProps={stickyProps} onChange={onChange}>
        {tabPanels.map((item, index) => (
          <TabPanel key={index} value={item.value} label={item.label}></TabPanel>
        ))}
      </Tabs>
      <Tabs defaultValue={'1'} sticky={true} stickyProps={stickyProps} onChange={onNextChange}>
        {tabPanelsNext.map((item, index) => (
          <TabPanel key={index} value={item.value} label={item.label}></TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
