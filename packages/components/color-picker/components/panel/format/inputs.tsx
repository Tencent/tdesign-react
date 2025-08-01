import React, { useRef, useEffect } from 'react';
import { throttle } from 'lodash-es';
import { Color, getColorFormatInputs, getColorFormatMap } from '@tdesign/common-js/color-picker/index';
import type { TdColorFormatProps } from '.';
import Input from '../../../../input';
import InputNumber from '../../../../input-number';

const FormatInputs = (props: TdColorFormatProps) => {
  const { format, enableAlpha, inputProps, disabled, onInputChange, color } = props;
  const modelValueRef = useRef({});
  const lastModelValue = useRef({});
  const inputKey = useRef<number>(0);

  const updateModelValue = () => {
    const value = getColorFormatMap(color, 'encode')[format];
    if (!value) return;

    if (enableAlpha) {
      // @ts-ignore
      value.a = Math.round(color.alpha * 100);
    }

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

  const handleInputChange = (key: string, v: number | string, max: number) => {
    inputKey.current = performance.now(); // 重新渲染，处理多次空值的场景

    if (v.toString().trim() === '') {
      const lastValue = lastModelValue.current[key];
      color.update(lastValue as string);
      onInputChange();
      return;
    }

    if (!v || v === lastModelValue.current[key] || Number(v) < 0 || Number(v) > max) return;
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
      color.update(v as string);
    } else {
      /* 待进一步优化：手动修改某个输入框，其它输入框的值有时会被覆盖 
         https://github.com/bgrins/TinyColor/issues/86 */
      color.update(Color.object2color(newFormatValue, format));
    }
    onInputChange();
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
        const currentValue = modelValueRef.current[config.key];
        const commonProps = {
          ...inputProps,
          disabled,
          title: currentValue,
          align: 'center' as const,
          size: 'small' as const,
          onBlur: (v: string) => handleInputChange(config.key, v, config.max),
          onEnter: (v: string) => handleInputChange(config.key, v, config.max),
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
              <Input
                {...commonProps}
                defaultValue={currentValue}
                key={`${inputKey.current}-${currentValue}`}
                maxlength={format === 'HEX' ? 9 : undefined}
              />
            ) : (
              <InputNumber
                {...commonProps}
                min={config.min}
                max={config.max}
                // @ts-ignore
                format={config.format}
                step={1}
                value={currentValue}
                onChange={(v) => handleInputChange(config.key, v || config.min, config.max)}
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
