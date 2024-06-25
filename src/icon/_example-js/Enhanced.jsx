import React from 'react';
import { Icon } from 'tdesign-icons-react';

const CustomUrlIcon = ({ name, size, style }) => (
  <Icon name={name} size={size} style={style} url="https://tdesign.gtimg.com/icon/default-demo/index.js" />
);

function EnhancedIconExample() {
  return (
    <div>
      <CustomUrlIcon name="cps-icon-home-sheep" style={{ marginRight: '8px' }} />
      <CustomUrlIcon name="cps-icon-home-sheep" size="medium" style={{ marginRight: '8px' }} />
      <CustomUrlIcon name="cps-icon-home-sheep" size="large" style={{ marginRight: '8px' }} />
      <CustomUrlIcon name="cps-icon-home-sheep" size="25px" />
      <br />
      <br />
      <CustomUrlIcon name="cps-icon-home-sheep" style={{ color: 'red', marginRight: '8px' }} />
      <CustomUrlIcon name="cps-icon-home-sheep" style={{ color: 'green', marginRight: '8px' }} />
      <CustomUrlIcon name="cps-icon-home-sheep" style={{ color: 'orange', marginRight: '8px' }} />
      <CustomUrlIcon name="t-icon-home" />
    </div>
  );
}

export default EnhancedIconExample;
