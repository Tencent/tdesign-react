import React from 'react';
import { IconFont } from 'tdesign-icons-react';

const CustomUrlIconFont = ({ name, size, style }) => (
  <IconFont name={name} size={size} style={style} url="https://tdesign.gtimg.com/icon/default-demo/index.css" />
);

function EnhancedIconExample() {
  return (
    <div>
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ marginRight: '8px' }} />
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="medium" style={{ marginRight: '8px' }} />
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="large" style={{ marginRight: '8px' }} />
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" size="25px" />
      <br />
      <br />
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ color: 'red', marginRight: '8px' }} />
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ color: 'green', marginRight: '8px' }} />
      <CustomUrlIconFont name="cps-icon cps-icon-home-sheep" style={{ color: 'orange', marginRight: '8px' }} />
      <CustomUrlIconFont name="t-icon-home" />
    </div>
  );
}

export default EnhancedIconExample;
