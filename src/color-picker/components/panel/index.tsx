import React, { useEffect, useRef, useState, forwardRef, MutableRefObject, useCallback } from 'react';
import classNames from 'classnames';
import tinyColor from 'tinycolor2';

import useCommonClassName from '../../../_util/useCommonClassName';
import useControlled from '../../../hooks/useControlled';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import useClassName from '../../hooks/useClassNames';
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
import { colorPickerDefaultProps } from '../../defaultProps';
import LinearGradient from './linear-gradient';
import SaturationPanel from './saturation';
import HUESlider from './hue';
import AlphaSlider from './alpha';
import FormatPanel from './format';
import SwatchesPanel from './swatches';

const mathRound = Math.round;

const Panel = forwardRef((props: ColorPickerProps, ref: MutableRefObject<HTMLDivElement>) => {
  const baseClassName = useClassName();
  const { STATUS } = useCommonClassName();
  const [local, t] = useLocaleReceiver('colorPicker');
  const {
    value,
    disabled,
    onChange,
    enableAlpha = false,
    format,
    onPaletteBarChange,
    swatchColors,
    className,
    style = {},
    togglePopup,
    closeBtn,
    colorModes = ['linear-gradient', 'monochrome'],
    showPrimaryColorPreview = true,
  } = props;
  const [innerValue, setInnerValue] = useControlled(props, 'value', onChange);
  const colorInstanceRef = useRef<Color>(new Color(innerValue || DEFAULT_COLOR));
  const getmodeByColor = colorInstanceRef.current.isGradient ? 'linear-gradient' : 'monochrome';
  const [mode, setMode] = useState<TdColorModes>(colorModes?.length === 1 ? colorModes[0] : getmodeByColor);
  const [updateId, setUpdateId] = useState(0);
  const update = useCallback(
    (value) => {
      colorInstanceRef.current.update(value);
      setUpdateId(updateId + 1);
    },
    [updateId],
  );

  const formatValue = useCallback(() => {
    // 渐变模式下直接输出css样式
    if (mode === 'linear-gradient') {
      return colorInstanceRef.current.linearGradient;
    }

    return colorInstanceRef.current.getFormatsColorMap()[format] || colorInstanceRef.current.css;
  }, [format, mode]);

  const emitColorChange = useCallback(
    (trigger?: ColorPickerChangeTrigger) => {
      setInnerValue(formatValue(), {
        color: getColorObject(colorInstanceRef.current),
        trigger: trigger || 'palette-saturation-brightness',
      });
    },
    [formatValue, setInnerValue],
  );

  useEffect(() => {
    if (typeof value === 'undefined' || mode === 'linear-gradient') {
      return;
    }

    // common Color new 的时候使用 hsv ，一个 rgba 可以对应两个 hsv ，这里先直接用 tinycolor 比较下颜色是否修改了
    const newUniqColor = tinyColor(value).toRgb();
    const { r, g, b, a } = newUniqColor;
    const newUniqRgbaColor = `rgba(${mathRound(r)}, ${mathRound(g)}, ${mathRound(b)}, ${a})`;

    const newColor = new Color(value);
    const formattedColor = newUniqRgbaColor || DEFAULT_COLOR;
    const currentColor = colorInstanceRef.current.rgba;

    const isInRightMode = mode === 'monochrome' && !newColor.isGradient;

    if (formattedColor !== currentColor && isInRightMode) {
      update(value);
      setMode(newColor.isGradient ? 'linear-gradient' : 'monochrome');
    }
  }, [value, formatValue, setInnerValue, mode, update]);

  useEffect(() => {
    if (colorModes.length === 1) {
      setMode(colorModes[0]);
    } else {
      setMode(getmodeByColor);
    }
  }, [colorModes, getmodeByColor]);

  const formatRef = useRef<TdColorPickerProps['format']>(colorInstanceRef.current.isGradient ? 'CSS' : 'RGB');

  const { onRecentColorsChange } = props;
  const [recentlyUsedColors, setRecentlyUsedColors] = useControlled(props, 'recentColors', onRecentColorsChange, {
    defaultRecentColors: colorPickerDefaultProps.recentColors,
  });

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
  // 最近使用颜色变更时触发
  const handleRecentlyUsedColorsChange = (colors: string[]) => {
    setRecentlyUsedColors(colors);
  };

  // 添加最近使用颜色
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

  // 饱和度变化
  const handleSaturationChange = ({ saturation, value }: TdColorSaturationData) => {
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
        setUpdateId((prevId) => prevId + 1);
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
    update(input);
    colorInstanceRef.current.alpha = alpha;
    emitColorChange('input');
  };

  // 渲染预设颜色区域
  const SwatchesArea = React.memo(() => {
    // 最近使用颜色
    const showUsedColors = recentlyUsedColors !== null && recentlyUsedColors !== false;
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
    const handleSetColor = (value: string, trigger: ColorPickerChangeTrigger) => {
      const isGradientValue = Color.isGradientColor(value);
      const color = colorInstanceRef.current;
      if (isGradientValue) {
        if (colorModes.includes('linear-gradient')) {
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
      emitColorChange(trigger);
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

  const isGradient = mode === 'linear-gradient';

  return (
    <div
      className={classNames(`${baseClassName}__panel`, disabled ? STATUS.disabled : false, className)}
      onClick={(e) => e.stopPropagation()}
      style={{ ...style }}
      ref={ref}
    >
      <PanelHeader
        baseClassName={baseClassName}
        mode={mode}
        colorModes={colorModes}
        closeBtn={closeBtn}
        togglePopup={togglePopup}
        onModeChange={handleModeChange}
      />
      <div className={`${baseClassName}__body`}>
        {isGradient && <LinearGradient {...baseProps} onChange={handleGradientChange} />}
        <SaturationPanel {...baseProps} onChange={handleSaturationChange} />
        <div className={`${baseClassName}__sliders-wrapper`}>
          <div className={`${baseClassName}__sliders`}>
            <HUESlider {...baseProps} onChange={handleHUEChange} />
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
});

export default React.memo(Panel);
