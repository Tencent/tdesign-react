import React from 'react';
import { Select } from 'tdesign-react';

const { Option } = Select;

const DisabledSelect = () => (
  <Select value="apple" style={{ width: '40%' }} disabled>
    <Option key="apple" label="Apple" value="apple" />
  </Select>
);

export default DisabledSelect;
