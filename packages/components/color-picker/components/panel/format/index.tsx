import React, { useState } from 'react';
import { Color, getColorFormatOptions } from '@tdesign/common-js/color-picker/index';
import Select from '../../../../select';
import FormatInputs from './inputs';
import { TdColorPickerProps } from '../../../type';

export interface TdColorFormatProps extends TdColorPickerProps {
  onModeChange: Function;
  onInputChange: Function;
  baseClassName: string;
  color: Color;
}

const FormatPanel = (props: TdColorFormatProps) => {
  const { enableAlpha, baseClassName, format, onModeChange, selectInputProps } = props;
  const [formatMode, setFormatMode] = useState(format);
  const handleModeChange = (v: TdColorPickerProps['format']) => {
    setFormatMode(v);
    onModeChange(v);
  };

  return (
    <div className={`${baseClassName}__format`}>
      <div className={`${baseClassName}__format--item`}>
        <Select
          size="small"
          className={`${baseClassName}__format-mode-select`}
          popupProps={{
            overlayClassName: `${baseClassName}__select-options`,
            ...selectInputProps?.popupProps,
          }}
          autoWidth
          value={formatMode}
          onChange={handleModeChange}
        >
          {getColorFormatOptions(enableAlpha).map((item) => (
            <Select.Option key={item} value={item} label={item} style={{ fontSize: '12px' }} />
          ))}
        </Select>
      </div>
      <div className={`${baseClassName}__format--item`}>
        <FormatInputs {...props} format={formatMode} />
      </div>
    </div>
  );
};

export default React.memo(FormatPanel);
