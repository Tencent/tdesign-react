import React, { useRef, useEffect } from 'react';
import { throttle } from 'lodash';
import Color from '../../../utils/color';
import Input from '../../../../input';
import InputNumber from '../../../../input-number';
import { FORMAT_INPUT_CONFIG } from './config';

const FormatInputs = (props) => {
  const { format, enableAlpha, inputProps, disabled, onInputChange, color } = props;
  const formatValue = useRef({});
  const lastModelValue = useRef({});

  // 获取不同格式的输入输出值
  const getFormatColorMap = (type: 'encode' | 'decode') => {
    if (type === 'encode') {
      return {
        HSV: color.getHsva(),
        HSL: color.getHsla(),
        RGB: color.getRgba(),
        CMYK: color.getCmyk(),
        CSS: {
          css: color.css,
        },
        HEX: {
          hex: color.hex,
        },
      };
    }
    // decode
    return {
      HSV: Color.object2color(formatValue, 'HSV'),
      HSL: Color.object2color(formatValue, 'HSL'),
      RGB: Color.object2color(formatValue, 'RGB'),
      CMYK: Color.object2color(formatValue, 'CMYK'),
      CSS: formatValue.current.css,
      HEX: formatValue.current.hex,
    };
  };

  // 更新modelValue
  const updateModelValue = () => {
    const values: any = getFormatColorMap('encode')[format];
    values.a = Math.round(color.alpha * 100);
    Object.keys(values).forEach((key) => {
      formatValue.current[key] = values[key];
      lastModelValue.current[key] = values[key];
    });
  };

  updateModelValue();

  const throttleUpdate = throttle(updateModelValue, 100);

  const inputConfigs = () => {
    const configs = [...FORMAT_INPUT_CONFIG[format]];
    if (enableAlpha) {
      configs.push({
        type: 'inputNumber',
        key: 'a',
        min: 0,
        max: 100,
        format: (value: number) => `${value}%`,
        flex: 1.15,
      });
    }
    return configs;
  };

  console.log('===formatValue.current', formatValue.current);

  const handleInputChange = (key: string, v: number | string) => {
    if (v === lastModelValue[key]) {
      return;
    }
    const value = getFormatColorMap('decode')[props.format];
    onInputChange(value, formatValue.current.a / 100, key, v);
  };

  useEffect(() => {
    throttleUpdate();
  }, [color.saturation, color.hue, color.value, color.alpha, format, throttleUpdate]);

  return (
    <div className="input-group">
      {inputConfigs().map((config) => {
        const commonProps = {
          ...inputProps,
          title: formatValue.current[config.key],
          value: formatValue.current[config.key],
          align: 'center',
          disabled,
          onBlur: (v: string) => handleInputChange(config.key, v),
          onEnter: (v: string) => handleInputChange(config.key, v),
        };
        return (
          <div
            className="input-group__item"
            key={config.key}
            style={{
              flex: config.flex || 1,
            }}
          >
            {config.type === 'input' ? (
              <Input {...commonProps} maxlength={format === 'HEX' ? 9 : undefined} />
            ) : (
              <InputNumber
                {...commonProps}
                min={config.min}
                max={config.max}
                step={1}
                format={config.format}
                theme="normal"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(FormatInputs);
