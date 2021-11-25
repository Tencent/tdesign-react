import React from 'react';
import { Select } from 'tdesign-react';

function Status() {
  return (
    <div style={{ display: 'flex' }}>
      <Select
        style={{ width: '200px', marginRight: '20px' }}
        options={[
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ]}
      ></Select>
      <Select
        style={{ width: '200px', marginRight: '20px' }}
        options={[
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ]}
        disabled
      ></Select>
      <Select
        style={{ width: '200px' }}
        options={[
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ]}
        loading
      ></Select>
    </div>
  );
}

export default Status;
