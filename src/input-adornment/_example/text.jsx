import React from 'react';
import { Input, TagInput, InputAdornment } from 'tdesign-react';

export default function BaseExample() {
  return (
    <div className="tdesign-demo-block-column">
      <InputAdornment prepend="http://">
        <Input />
      </InputAdornment>

      <InputAdornment append=".com">
        <TagInput />
      </InputAdornment>

      <InputAdornment prepend="http://" append=".com">
        <Input />
      </InputAdornment>
    </div>
  );
}
