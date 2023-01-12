import React, { useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import Color from '../../../../_common/js/color-picker/color';
import Input from '../../../../input';
import InputNumber from '../../../../input-number';
import { FORMAT_INPUT_CONFIG } from './config';

const FormatInputs = (props) => {
  const { format, enableAlpha, inputProps, disabled, onInputChange, color } = props;
  const formatValue = useRef<any>({});
  const lastModelValue = useRef({});

  const object2color = (f: string) => Color.object2color(formatValue.current, f);

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
      HSV: object2color('HSV'),
      HSL: object2color('HSL'),
      RGB: object2color('RGB'),
      CMYK: object2color('CMYK'),
      CSS: formatValue.current.css,
      HEX: formatValue.current.hex,
    };
  };

  // 更新 modelValue
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

  const handleInputChange = (key: string, v: number | string) => {
    if (v === lastModelValue[key]) {
      return;
    }
    formatValue.current[key] = v;
    lastModelValue.current[key] = v;
    const value = getFormatColorMap('decode')[format];
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
          size: 'small',
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
