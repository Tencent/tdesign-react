import React, { useState, useRef } from 'react';
import { Popup, PopupProps } from '../popup';
import { ColorPickerProps, TdColorContext } from './interface';
import useClassname from './hooks/useClassname';
import useDefault from '../_util/useDefault';
import ColorTrigger from './components/trigger';
import ColorPanel from './components/panel/index';
import useClickOutside from '../_util/useClickOutside';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const baseClassName = useClassname();
  const { popupProps, defaultValue, disabled = false, inputProps, value, onChange, colorModes, ...rest } = props;

  const [visible, setVisible] = useState(false);
  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);
  const triggerRef = useRef<HTMLDivElement>();
  const colorPanelRef = useRef();

  const popProps: PopupProps = {
    placement: 'bottom-left',
    ...((popupProps as PopupProps) || {}),
    trigger: 'click',
    attach: 'body',
    overlayClassName: [baseClassName],
    visible,
    overlayStyle: {
      padding: 0,
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
      <div className={`${baseClassName}__trigger`} onClick={() => setVisible(!visible)} ref={triggerRef}>
        <ColorTrigger color={innerValue} disabled={disabled} inputProps={inputProps} onTriggerChange={setInnerValue} />
      </div>
    </Popup>
  );
};

ColorPicker.displayName = 'ColorPicker';

export default React.memo(ColorPicker);
