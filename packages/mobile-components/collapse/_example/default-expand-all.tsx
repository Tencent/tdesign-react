import React from 'react';
import { Collapse, CollapsePanel } from 'tdesign-mobile-react';

export default function () {
  return (
    <Collapse defaultExpandAll expandMutex={false}>
      <CollapsePanel value="0" header="面板1">
        内容1
      </CollapsePanel>
      <CollapsePanel value="1" header="面板2">
        内容2
      </CollapsePanel>
      <CollapsePanel value="2" header="面板2">
        内容2
      </CollapsePanel>
    </Collapse>
  );
}
