import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import Color from '../../../../_common/js/color-picker/color';
import Input from '../../../../input';
import InputNumber from '../../../../input-number';
import { FORMAT_INPUT_CONFIG } from './config';

const FormatInputs = (props) => {
  const { format, enableAlpha, inputProps, disabled, onInputChange, color } = props;
  const [formatValue, setFormatValue] = useState<any>({});
  const lastModelValue = useRef({});

  const object2color = (f: string, newFormatValue: any) => {
    console.log('-----object2color', newFormatValue, f, Color.object2color(newFormatValue, f));
    return Color.object2color(newFormatValue, f);
  };

  // 获取不同格式的输入输出值
  const getFormatColorMap = (type: 'encode' | 'decode', newFormatValue) => {
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
      HSV: object2color('HSV', newFormatValue),
      HSL: object2color('HSL', newFormatValue),
      RGB: object2color('RGB', newFormatValue),
      CMYK: object2color('CMYK', newFormatValue),
      CSS: newFormatValue.css,
      HEX: newFormatValue.hex,
    };
  };

  // 更新 modelValue
  const updateModelValue = () => {
    const values: any = getFormatColorMap('encode', formatValue)[format];
    values.a = Math.round(color.alpha * 100);

    const changedFormatValue = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== formatValue[key]) {
        changedFormatValue[key] = values[key];
      }
      lastModelValue.current[key] = values[key];
    });

    if (Object.keys(changedFormatValue).length > 0) {
      setFormatValue({
        ...values,
      });
    }
  };

  useEffect(() => {
    updateModelValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    console.log('-----inputchange', key, v);
    if (v === lastModelValue.current[key]) {
      return;
    }

    const newFormatValue = {
      ...formatValue,
      [key]: v,
    };
    setFormatValue(newFormatValue);
    lastModelValue.current[key] = v;
    const value = getFormatColorMap('decode', newFormatValue)[format];
    onInputChange(value, formatValue.a / 100, key, v);
  };

  useEffect(() => {
    throttleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color.saturation, color.hue, color.value, color.alpha, format, formatValue]);

  return (
    <div className="input-group">
      {inputConfigs().map((config) => {
        const commonProps = {
          ...inputProps,
          title: formatValue[config.key],
          [config.type === 'input' ? 'defaultValue' : 'value']: formatValue[config.key],
          align: 'center',
          disabled,
          size: 'small',
          onChange:
            config.type === 'input'
              ? Function.prototype
              : (v: string) => handleInputChange(config.key, v || config.min),
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
              <Input {...commonProps} key={commonProps.defaultValue} maxlength={format === 'HEX' ? 9 : undefined} />
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
