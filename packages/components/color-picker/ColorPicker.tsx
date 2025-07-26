import React, { useRef } from 'react';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import { Popup, PopupProps } from '../popup';
import ColorPanel from './components/panel/index';
import ColorTrigger from './components/trigger';
import { colorPickerDefaultProps } from './defaultProps';
import useClassName from './hooks/useClassNames';
import type { ColorPickerProps, TdColorContext } from './interface';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const baseClassName = useClassName();
  const { popupProps, clearable, disabled, borderless, format, inputProps, onChange, onClear, colorModes, ...rest } =
    useDefaultProps<ColorPickerProps>(props, colorPickerDefaultProps);
  const { overlayClassName, overlayInnerStyle = {}, ...restPopupProps } = popupProps || {};

  const [innerValue, setInnerValue] = useControlled(props, 'value', onChange);
  const triggerRef = useRef<HTMLDivElement>(null);
  const colorPanelRef = useRef(null);

  const popProps: PopupProps = {
    placement: 'bottom-left',
    expandAnimation: true,
    trigger: 'click',
    ...restPopupProps,
    overlayClassName: [baseClassName, overlayClassName],
    overlayInnerStyle: {
      padding: 0,
      ...overlayInnerStyle,
    },
  };

  return (
    <Popup
      {...popProps}
      content={
        !disabled && (
          <ColorPanel
            {...rest}
            disabled={disabled}
            format={format}
            value={innerValue}
            colorModes={colorModes}
            onChange={(value: string, context: TdColorContext) => setInnerValue(value, context)}
            ref={colorPanelRef}
          />
        )
      }
    >
      <div className={`${baseClassName}__trigger`} ref={triggerRef}>
        <ColorTrigger
          clearable={clearable}
          disabled={disabled}
          borderless={borderless}
          inputProps={inputProps}
          value={innerValue}
          onChange={setInnerValue}
          onClear={onClear}
        />
      </div>
    </Popup>
  );
};

ColorPicker.displayName = 'ColorPicker';

export default React.memo(ColorPicker);
