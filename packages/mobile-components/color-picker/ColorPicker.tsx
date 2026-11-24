import React, { FC, TouchEvent, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { usePrefixClass } from '../hooks/useClass';
import { Color, Coordinate, getColorObject } from '../_common/js/color-picker';
import {
  DEFAULT_COLOR,
  SATURATION_PANEL_DEFAULT_HEIGHT,
  SATURATION_PANEL_DEFAULT_WIDTH,
  SLIDER_DEFAULT_WIDTH,
} from '../_common/js/color-picker/constants';
import { PanelRectType } from './types';
import { genSwatchList, getCoordinate, getFormatList } from './helper/format';
import type { StyledProps } from '../common';
import type { TdColorPickerProps, ColorPickerChangeTrigger } from './type';
import { colorPickerDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { ALPHA_MAX, HUE_MAX } from './constants';

export interface ColorPickerProps extends TdColorPickerProps, StyledProps {}

const ColorPicker: FC<ColorPickerProps> = (props) => {
  const { format, type, enableAlpha, swatchColors, style, value, defaultValue, fixed, onChange, onPaletteBarChange } =
    useDefaultProps(props, colorPickerDefaultProps);
  const [formatList, setFormatList] = useState<[string, Array<string | number>]>(['', []]);
  const [innerSwatchList, setInnerSwatchList] = useState([]);
  const [sliderInfo, setSliderInfo] = useState(0);
  const [panelRect, setPanelRect] = useState<PanelRectType>({
    width: SATURATION_PANEL_DEFAULT_WIDTH,
    height: SATURATION_PANEL_DEFAULT_HEIGHT,
    left: 0,
    top: 0,
  });
  const [sliderRect, setSilderRect] = useState({
    width: SLIDER_DEFAULT_WIDTH,
    left: 0,
  });
  const [saturationThumbStyle, setSaturationThumbStyle] = useState({
    top: '0',
    left: '0',
    color: '',
  });
  const [hueSliderStyle, setHueSliderStyle] = useState({
    color: '',
    left: '0%',
  });
  const [alphaSliderStyle, setAlphahueSliderStyle] = useState({
    color: '',
    left: '0%',
  });
  const resizeObserverRef = useRef<ResizeObserver>(null);
  const saturationElementRef = useRef<HTMLDivElement>(null);
  const sliderElementRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  const color = useRef<Color>(null);
  const isMultiple = type === 'multiple';
  const rootClassName = usePrefixClass('color-picker');
  const contentClassName = classNames(`${rootClassName}__body`, `${rootClassName}__body--${type}`);
  const getSliderThumbStyle = useCallback(
    ({ value, maxValue }) => {
      const { width } = sliderRect;
      if (!width) return;
      const left = Math.round((value / maxValue) * 100);
      return {
        left: `${left}%`,
        color: color.current.rgb,
      };
    },
    [sliderRect],
  );
  const getSaturationThumbStyle = useCallback(
    ({ saturation, value }) => {
      const { width, height } = panelRect;
      const top = Math.round((1 - value) * height);
      const left = Math.round(saturation * width);
      return {
        color: color.current.rgb,
        left: `${left}px`,
        top: `${top}px`,
      };
    },
    [panelRect],
  );

  const setCoreStyle = useCallback(
    (format: ColorPickerProps['format']) => {
      setSliderInfo(color.current.hue);
      setHueSliderStyle(getSliderThumbStyle({ value: color.current.hue, maxValue: HUE_MAX }));
      setAlphahueSliderStyle(getSliderThumbStyle({ value: color.current.alpha * 100, maxValue: ALPHA_MAX }));
      setSaturationThumbStyle(
        getSaturationThumbStyle({
          saturation: color.current.saturation,
          value: color.current.value,
        }),
      );
      setFormatList(getFormatList(format, color.current));
    },
    [getSaturationThumbStyle, getSliderThumbStyle],
  );

  const getEleRect = useCallback(
    (format: ColorPickerProps['format']) => {
      if (!saturationElementRef.current || !sliderElementRef.current) {
        return;
      }
      const saturationRect = saturationElementRef.current.getBoundingClientRect();
      const sliderRect = sliderElementRef.current.getBoundingClientRect();
      setPanelRect({
        width: saturationRect.width || SATURATION_PANEL_DEFAULT_WIDTH,
        height: saturationRect.height || SATURATION_PANEL_DEFAULT_HEIGHT,
        left: saturationRect.left || 0,
        top: saturationRect.top || 0,
      });
      setSilderRect({
        left: sliderRect.left || 0,
        width: sliderRect.width || SLIDER_DEFAULT_WIDTH,
      });
      setTimeout(() => {
        setCoreStyle(format);
      });
    },
    [setCoreStyle],
  );

  useEffect(() => {
    if (!saturationElementRef.current) {
      return;
    }
    resizeObserverRef.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry.contentRect.width && entry.contentRect.height) {
        getEleRect(format);
      }
    });
    resizeObserverRef.current.observe(saturationElementRef.current);
    return () => {
      resizeObserverRef.current?.disconnect?.();
    };
  }, [format, getEleRect]);

  useEffect(() => {
    function init() {
      const innerValue = value || defaultValue;
      const result = innerValue || DEFAULT_COLOR;
      color.current = new Color(result);
      color.current.update(result);
      hasInit.current = true;
      getEleRect(format);
    }

    if (hasInit.current) {
      return;
    }
    init();
  }, [value, defaultValue, format, getEleRect]);

  useEffect(() => {
    color.current = new Color(value || DEFAULT_COLOR);
  }, [value]);

  useEffect(() => {
    setCoreStyle(format);
  }, [format, setCoreStyle]);

  useEffect(() => {
    setInnerSwatchList(genSwatchList(swatchColors));
  }, [swatchColors]);

  function getSaturationAndValueByCoordinate(coordinate: Coordinate) {
    const { width, height } = panelRect;
    const { x, y } = coordinate;
    let saturation = x / width;
    let value = 1 - y / height;
    saturation = Math.min(1, Math.max(0, saturation));
    value = Math.min(1, Math.max(0, value));

    return {
      saturation,
      value,
    };
  }

  function handleSaturationDrag(e: TouchEvent) {
    const coordinate = getCoordinate(e, panelRect, fixed);
    const { saturation, value } = getSaturationAndValueByCoordinate(coordinate);
    onChangeSaturation({ saturation, value });
  }

  function handleChangeSlider({ value, isAlpha }) {
    if (isAlpha) {
      color.current.alpha = value / 100;
    } else {
      color.current.hue = value;
    }
    emitColorChange(isAlpha ? 'palette-alpha-bar' : 'palette-hue-bar');
    setCoreStyle(format);
  }

  function handleSliderDrag(e: TouchEvent, isAlpha = false) {
    const { width } = sliderRect;
    const coordinate = getCoordinate(e, sliderRect);
    const { x } = coordinate;
    const maxValue = isAlpha ? ALPHA_MAX : HUE_MAX;

    const value = Math.min(maxValue, Math.max(0, Math.round((x / width) * maxValue * 100) / 100));
    handleChangeSlider({ value, isAlpha });
  }

  function onChangeSaturation({ saturation, value }) {
    const { saturation: sat, value: val } = color.current;
    if (value !== val && saturation !== sat) {
      color.current.saturation = saturation;
      color.current.value = value;
    } else if (saturation !== sat) {
      color.current.saturation = saturation;
    } else if (value !== val) {
      color.current.value = value;
    } else {
      return;
    }
    onPaletteBarChange?.({
      color: getColorObject(color.current),
    });
    setCoreStyle(format);
  }

  function handleDiffDrag(dragType: string, e: TouchEvent) {
    switch (dragType) {
      case 'saturation':
        handleSaturationDrag(e);
        break;
      case 'hue-slider':
        handleSliderDrag(e);
        break;
      case 'alpha-slider':
        handleSliderDrag(e, true);
        break;
    }
  }

  function formatValue() {
    return color.current.getFormatsColorMap()[format] || color.current.css;
  }

  function emitColorChange(trigger: ColorPickerChangeTrigger) {
    const value = formatValue();
    onChange?.(value, {
      trigger,
      color: getColorObject(color.current),
    });
  }

  const onTouchStart = (e: TouchEvent, dragType: string) => {
    handleDiffDrag(dragType, e);
  };
  const onTouchMove = (e: TouchEvent, dragType: string) => {
    handleDiffDrag(dragType, e);
  };

  const onTouchEnd = (e: TouchEvent, dragType: string) => {
    setTimeout(() => {
      handleDiffDrag(dragType, e);
    });
  };

  const handleSwatchClicked = (swatch: string) => {
    color.current.update(swatch);
    setCoreStyle(format);
    emitColorChange('preset');
  };

  const renderPicker = () => {
    const renderAlphaContent = () => (
      <div className={classNames(`${rootClassName}__slider-wrapper`, `${rootClassName}__slider-wrapper--alpha-type`)}>
        <div
          className={`${rootClassName}__slider-padding`}
          style={{
            background: `linear-gradient(90deg, rgba(0,0,0,.0) 0%, rgba(0,0,0,.0) 93%, ${alphaSliderStyle.color} 93%, ${alphaSliderStyle.color} 100%`,
          }}
        />
        <div
          className={`${rootClassName}__slider`}
          onTouchStart={(e) => onTouchStart(e, 'alpha-slider')}
          onTouchMove={(e) => onTouchMove(e, 'alpha-slider')}
          onTouchEnd={(e) => onTouchEnd(e, 'alpha-slider')}
        >
          <div
            className={`${rootClassName}__rail`}
            style={{ background: `linear-gradient(to right, rgba(0, 0, 0, 0), ${alphaSliderStyle.color}` }}
          />
          <div className={`${rootClassName}__thumb`} style={{ ...alphaSliderStyle }} />
        </div>
      </div>
    );

    const renderMultipleContent = () => (
      <>
        <div
          className={`${rootClassName}__saturation`}
          ref={saturationElementRef}
          style={{ background: `hsl(${sliderInfo}, 100%, 50%)` }}
          onTouchStart={(e) => onTouchStart(e, 'saturation')}
          onTouchMove={(e) => onTouchMove(e, 'saturation')}
          onTouchEnd={(e) => onTouchEnd(e, 'saturation')}
        >
          <div
            className={`${rootClassName}__thumb`}
            style={
              saturationThumbStyle.color
                ? {
                    top: `${saturationThumbStyle.top}`,
                    left: `${saturationThumbStyle.left}`,
                    color: `${saturationThumbStyle.color}`,
                  }
                : { top: `${saturationThumbStyle.top}`, left: `${saturationThumbStyle.left}` }
            }
          />
        </div>
        <div className={`${rootClassName}__sliders-wrapper`}>
          <div className={`${rootClassName}__sliders`}>
            <div
              className={classNames(`${rootClassName}__slider-wrapper`, `${rootClassName}__slider-wrapper--hue-type`)}
            >
              <div
                className={`${rootClassName}__slider`}
                ref={sliderElementRef}
                onTouchStart={(e) => onTouchStart(e, 'hue-slider')}
                onTouchMove={(e) => onTouchMove(e, 'hue-slider')}
                onTouchEnd={(e) => onTouchEnd(e, 'hue-slider')}
              >
                <div className={`${rootClassName}__rail`} />
                <div
                  className={`${rootClassName}__thumb`}
                  style={{ color: hueSliderStyle.color, left: hueSliderStyle.left }}
                />
              </div>
            </div>
            {enableAlpha ? renderAlphaContent() : null}
          </div>
        </div>
        <div className={`${rootClassName}__format`}>
          <div className={classNames(`${rootClassName}__format-item`, `${rootClassName}__format-item--first`)}>
            {formatList[0]}
          </div>
          <div className={classNames(`${rootClassName}__format-item`, `${rootClassName}__format-item--second`)}>
            <div className={`${rootClassName}__format-inputs`}>
              {formatList[1]?.map((item, index) => (
                <div
                  key={index}
                  className={classNames(
                    `${rootClassName}__format-input`,
                    `${rootClassName}__format-input--${index === formatList.length - 1 && formatList.length === 2 ? 'fixed' : 'base'}`,
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );

    const renderInnerSwatchList = () => (
      <div className={`${rootClassName}__swatches-wrap`}>
        <div className={`${rootClassName}__swatches`}>
          {isMultiple ? <div className={`${rootClassName}__swatches-title`}>系统预设色彩</div> : null}
          <div className={`${rootClassName}__swatches-items`}>
            {innerSwatchList.map((swatch) => (
              <div
                key={swatch}
                className={`${rootClassName}__swatches-item`}
                onClick={() => handleSwatchClicked(swatch)}
              >
                <div className={`${rootClassName}__swatches-inner`} style={{ backgroundColor: swatch }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const renderColorPicker = () => (
      <div className={`${rootClassName}__panel`} style={style}>
        <div className={contentClassName}>
          <>
            {isMultiple ? renderMultipleContent() : null}
            {innerSwatchList.length ? renderInnerSwatchList() : null}
          </>
        </div>
      </div>
    );

    return renderColorPicker();
  };

  return renderPicker();
};

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
