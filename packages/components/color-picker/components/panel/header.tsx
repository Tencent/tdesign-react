import React from 'react';

import { COLOR_MODES } from '@tdesign/common-js/color-picker/constants';

import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import Radio from '../../../radio';

import type { RadioValue } from '../../../radio';
import type { TdColorModes } from '../../interface';
import type { TdColorPickerProps } from '../../type';

export interface ColorPanelHeaderProps extends TdColorPickerProps {
  mode?: TdColorModes;
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
