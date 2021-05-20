import React from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const DisabledSelect = () => (
  <div style={{ display: 'flex' }}>
    <Select value="apple" style={{ width: '40%' }} disabled>
      <Option key="apple" label="Apple" value="apple" />
    </Select>
  </div>
);

export default DisabledSelect;
