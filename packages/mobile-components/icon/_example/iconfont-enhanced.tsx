import React from 'react';
import { IconFont } from 'tdesign-icons-react';
import type { IconProps } from 'tdesign-icons-react';

const CustomUrlIconFont = ({ name, size, style }: Partial<Pick<IconProps, 'name' | 'size' | 'style'>>) => (
  <IconFont name={name} size={size} style={style} url="https://tdesign.gtimg.com/icon/default-demo/index.css" />
);

export default function FontEnhancedIcon() {
  return (
    <div className="t-demo-iconfont">
      <div>
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" />
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="medium" />
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="large" />
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="25px" />
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="2em" />
      </div>
      <br />
      <div>
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ color: 'red' }} />
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ color: 'green' }} />
        <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ color: 'orange' }} />
        <CustomUrlIconFont name="t-icon-home" />
      </div>
    </div>
  );
}
