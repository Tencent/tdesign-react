import React, { useRef, useEffect } from 'react';
import { throttle } from 'lodash-es';
import { Color, getColorFormatInputs, getColorFormatMap } from '@tdesign/common-js/color-picker/index';
import Input from '../../../../input';
import InputNumber from '../../../../input-number';

const FormatInputs = (props) => {
  const { format, enableAlpha, inputProps, disabled, onInputChange, color } = props;
  const modelValueRef = useRef({});
  const lastModelValue = useRef({});

  const updateModelValue = () => {
    const value = getColorFormatMap(color, 'encode')[format];
    if (!value) return;
    value.a = Math.round(color.alpha * 100);

    const changedFormatValue = {};
    Object.keys(value).forEach((key) => {
      if (value[key] !== modelValueRef.current[key]) {
        changedFormatValue[key] = value[key];
      }
      lastModelValue.current[key] = value[key];
    });

    if (Object.keys(changedFormatValue).length > 0) {
      modelValueRef.current = value;
    }
  };

  const handleInputChange = (key: string, v: number | string) => {
    if (v === lastModelValue.current[key]) return;
    lastModelValue.current[key] = v;

    const newFormatValue = {
      ...modelValueRef.current,
      [key]: v,
    };
    modelValueRef.current = newFormatValue;

    // 对应 COLOR_FORMAT_INPUTS 中的 key
    if (key === 'a') {
      // 透明通道
      color.alpha = (v as number) / 100;
    } else if (key === 'hex' || key === 'css') {
      // 纯字符串类型的格式
      color.update(v);
    } else {
      // 需要进一步转换的格式
      color.update(Color.object2color(newFormatValue, format));
    }

    const value = getColorFormatMap(color, 'decode')[format];
    onInputChange(value, color.alpha, key, v);
  };

  updateModelValue();
  useEffect(() => {
    const throttleUpdate = throttle(updateModelValue, 100);
    throttleUpdate();
    return () => throttleUpdate.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color.saturation, color.hue, color.value, color.alpha, format]);

  return (
    <div className="input-group">
      {getColorFormatInputs(format, enableAlpha).map((config) => {
        const commonProps = {
          ...inputProps,
          title: modelValueRef.current[config.key],
          [config.type === 'input' ? 'defaultValue' : 'value']: modelValueRef.current[config.key],
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
