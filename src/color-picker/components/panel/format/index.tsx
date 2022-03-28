import React, { useState } from 'react';
import { upperCase } from 'lodash';
import Select from '../../../../select';
import FormatInput from './inputs';
import Color from '../../../utils/color';
import { FORMATS } from '../../../const';
import { TdColorPickerProps } from '../../../type';

export interface TdColorFormatProps extends TdColorPickerProps {
  onModeChange: Function;
  onInputChange: Function;
  baseClassName: string;
  color: Color;
}

const FormatPanel = (props: TdColorFormatProps) => {
  const { baseClassName, selectInputProps, format, onModeChange } = props;
  const [formatMode, setFormatMode] = useState(format);

  const handleModeChange = (v: TdColorPickerProps['format']) => {
    setFormatMode(v);
    onModeChange(v);
  };

  const formats: TdColorPickerProps['format'][] = [...FORMATS];

  return (
    <div className={`${baseClassName}__format`}>
      <div className={`${baseClassName}__format--item`}>
        <Select
          size="medium"
          className={`${baseClassName}__format-mode-select`}
          {...selectInputProps}
          popupProps={{
            overlayClassName: `${baseClassName}__select-options`,
          }}
          value={formatMode}
          onChange={handleModeChange}
        >
          {formats.map((item) => (
            <Select.Option key={item} value={item} label={upperCase(item)} style={{ fontSize: '12px' }} />
          ))}
        </Select>
      </div>
      <div className={`${baseClassName}__format--item`}>
        <FormatInput {...props} format={formatMode} />
      </div>
    </div>
  );
};

export default React.memo(FormatPanel);
