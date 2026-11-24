import React, { useState } from 'react';
import { ColorPicker, Popup } from 'tdesign-mobile-react';
import type { ColorObject, PopupProps } from 'tdesign-mobile-react';
import Button from 'tdesign-mobile-react/button';

export default function () {
  const [visible, setVisible] = useState<boolean>(false);
  const onChange = (value: string) => {
    console.log('change', value);
  };
  const onClose: NonNullable<PopupProps['onVisibleChange']> = (visible, target) => {
    console.log('close', visible, target);
    if (!visible) {
      setVisible(false);
    }
  };
  const onPaletteBarChange = (e: { color: ColorObject }) => {
    console.log('onPaletteBarChange', e.color);
  };
  const handlePopup = () => {
    setVisible(true);
  };
  return (
    <>
      <Popup showOverlay placement="bottom" visible={visible} onVisibleChange={onClose}>
        <ColorPicker enableAlpha fixed type="multiple" onChange={onChange} onPaletteBarChange={onPaletteBarChange} />
      </Popup>
      <div className="row">
        <Button block size="large" variant="outline" theme="primary" onClick={handlePopup}>
          弹窗形式的颜色选择器
        </Button>
      </div>
    </>
  );
}
