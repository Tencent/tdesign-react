import React, { useRef } from 'react';

import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useLayoutEffect from '../hooks/useLayoutEffect';
import { Popup } from '../popup';
import ColorPanel from './components/panel/index';
import ColorTrigger from './components/trigger';
import { colorPickerDefaultProps } from './defaultProps';
import useClassName from './hooks/useClassNames';

import type { PopupProps, PopupRef } from '../popup';
import type { ColorPickerProps, TdColorContext } from './interface';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const baseClassName = useClassName();
  const {
    popupProps,
    clearable,
    disabled,
    borderless,
    inputProps,
    onChange,
    onClear,
    colorModes,
    enableAlpha,
    ...rest
  } = useDefaultProps<ColorPickerProps>(props, colorPickerDefaultProps);
  const { overlayClassName, overlayInnerStyle = {}, ...restPopupProps } = popupProps || {};

  const [innerValue, setInnerValue] = useControlled(props, 'value', onChange);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<PopupRef>(null);
  const colorPanelRef = useRef(null);

  useLayoutEffect(() => {
    if (!disabled) return;
    popupRef.current?.setVisible(false);
  }, [disabled]);

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
      ref={popupRef}
      disabled={disabled}
      {...popProps}
      content={
        !disabled && (
          <ColorPanel
            {...rest}
            disabled={disabled}
            value={innerValue}
            colorModes={colorModes}
            enableAlpha={enableAlpha}
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
          enableAlpha={enableAlpha}
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
