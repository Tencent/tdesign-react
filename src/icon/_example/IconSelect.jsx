import React, { useState } from 'react';
import { Select } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import { manifest } from 'tdesign-icons-react/lib/manifest';

const { Option } = Select;
function IconSelect() {
  const [value, setValue] = useState('edit-1');
  return (
    <Select value={value} onChange={setValue} prefixIcon={<Icon name={value} style={{ marginRight: '8px' }} />}>
      {manifest.map((item) => (
        <Option
          key={item.stem}
          value={item.stem}
          label={item.stem}
          style={{ display: 'inline-block', fontSize: '20px' }}
        >
          <Icon name={item.stem} />
        </Option>
      ))}
    </Select>
  );
}

export default IconSelect;
