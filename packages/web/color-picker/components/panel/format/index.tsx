import React, { useState } from 'react';
import { upperCase } from 'lodash-es';
import Select from '../../../../select';
import FormatInput from './inputs';
import Color from '../../../../_common/js/color-picker/color';
import { FORMATS } from '../../../../_common/js/color-picker/constants';
import { TdColorPickerProps } from '../../../type';

export interface TdColorFormatProps extends TdColorPickerProps {
  onModeChange: Function;
  onInputChange: Function;
  baseClassName: string;
  color: Color;
}

const FormatPanel = (props: TdColorFormatProps) => {
  const { baseClassName, format, onModeChange, selectInputProps } = props;
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
          {FORMATS.map((item) => (
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
