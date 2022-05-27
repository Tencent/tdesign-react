import React, { useState } from 'react';
import { Collapse, Button, Checkbox } from 'tdesign-react';

const { Panel } = Collapse;
export default function CollapseExample() {
  const [disable, setDisable] = useState(false);
  return (
    <div className="tdesign-demo-block-row">
      <Collapse>
        <Panel header="这是一个折叠标题" headerRightContent={<Button size="small">操作</Button>}>
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
        <Panel header="这是一个折叠标题" headerRightContent={<Button size="small">操作</Button>}>
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
        <Panel
          header="这是一个折叠标题"
          headerRightContent={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={disable}
                onClick={() => {
                  setDisable(!disable);
                }}
              >
                是否禁止
              </Checkbox>
              <Button size="small">操作</Button>
            </div>
          }
          disabled={disable}
        >
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
      </Collapse>
    </div>
  );
}
