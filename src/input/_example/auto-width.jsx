import React from 'react';
import { Input } from 'tdesign-react';

const InputAutoWidth = () => (
  <div className="tdesign-demo-block-column" style={{ maxWidth: '500px' }}>
    <Input autoWidth defaultValue="宽度自适应" />
  </div>
)

InputAutoWidth.displayName = 'InputAutoWidth';

export default InputAutoWidth
