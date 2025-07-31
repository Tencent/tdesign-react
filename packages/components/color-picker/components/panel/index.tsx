import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  Color,
  DEFAULT_COLOR,
  DEFAULT_LINEAR_GRADIENT,
  DEFAULT_SYSTEM_SWATCH_COLORS,
  getColorObject,
  GradientColorPoint,
  initColorFormat,
  TD_COLOR_USED_COLORS_MAX_SIZE,
  type ColorFormat,
} from '@tdesign/common-js/color-picker/index';
import useCommonClassName from '../../../hooks/useCommonClassName';
import useControlled from '../../../hooks/useControlled';
import useDefaultProps from '../../../hooks/useDefaultProps';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import { colorPickerDefaultProps } from '../../defaultProps';
import useClassName from '../../hooks/useClassNames';
import type { ColorPickerProps, TdColorModes, TdColorSaturationData } from '../../interface';
import type { ColorPickerChangeTrigger } from '../../type';
import AlphaSlider from './alpha';
import FormatPanel from './format';
import PanelHeader from './header';
import HueSlider from './hue';
import LinearGradient from './linear-gradient';
import SaturationPanel from './saturation';
import SwatchesPanel from './swatches';

const Panel = forwardRef<HTMLDivElement, ColorPickerProps>((props, ref) => {
  const baseClassName = useClassName();
  const { STATUS } = useCommonClassName();
  const [local, t] = useLocaleReceiver('colorPicker');
  const {
    className,
    colorModes,
    defaultRecentColors,
    disabled,
    enableAlpha,
    enableMultipleGradient,
    format,
    style,
    swatchColors,
    showPrimaryColorPreview,
    onChange,
    onPaletteBarChange,
    onRecentColorsChange,
  } = useDefaultProps(props, colorPickerDefaultProps);
  const [innerValue, setInnerValue] = useControlled(props, 'value', onChange);

  const [, setUpdateId] = useState(0); // 确保 UI 同步更新

  const getModeByColor = (input: string) => {
    if (colorModes.length === 1) return colorModes[0];
    return colorModes.includes('linear-gradient') && Color.isGradientColor(input) ? 'linear-gradient' : 'monochrome';
  };
  const [mode, setMode] = useState<TdColorModes>(() => getModeByColor(innerValue));

  const isGradient = mode === 'linear-gradient';
  const defaultEmptyColor = isGradient ? DEFAULT_LINEAR_GRADIENT : DEFAULT_COLOR;

  const [recentlyUsedColors, setRecentlyUsedColors] = useControlled(props, 'recentColors', onRecentColorsChange, {
    defaultRecentColors,
  });
  const colorInstanceRef = useRef<Color>(new Color(innerValue || defaultEmptyColor));
  const formatRef = useRef<ColorFormat>(initColorFormat(format, enableAlpha));

  const baseProps = {
    color: colorInstanceRef.current,
    disabled,
    baseClassName,
  };

  const updateColor = (value: string) => {
    colorInstanceRef.current.update(value);
    setUpdateId(performance.now());
  };

  const emitColorChange = useCallback(
    (trigger?: ColorPickerChangeTrigger) => {
      const value = colorInstanceRef.current.getFormattedColor(formatRef.current, enableAlpha);
      setInnerValue(value, {
        color: getColorObject(colorInstanceRef.current),
        trigger: trigger || 'palette-saturation-brightness',
      });
      setUpdateId(performance.now());
    },
    [enableAlpha, setInnerValue],
  );

  useEffect(() => {
    const currentColor = colorInstanceRef.current.getFormattedColor(formatRef.current, enableAlpha);
    if (innerValue === currentColor) return;
    // 根据颜色自动切换模式
    const newMode = getModeByColor(innerValue);
    setMode(newMode);
    colorInstanceRef.current.isGradient = newMode === 'linear-gradient';
    updateColor(innerValue);
  }, [innerValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleModeChange = (newMode: TdColorModes) => {
    setMode(newMode);

    const isGradientMode = newMode === 'linear-gradient';
    colorInstanceRef.current.isGradient = isGradientMode;

    const { rgba, gradientColors, linearGradient } = colorInstanceRef.current;
    if (isGradientMode) {
      updateColor(gradientColors.length > 0 ? linearGradient : DEFAULT_LINEAR_GRADIENT);
    } else {
      updateColor(rgba);
    }
    emitColorChange();
  };

  /**
   * 最近使用颜色变化
   */
  const handleRecentlyUsedColorsChange = (colors: string[]) => {
    setRecentlyUsedColors(colors);
  };

  const addRecentlyUsedColor = () => {
    const colors = [...((recentlyUsedColors as string[]) || [])];
    const { isGradient, linearGradient, rgba } = colorInstanceRef.current;
    const currentColor = isGradient ? linearGradient : rgba;
    const index = colors.indexOf(currentColor);
    if (index > -1) {
      colors.splice(index, 1);
    }
    colors.unshift(currentColor);
    if (colors.length > TD_COLOR_USED_COLORS_MAX_SIZE) {
      colors.length = TD_COLOR_USED_COLORS_MAX_SIZE;
    }
    handleRecentlyUsedColorsChange(colors);
  };

  /**
   * 饱和度亮度变化
   */
  const handleSatAndValueChange = ({ saturation, value }: TdColorSaturationData) => {
    const { saturation: sat, value: val } = colorInstanceRef.current;
    let changeTrigger: ColorPickerChangeTrigger = 'palette-saturation-brightness';
    if (value !== val && saturation !== sat) {
      changeTrigger = 'palette-saturation-brightness';
      colorInstanceRef.current.saturation = saturation;
      colorInstanceRef.current.value = value;
    } else if (saturation !== sat) {
      changeTrigger = 'palette-saturation';
      colorInstanceRef.current.saturation = saturation;
    } else if (value !== val) {
      changeTrigger = 'palette-brightness';
      colorInstanceRef.current.value = value;
    } else {
      return;
    }

    emitColorChange(changeTrigger);
  };

  /**
   * 色相变化
   */
  const handleHueChange = (hue: number) => {
    colorInstanceRef.current.hue = hue;
    emitColorChange('palette-hue-bar');
    onPaletteBarChange?.({
      color: getColorObject(colorInstanceRef.current),
    });
  };

  /**
   * 透明度变化
   */
  const handleAlphaChange = (alpha: number) => {
    colorInstanceRef.current.alpha = alpha;
    emitColorChange('palette-alpha-bar');
    onPaletteBarChange?.({
      color: getColorObject(colorInstanceRef.current),
    });
  };

  /**
   * 渐变变化
   */
  const handleGradientChange = ({
    key,
    payload,
  }: {
    key: 'degree' | 'selectedId' | 'colors';
    payload: number | string | GradientColorPoint[];
    addUsedColor?: boolean;
  }) => {
    let trigger: ColorPickerChangeTrigger = 'palette-saturation-brightness';
    switch (key) {
      case 'degree':
        colorInstanceRef.current.gradientDegree = payload as number;
        trigger = 'input';
        break;
      case 'selectedId':
        colorInstanceRef.current.gradientSelectedId = payload as string;
        break;
      case 'colors':
        colorInstanceRef.current.gradientColors = payload as GradientColorPoint[];
        break;
    }
    emitColorChange(trigger);
  };

  /**
   * 输入值变化
   */
  const handleInputChange = () => {
    emitColorChange('input');
  };

  const SwatchesArea = React.memo(() => {
    // 只支持渐变模式
    const onlySupportGradient = colorModes.length === 1 && colorModes.includes('linear-gradient');

    // 最近使用颜色
    let recentColors = recentlyUsedColors;
    if (onlySupportGradient && Array.isArray(recentColors)) {
      recentColors = recentColors.filter((color) => Color.isGradientColor(color));
    }
    const showUsedColors = Array.isArray(recentColors) || recentColors === true;

    // 系统预设颜色
    let systemColors = swatchColors;
    if (systemColors === undefined) {
      systemColors = [...DEFAULT_SYSTEM_SWATCH_COLORS];
    }
    if (onlySupportGradient) {
      systemColors = systemColors?.filter((color) => Color.isGradientColor(color));
    }
    const showSystemColors = Array.isArray(systemColors);

    // 色块点击
    const handleSetColor = (value: string, trigger: ColorPickerChangeTrigger) => {
      const newMode = getModeByColor(value);
      setMode(newMode);
      // 确保在渐变模式下选择纯色块，能切换回单色模式
      colorInstanceRef.current.isGradient = newMode === 'linear-gradient';
      updateColor(value);
      emitColorChange(trigger);
    };

    if (!showSystemColors && !showUsedColors) return null;

    return (
      <>
        <div className={`${baseClassName}__swatches-wrap`}>
          {showUsedColors && (
            <SwatchesPanel
              {...baseProps}
              title={t(local.recentColorTitle)}
              editable
              handleAddColor={addRecentlyUsedColor}
              colors={recentColors as string[]}
              onSetColor={(color: string) => handleSetColor(color, 'recent')}
              onChange={handleRecentlyUsedColorsChange}
            />
          )}
          {showSystemColors && (
            <SwatchesPanel
              {...baseProps}
              title={t(local.swatchColorTitle)}
              colors={systemColors}
              onSetColor={(color: string) => handleSetColor(color, 'preset')}
            />
          )}
        </div>
      </>
    );
  });

  return (
    <div
      className={classNames(`${baseClassName}__panel`, disabled ? STATUS.disabled : false, className)}
      onClick={(e) => e.stopPropagation()}
      style={{ ...style }}
      ref={ref}
    >
      <PanelHeader baseClassName={baseClassName} mode={mode} colorModes={colorModes} onModeChange={handleModeChange} />
      <div className={`${baseClassName}__body`}>
        {isGradient && (
          <LinearGradient
            {...baseProps}
            enableMultipleGradient={enableMultipleGradient}
            onChange={handleGradientChange}
          />
        )}
        <SaturationPanel {...baseProps} onChange={handleSatAndValueChange} />
        <div className={`${baseClassName}__sliders-wrapper`}>
          <div className={`${baseClassName}__sliders`}>
            <HueSlider {...baseProps} onChange={handleHueChange} />
            {enableAlpha && <AlphaSlider {...baseProps} onChange={handleAlphaChange} />}
          </div>
          {showPrimaryColorPreview ? (
            <div className={classNames([`${baseClassName}__sliders-preview`, `${baseClassName}--bg-alpha`])}>
              <span
                className={`${baseClassName}__sliders-preview-inner`}
                style={{
                  background: isGradient ? colorInstanceRef.current.linearGradient : colorInstanceRef.current.rgba,
                }}
              />
            </div>
          ) : null}
        </div>

        <FormatPanel {...props} {...baseProps} format={formatRef.current} onInputChange={handleInputChange} />
        <SwatchesArea />
      </div>
    </div>
  );
});

export default React.memo(Panel);
