import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import useCommonClassName from '../../../_util/useCommonClassName';
import useDefault from '../../../_util/useDefault';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import useClassname from '../../hooks/useClassname';
import PanelHeader from './header';
import Color, { getColorObject } from '../../../_common/js/color-picker/color';
import { GradientColorPoint } from '../../../_common/js/color-picker/gradient';
import {
  DEFAULT_COLOR,
  DEFAULT_LINEAR_GRADIENT,
  TD_COLOR_USED_COLORS_MAX_SIZE,
  DEFAULT_SYSTEM_SWATCH_COLORS,
} from '../../const';
import { ColorPickerProps, TdColorModes, TdColorSaturationData } from '../../interface';
import { ColorPickerChangeTrigger, TdColorPickerProps } from '../../type';
import LinearGradient from './linear-gradient';
import SaturationPanel from './saturation';
import HUESlider from './hue';
import AlphaSlider from './alpha';
import FormatPanel from './format';
import SwatchesPanel from './swatches';

const Panel = (props: ColorPickerProps) => {
  const baseClassName = useClassname();
  const { STATUS } = useCommonClassName();
  const [local, t] = useLocaleReceiver('colorPicker');
  const {
    disabled,
    value,
    defaultValue,
    onChange,
    enableAlpha = false,
    format,
    onPaletteBarChange,
    swatchColors,
  } = props;
  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);
  const colorInstanceRef = useRef<Color>(new Color(defaultValue || DEFAULT_COLOR));

  useEffect(() => {
    colorInstanceRef.current.update(defaultValue || DEFAULT_COLOR);
  }, [defaultValue]);

  useEffect(() => {
    colorInstanceRef.current.update(innerValue || DEFAULT_COLOR);
  }, [innerValue]);

  const [mode, setMode] = useState<TdColorModes>(
    colorInstanceRef.current.isGradient ? 'linear-gradient' : 'monochrome',
  );
  const formatRef = useRef<TdColorPickerProps['format']>(colorInstanceRef.current.isGradient ? 'CSS' : 'RGB');

  const { recentColors, defaultRecentColors, onRecentColorsChange } = props;
  const [recentlyUsedColors, setRecentlyUsedColors] = useDefault(
    recentColors,
    defaultRecentColors,
    onRecentColorsChange,
  );

  const baseProps = {
    color: colorInstanceRef.current,
    disabled,
    baseClassName,
  };

  const handleModeChange = (value: TdColorModes) => {
    setMode(value);
    const { rgba, gradientColors, linearGradient } = colorInstanceRef.current;
    if (value === 'linear-gradient') {
      colorInstanceRef.current = new Color(gradientColors.length > 0 ? linearGradient : DEFAULT_LINEAR_GRADIENT);
      return;
    }
    colorInstanceRef.current = new Color(rgba);
  };

  const formatValue = () => {
    // 渐变模式下直接输出css样式
    if (mode === 'linear-gradient') {
      return colorInstanceRef.current.linearGradient;
    }

    return colorInstanceRef.current.getFormatsColorMap()[format] || colorInstanceRef.current.css;
  };

  // 最近使用颜色变更时触发
  const handleRecentlyUsedColorsChange = (colors: string[]) => {
    setRecentlyUsedColors(colors);
  };

  // 添加最近使用颜色
  const addRecentlyUsedColor = () => {
    if (recentlyUsedColors === null || recentlyUsedColors === false) {
      return;
    }
    const colors = (recentlyUsedColors as string[]) || [];
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

  const emitColorChange = (trigger?: ColorPickerChangeTrigger) => {
    setInnerValue(formatValue(), {
      color: getColorObject(colorInstanceRef.current),
      trigger: trigger || 'palette-saturation-brightness',
    });
  };

  // 饱和度变化
  const handleSaturationChange = ({ saturation, value }: TdColorSaturationData) => {
    const colorInstance = colorInstanceRef.current;
    const { saturation: sat, value: val } = colorInstance;
    let changeTrigger: ColorPickerChangeTrigger = 'palette-saturation-brightness';
    if (value !== val && saturation !== sat) {
      colorInstance.saturation = saturation;
      colorInstance.value = value;
      changeTrigger = 'palette-saturation-brightness';
    } else if (saturation !== sat) {
      colorInstance.saturation = saturation;
      changeTrigger = 'palette-saturation';
    } else if (value !== val) {
      colorInstance.value = value;
      changeTrigger = 'palette-brightness';
    } else {
      return;
    }
    emitColorChange(changeTrigger);
  };

  // hue色相变化
  const handleHUEChange = (hue: number) => {
    colorInstanceRef.current.hue = hue;
    emitColorChange('palette-hue-bar');
    onPaletteBarChange?.({
      color: getColorObject(colorInstanceRef.current),
    });
  };

  /**
   * 透明度变化
   * @param alpha
   */
  const handleAlphaChange = (alpha: number) => {
    colorInstanceRef.current.alpha = alpha;
    emitColorChange('palette-alpha-bar');
    onPaletteBarChange?.({
      color: getColorObject(colorInstanceRef.current),
    });
  };

  /**
   * 渐变改变
   * @param param0
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

  // format选择格式变化
  const handleFormatModeChange = (format: TdColorPickerProps['format']) => (formatRef.current = format);

  // format输入变化
  const handleInputChange = (input: string, alpha?: number) => {
    colorInstanceRef.current.update(input);
    colorInstanceRef.current.alpha = alpha;
    emitColorChange('input');
  };

  // 渲染预设颜色区域
  const SwatchesArea = React.memo(() => {
    // 最近使用颜色
    const showUsedColors = recentColors !== null && recentColors !== false;
    // 系统颜色
    let systemColors = swatchColors;
    if (systemColors === undefined) {
      systemColors = [...DEFAULT_SYSTEM_SWATCH_COLORS];
    }
    const showSystemColors = systemColors?.length > 0;

    if (!showSystemColors && !showUsedColors) {
      return null;
    }

    // 色块点击
    const handleSetColor = (value: string) => {
      const isGradientValue = Color.isGradientColor(value);
      const color = colorInstanceRef.current;
      if (isGradientValue) {
        if (props.colorModes.includes('linear-gradient')) {
          setMode('linear-gradient');
          color.update(value);
          color.updateCurrentGradientColor();
        } else {
          console.warn('该模式不支持渐变色');
        }
      } else if (mode === 'linear-gradient') {
        color.updateStates(value);
        color.updateCurrentGradientColor();
      } else {
        color.update(value);
      }
      emitColorChange();
    };

    return (
      <>
        <div className={`${baseClassName}__swatches-wrap`}>
          {showUsedColors && (
            <SwatchesPanel
              {...baseProps}
              title={t(local.recentColorTitle)}
              editable
              handleAddColor={addRecentlyUsedColor}
              colors={recentlyUsedColors as string[]}
              onSetColor={(color: string) => handleSetColor(color)}
              onChange={handleRecentlyUsedColorsChange}
            />
          )}
          {showSystemColors && (
            <SwatchesPanel
              {...baseProps}
              title={t(local.swatchColorTitle)}
              colors={systemColors}
              onSetColor={(color: string) => handleSetColor(color)}
            />
          )}
        </div>
      </>
    );
  });

  return (
    <div
      className={classNames(`${baseClassName}__panel`, disabled ? STATUS.disabled : false)}
      onClick={(e) => e.stopPropagation()}
    >
      <PanelHeader {...props} baseClassName={baseClassName} mode={mode} onModeChange={handleModeChange} />
      <div className={`${baseClassName}__body`}>
        {mode === 'linear-gradient' && <LinearGradient {...baseProps} onChange={handleGradientChange} />}
        <SaturationPanel {...baseProps} onChange={handleSaturationChange} />
        <HUESlider {...baseProps} onChange={handleHUEChange} />
        {enableAlpha && <AlphaSlider {...baseProps} onChange={handleAlphaChange} />}
        <FormatPanel
          {...props}
          {...baseProps}
          format={formatRef.current}
          onModeChange={handleFormatModeChange}
          onInputChange={handleInputChange}
        />
        <SwatchesArea />
      </div>
    </div>
  );
};

export default React.memo(Panel);
