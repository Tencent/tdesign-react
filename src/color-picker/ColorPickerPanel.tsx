import React from 'react';
import useClassname from './hooks/useClassname';
import ColorPanel from './components/panel';

const ColorPickerPanel = (props) => {
  const baseClassName = useClassname();
  return <ColorPanel {...props} popupProps={null} closeBtn={false} class={`${baseClassName}-is-inline`} />;
};

ColorPickerPanel.displayName = 'ColorPickerPanel';

export default React.memo(ColorPickerPanel);
