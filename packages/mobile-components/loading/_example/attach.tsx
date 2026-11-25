import React, { useState } from 'react';
import { Loading, Switch } from 'tdesign-mobile-react';

export default function AttachLoading() {
  const [value, setValue] = useState(false);

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <div className="loading-demo">
      <div id="alice" className="loading-attach-demo__title">
        Hello, I`&apos;m Alice. I`&apos;m going to be a front-end developer.
      </div>
      <Loading attach="#alice" size="20px" loading={value}></Loading>
      <Switch value={value} custom-value={[true, false]} size="small" label={['开', '关']} onChange={onChange} />
    </div>
  );
}
