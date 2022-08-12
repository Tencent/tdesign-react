import React, { useState, useRef } from 'react';
import { Popup, PopupProps } from '../popup';
import { ColorPickerProps, TdColorContext } from './interface';
import useClassName from './hooks/useClassNames';
import useControlled from '../hooks/useControlled';
import ColorTrigger from './components/trigger';
import ColorPanel from './components/panel/index';
import useClickOutside from '../_util/useClickOutside';
import { colorPickerDefaultProps } from './defaultProps';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const baseClassName = useClassName();
  const { popupProps, disabled, inputProps, onChange, colorModes, ...rest } = props;
  const { overlayClassName, overlayInnerStyle = {}, ...restPopupProps } = popupProps || {};

  const [visible, setVisible] = useState(false);
  const [innerValue, setInnerValue] = useControlled(props, 'value', onChange);
  const triggerRef = useRef<HTMLDivElement>();
  const colorPanelRef = useRef();

  const popProps: PopupProps = {
    placement: 'bottom-left',
    expandAnimation: true,
    trigger: 'click',
    visible,
    ...restPopupProps,
    overlayClassName: [baseClassName, overlayClassName],
    overlayInnerStyle: {
      padding: 0,
      ...overlayInnerStyle,
    },
  };

  useClickOutside(
    [triggerRef, colorPanelRef],
    () => {
      setVisible(false);
    },
    true,
  );

  return (
    <Popup
      {...popProps}
      onVisibleChange={(v) => setVisible(v)}
      content={
        !disabled && (
          <ColorPanel
            {...rest}
            disabled={disabled}
            value={innerValue}
            colorModes={colorModes}
            togglePopup={setVisible}
            onChange={(value: string, context: TdColorContext) => setInnerValue(value, context)}
            ref={colorPanelRef}
          />
        )
      }
    >
      <div className={`${baseClassName}__trigger`} ref={triggerRef}>
        <ColorTrigger disabled={disabled} inputProps={inputProps} value={innerValue} onChange={setInnerValue} />
      </div>
    </Popup>
  );
};

ColorPicker.displayName = 'ColorPicker';
ColorPicker.defaultProps = colorPickerDefaultProps;

export default React.memo(ColorPicker);
