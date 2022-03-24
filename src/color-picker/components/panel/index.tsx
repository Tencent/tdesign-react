import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import useCommonClassName from '../../../_util/useCommonClassName';
import useDefault from '../../../_util/useDefault';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import useClassname from '../../hooks/useClassname';
import PanelHeader from './header';
import Color, { getColorObject } from '../../utils/color';
import {
  DEFAULT_COLOR,
  DEFAULT_LINEAR_GRADIENT,
  TD_COLOR_USED_COLORS_MAX_SIZE,
  DEFAULT_SYSTEM_SWATCH_COLORS,
} from '../../const';
import { ColorPickerProps, TdColorModes, TdColorSaturationData } from '../../interface';
import { ColorPickerChangeTrigger, TdColorPickerProps, RecentColorsChangeTrigger } from '../../type';
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
  const colorInstanceRef = useRef<Color>(new Color(innerValue || DEFAULT_COLOR));
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
    const { rgba, update, gradientColors, linearGradient } = colorInstanceRef.current;
    if (value === 'linear-gradient') {
      update(gradientColors.length > 0 ? linearGradient : DEFAULT_LINEAR_GRADIENT);
      return;
    }
    update(rgba);
  };

  const formatValue = () => {
    // 渐变模式下直接输出css样式
    if (mode === 'linear-gradient') {
      return colorInstanceRef.current.linearGradient;
    }
    return colorInstanceRef.current.getFormatsColorMap()[format] || colorInstanceRef.current.css;
  };

  // 最近使用颜色变更时触发
  const handleRecentlyUsedColorsChange = (colors: string[], trigger?: RecentColorsChangeTrigger) => {
    setRecentlyUsedColors(colors, {
      trigger,
    });
  };

  // 添加最近使用颜色
  const addRecentlyUsedColor = (value: string, trigger?: RecentColorsChangeTrigger) => {
    if (recentlyUsedColors === null || recentlyUsedColors === false) {
      return;
    }
    const colors = (recentlyUsedColors as string[]) || [];
    const currentColor = value || colorInstanceRef.current.rgba;
    const index = colors.indexOf(currentColor);
    if (index > -1) {
      colors.splice(index, 1);
    }
    colors.unshift(currentColor);
    if (colors.length > TD_COLOR_USED_COLORS_MAX_SIZE) {
      colors.length = TD_COLOR_USED_COLORS_MAX_SIZE;
    }
    handleRecentlyUsedColorsChange(colors, trigger || 'palette-saturation-brightness');
  };

  const emitColorChange = (trigger?: ColorPickerChangeTrigger, addUsedColor?: boolean) => {
    setInnerValue(formatValue(), {
      color: getColorObject(colorInstanceRef.current),
      trigger: trigger || 'palette-saturation-brightness',
    });
    if (addUsedColor) {
      if (colorInstanceRef.current.isGradient) {
        addRecentlyUsedColor(colorInstanceRef.current.linearGradient, trigger);
      } else {
        addRecentlyUsedColor(props.enableAlpha ? colorInstanceRef.current.rgba : colorInstanceRef.current.rgb, trigger);
      }
    }
  };

  // 饱和度变化
  const handleSaturationChange = ({ saturation, value, addUsedColor }: TdColorSaturationData) => {
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
    emitColorChange(changeTrigger, addUsedColor);
  };

  // hue色相变化
  const handleHUEChange = (hue: number, addUsedColor?: boolean) => {
    colorInstanceRef.current.hue = hue;
    emitColorChange('palette-hue-bar', addUsedColor);
    onPaletteBarChange?.({
      color: getColorObject(colorInstanceRef.current),
    });
  };

  // format选择格式变化
  const handleFormatModeChange = (format: TdColorPickerProps['format']) => (formatRef.current = format);

  // format输入变化
  const handleInputChange = (input: string, alpha?: number) => {
    colorInstanceRef.current.update(input);
    colorInstanceRef.current.alpha = alpha;
    emitColorChange('input', true);
  };

  // 渲染预设颜色区域
  const SwatchesArea = React.memo(() => {
    // 最近使用颜色
    const showUsedColors =
      recentColors !== null && recentColors !== false && ((recentlyUsedColors as string[]) || [])?.length > 0;

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
    const handleSetColor = (type: 'system' | 'used', value: string) => {
      const isGradientValue = Color.isGradientColor(value);
      const color = colorInstanceRef.current;
      if (type === 'system') {
        if ((isGradientValue && mode === 'linear-gradient') || (!isGradientValue && mode === 'monochrome')) {
          // 每种模式下只能添加与模式匹配的颜色到最近使用色
          addRecentlyUsedColor(value);
        }
      }
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
        addRecentlyUsedColor(color.linearGradient);
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
              removable
              colors={recentlyUsedColors as string[]}
              onSetColor={(color: string) => handleSetColor('used', color)}
              onChange={handleRecentlyUsedColorsChange}
            />
          )}
          {showSystemColors && (
            <SwatchesPanel
              {...baseProps}
              title={t(local.swatchColorTitle)}
              colors={systemColors}
              onSetColor={(color: string) => handleSetColor('system', color)}
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
        {mode === 'linear-gradient' && <LinearGradient />}
        <SaturationPanel {...baseProps} onChange={handleSaturationChange} />
        <HUESlider {...baseProps} onChange={handleHUEChange} />
        {enableAlpha && <AlphaSlider />}
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
