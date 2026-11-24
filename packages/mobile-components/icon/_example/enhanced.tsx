import React from 'react';
import { Icon } from 'tdesign-icons-react';
import type { IconProps } from 'tdesign-icons-react';

const CustomUrlIcon = ({ name, size, style }: Partial<Pick<IconProps, 'name' | 'size' | 'style'>>) => (
  <Icon name={name} size={size} style={style} url="https://tdesign.gtimg.com/icon/default-demo/index.js" />
);

export default function EnhancedIcon() {
  return (
    <div className="t-demo-iconfont">
      <div>
        <CustomUrlIcon name="cps-icon-home-sheep" style={{ marginRight: '8px' }} />
        <CustomUrlIcon name="cps-icon-home-sheep" size="medium" style={{ marginRight: '8px' }} />
        <CustomUrlIcon name="cps-icon-home-sheep" size="large" style={{ marginRight: '8px' }} />
        <CustomUrlIcon name="cps-icon-home-sheep" size="25px" />
      </div>
      <br />
      <div>
        <CustomUrlIcon name="cps-icon-home-sheep" style={{ color: 'red' }} />
        <CustomUrlIcon name="cps-icon-home-sheep" style={{ color: 'green' }} />
        <CustomUrlIcon name="cps-icon-home-sheep" style={{ color: 'orange' }} />
        <CustomUrlIcon name="t-icon-home" />
      </div>
    </div>
  );
}
