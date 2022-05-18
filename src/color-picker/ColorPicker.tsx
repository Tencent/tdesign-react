import React, { useState, useRef } from 'react';
import { Popup, PopupProps } from '../popup';
import { ColorPickerProps, TdColorContext } from './interface';
import useClassname from './hooks/useClassname';
import useControlled from '../hooks/useControlled';
import ColorTrigger from './components/trigger';
import ColorPanel from './components/panel/index';
import useClickOutside from '../_util/useClickOutside';
import { colorPickerDefaultProps } from './defaultProps';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const baseClassName = useClassname();
  const { popupProps, disabled, inputProps, onChange, colorModes, ...rest } = props;
  const { overlayClassName, overlayStyle = {}, ...restPopupProps } = popupProps || {};

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
    overlayStyle: {
      padding: 0,
      ...overlayStyle,
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
        <ColorTrigger color={innerValue} disabled={disabled} inputProps={inputProps} onTriggerChange={setInnerValue} />
      </div>
    </Popup>
  );
};

ColorPicker.displayName = 'ColorPicker';
ColorPicker.defaultProps = colorPickerDefaultProps;

export default React.memo(ColorPicker);
