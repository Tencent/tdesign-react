import React, { useRef } from 'react';
import { Popup, PopupProps } from '../popup';
import { ColorPickerProps, TdColorContext } from './interface';
import useClassName from './hooks/useClassNames';
import useControlled from '../hooks/useControlled';
import ColorTrigger from './components/trigger';
import ColorPanel from './components/panel/index';
import { colorPickerDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const baseClassName = useClassName();
  const { popupProps, clearable, disabled, borderless, inputProps, onChange, onClear, colorModes, ...rest } =
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
