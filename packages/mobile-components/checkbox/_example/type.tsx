import React from 'react';
import { Checkbox } from 'tdesign-mobile-react';

export default function () {
  const activeImage = 'https://tdesign.gtimg.com/mobile/demos/checkbox-checked.png';
  const inActiveImage = 'https://tdesign.gtimg.com/mobile/demos/checkbox.png';

  return (
    <>
      <Checkbox label="多选" icon="line" defaultChecked />
      <div style={{ height: '16px' }}></div>
      <Checkbox label="多选" icon="rectangle" defaultChecked />
      <div style={{ height: '16px' }}></div>
      <Checkbox label="图片图标" icon={[activeImage, inActiveImage]} value="checkbox1" />
    </>
  );
}
