import React, { useState } from 'react';

import Select from '../base/Select';

const SingleSelect = () => {
  const [value, setValue] = useState('lucy');
  const onChange = (value) => {
    setValue('Tom');
  };
  return <Select value={value} change={onChange} />;
};

export default SingleSelect;
