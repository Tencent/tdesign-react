import React from 'react';
import { Collapse, TagInput } from 'tdesign-react';

export default function CollapseExample() {
  const { Panel } = Collapse;
  return (
    <Collapse expandMutex>
      <Panel header="这是一个折叠标题">
        这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
      </Panel>
      <Panel destroyOnCollapse header="折叠后自动销毁">
        这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
      </Panel>
      <Panel header="自定义折叠面板内容">
        <div className="tdesign-demo-block-column" style={{ width: '80%' }}>
          <TagInput defaultValue={['Vue', 'React']} clearable />
        </div>
      </Panel>
    </Collapse>
  );
}
