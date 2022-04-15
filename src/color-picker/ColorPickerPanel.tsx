import React from 'react';
import ColorPanel from './components/panel';
import { ColorPickerProps } from './interface';

const ColorPickerPanel = (props: ColorPickerProps) => <ColorPanel {...props} popupProps={null} closeBtn={false} />;

ColorPickerPanel.displayName = 'ColorPickerPanel';

export default React.memo(ColorPickerPanel);
