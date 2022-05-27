import React, { useState } from 'react';
import { Collapse, TagInput, Radio, Checkbox } from 'tdesign-react';

const { Panel } = Collapse;

export default function CollapseExample() {
  const [radio, setRadio] = useState(1);
  const [checked, setChecked] = useState(false);
  const options = [
    { value: 1, label: '左边' },
    { value: 2, label: '右边' },
    { value: 3, label: '不展示' },
  ];
  return (
    <div className="tdesign-demo-block-row">
      <Collapse
        expandIcon={[1, 2].includes(radio)}
        expandIconPlacement={radio === 1 ? 'left' : 'right'}
        expandOnRowClick={!checked}
      >
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
      <div>
        <Radio.Group value={radio} options={options} onChange={setRadio} />
        <div>
          <Checkbox
            checked={checked}
            onChange={() => {
              setChecked(!checked);
            }}
          >
            仅图标响应点击
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
