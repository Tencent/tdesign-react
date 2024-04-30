import React, { useState } from 'react';
import { Space, Tag } from 'tdesign-react';

const { CheckTag } = Tag;

const STYLE_B_UNCHECKED_PROPS = {
  theme: 'default',
  variant: 'outline',
};

const STYLE_C_CHECKED_PROPS = {
  theme: 'primary',
  variant: 'outline',
};

export default function CheckTagExample() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  return (
    <Space direction="vertical">
      <Space align="center">
        <label>StyleA</label>
        <CheckTag checked={checked1} onChange={setChecked1} style={{ marginRight: '32px' }}>
          选中/未选态
        </CheckTag>
        <CheckTag checked={true}>选中态</CheckTag>
        <CheckTag checked={false}>未选态</CheckTag>
        <CheckTag checked={true} disabled>
          选中禁用
        </CheckTag>
        <CheckTag checked={false} disabled>
          未选禁用
        </CheckTag>
      </Space>

      <Space align="center">
        <label>StyleB</label>
        <CheckTag
          checked={checked2}
          onChange={setChecked2}
          uncheckedProps={STYLE_B_UNCHECKED_PROPS}
          style={{ marginRight: '32px' }}
        >
          选中/未选态
        </CheckTag>

        <CheckTag checked={true}>选中态</CheckTag>
        <CheckTag checked={false} uncheckedProps={STYLE_B_UNCHECKED_PROPS}>
          未选态
        </CheckTag>
        <CheckTag checked={true} disabled>
          选中禁用
        </CheckTag>
        <CheckTag checked={false} disabled uncheckedProps={STYLE_B_UNCHECKED_PROPS}>
          未选禁用
        </CheckTag>
      </Space>

      <Space align="center">
        <label>StyleC</label>
        <CheckTag
          checked={checked3}
          onChange={setChecked3}
          checkedProps={STYLE_C_CHECKED_PROPS}
          uncheckedProps={STYLE_B_UNCHECKED_PROPS}
          style={{ marginRight: '32px' }}
        >
          Outline Tag
        </CheckTag>

        <CheckTag checked={true} checkedProps={STYLE_C_CHECKED_PROPS}>
          Checked
        </CheckTag>
        <CheckTag checked={false} uncheckedProps={STYLE_B_UNCHECKED_PROPS}>
          Unchecked
        </CheckTag>
        <CheckTag checked={true} disabled checkedProps={STYLE_C_CHECKED_PROPS}>
          Disabled
        </CheckTag>
        <CheckTag checked={false} disabled uncheckedProps={STYLE_B_UNCHECKED_PROPS}>
          Disabled
        </CheckTag>
      </Space>
    </Space>
  );
}
