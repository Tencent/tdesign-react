import React from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioControlledExample() {
  return (
    <>
      <div>
        <h5>普通单选按钮</h5>
        <Radio.Group size="large" defaultValue="gz">
          <Radio value="bj">选项一</Radio>
          <Radio value="sh">选项二</Radio>
          <Radio value="gz">选项三</Radio>
          <Radio value="sz">选项四</Radio>
        </Radio.Group>
      </div>
      <div style={{ margin: '16px 0' }}>
        <h5>边框型单选按钮</h5>
        <Radio.Group size="large" defaultValue="1">
          <Radio.Button value="1">选项一</Radio.Button>
          <Radio.Button value="2">选项二</Radio.Button>
          <Radio.Button value="3">选项三</Radio.Button>
        </Radio.Group>
        <Radio.Group size="large" defaultValue="1">
          <Radio.Button value="1" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button value="2" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <h5>填充型单选按钮</h5>
        <Radio.Group size="large" buttonStyle="solid" defaultValue="gz">
          <Radio.Button value="bj">选项一</Radio.Button>
          <Radio.Button value="gz">选项二</Radio.Button>
          <Radio.Button value="sz">选项三</Radio.Button>
        </Radio.Group>
        <Radio.Group size="large" buttonStyle="solid" defaultValue="bj">
          <Radio.Button value="bj" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button value="gz" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>
      </div>
    </>
  );
}
