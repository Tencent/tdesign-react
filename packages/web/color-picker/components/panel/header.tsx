import React from 'react';
import { COLOR_MODES } from '../../../_common/js/color-picker/constants';
import Radio, { RadioValue } from '../../../radio';
import { TdColorModes } from '../../interface';
import { TdColorPickerProps } from '../../type';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';

export interface ColorPanelHeaderProps extends TdColorPickerProps {
  mode?: TdColorModes;
  togglePopup?: Function;
  onModeChange?: (value: RadioValue, context: { e: React.ChangeEvent<HTMLInputElement> }) => void;
  baseClassName?: string;
}

const Header = (props: ColorPanelHeaderProps) => {
  const [local, t] = useLocaleReceiver('colorPicker');

  const { baseClassName, mode = 'monochrome', colorModes, onModeChange } = props;

  const isSingleMode = colorModes?.length === 1;

  if (isSingleMode) {
    return null;
  }

  return (
    <div className={`${baseClassName}__head`}>
      <div className={`${baseClassName}__mode`}>
        <Radio.Group variant="default-filled" size="small" value={mode} onChange={onModeChange}>
          {Object.keys(COLOR_MODES).map((key) => (
            <Radio.Button key={key} value={key}>
              {t(local[COLOR_MODES[key]])}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

export default React.memo(Header);
