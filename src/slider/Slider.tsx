import React, { forwardRef, useMemo, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { TdSliderProps } from './type';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import { numberToPercent } from './utils/handleNumber';
import { StyledProps, TNode } from '../common';
import InputNumber from '../input-number/InputNumber';
import SliderHandleButton from './SliderHandleButton';
import { accAdd } from '../_util/number';
import { sliderDefaultProps } from './defaultProps';

export type SliderProps = TdSliderProps & StyledProps;

const LEFT_NODE = 0;
const RIGHT_NODE = 1;
type SliderHandleNode = typeof LEFT_NODE | typeof RIGHT_NODE;

const Slider = forwardRef((props: SliderProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { disabled, inputNumberProps, label, layout, marks, max, min, range, step, tooltipProps, className, style } =
    props;

  const sliderRef = useRef<HTMLDivElement>();
  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const isVertical = layout === 'vertical';

  const renderValue = Array.isArray(value) ? value : [min, value];
  const start = (renderValue[LEFT_NODE] - min) / (max - min);
  const width = (renderValue[RIGHT_NODE] - renderValue[LEFT_NODE]) / (max - min);
  const end = start + width;

  const dots: { value: number; label: TNode; position: number }[] = useMemo(() => {
    // 当 marks 为数字数组
    if (Array.isArray(marks)) {
      if (marks.some((mark) => typeof mark !== 'number')) {
        console.warn('The props "marks" only support number!');
        return [];
      }
      return marks.map((mark) => ({
        value: mark,
        position: (mark - min) / (max - min),
        label: mark,
      }));
    }
    // 当 marks 为对象
    if (marks && typeof marks === 'object') {
      const result = [];
      Object.keys(marks).forEach((key) => {
        const numberKey = Number(key);
        if (typeof numberKey !== 'number') {
          console.warn('The props "marks" key only support number!');
        } else {
          result.push({
            value: numberKey,
            label: marks[numberKey],
            position: (numberKey - min) / (max - min),
          });
        }
      });
      return result;
    }
    return [];
  }, [max, min, marks]);

  const allDots = useMemo(() => {
    // 默认
    const result = [];
    for (let i = min; i <= max; i = accAdd(i, step)) {
      result.push({
        value: i,
        position: (i - min) / (max - min),
      });
    }
    return result;
  }, [max, min, step]);

  const startDirection = isVertical ? 'bottom' : 'left';
  const stepDirection = isVertical ? 'top' : 'left';
  const sizeKey = isVertical ? 'height' : 'width';
  const renderDots = isVertical ? dots.map((item) => ({ ...item, position: 1 - item.position })) : dots;

  const handleInputChange = (newValue: number, nodeIndex: SliderHandleNode) => {
    const safeValue = Number(newValue.toFixed(32));
    let resultValue = Math.max(Math.min(max, safeValue), min);
    // 判断是否出现左值大于右值
    if (nodeIndex === LEFT_NODE && value && safeValue > value[RIGHT_NODE]) resultValue = value[RIGHT_NODE];
    // 判断是否出现右值大于左值
    if (nodeIndex === RIGHT_NODE && value && safeValue < value[LEFT_NODE]) resultValue = value[LEFT_NODE];
    if (Array.isArray(value)) {
      const arrValue = value.slice();
      arrValue[nodeIndex] = resultValue;
      onChange(arrValue);
    } else {
      onChange(resultValue);
    }
  };

  const createInput = (nodeIndex: SliderHandleNode) => {
    const inputProps = typeof inputNumberProps === 'object' ? inputNumberProps : {};
    const currentValue = renderValue[nodeIndex];

    return (
      <InputNumber
        value={currentValue}
        onChange={(v: number) => {
          if (typeof v !== 'undefined') {
            handleInputChange(Number(v), nodeIndex);
          }
        }}
        className={classNames(`${classPrefix}-slider-input`, {
          'is-vertical': isVertical,
        })}
        disabled={disabled}
        {...inputProps}
        theme="column"
      />
    );
  };

  const nearbyValueChange = (value: number) => {
    const buttonBias =
      Math.abs(value - renderValue[LEFT_NODE]) > Math.abs(value - renderValue[RIGHT_NODE]) ? RIGHT_NODE : LEFT_NODE;
    handleInputChange(value, buttonBias);
  };

  const setPosition = (position: number, nodeIndex?: SliderHandleNode) => {
    let index = 0;
    let minDistance = 1;
    for (let i = 0; i < allDots.length; i++) {
      const diff = Math.abs(allDots[i].position - position);
      if (minDistance > diff) {
        index = i;
        minDistance = diff;
      }
    }
    const { value } = allDots[index];
    if (nodeIndex === undefined && range) {
      nearbyValueChange(value);
    } else {
      handleInputChange(value, nodeIndex);
    }
  };

  const onSliderChange = (event: React.MouseEvent | MouseEvent, nodeIndex?: SliderHandleNode) => {
    if (disabled) return;
    const clientKey = isVertical ? 'clientY' : 'clientX';
    const sliderPositionInfo = sliderRef.current.getBoundingClientRect();
    const sliderOffset = sliderPositionInfo[startDirection];
    const position = ((event[clientKey] - sliderOffset) / sliderPositionInfo[sizeKey]) * (isVertical ? -1 : 1);
    setPosition(position, nodeIndex);
  };

  const handleClickMarks = (event: React.MouseEvent, value: number) => {
    event.stopPropagation();
    nearbyValueChange(value);
  };

  const createHandleButton = (nodeIndex: SliderHandleNode, style: React.CSSProperties) => {
    const currentValue = renderValue[nodeIndex];
    // 模板替换
    let tipLabel: React.ReactNode = currentValue;
    if (isFunction(label))
      tipLabel = label({ value: currentValue, position: nodeIndex === LEFT_NODE ? 'start' : 'end' });
    if (isString(label)) tipLabel = label.replace(/\$\{value\}/g, currentValue.toString());

    return (
      <SliderHandleButton
        toolTipProps={{
          content: tipLabel,
          ...tooltipProps,
        }}
        hideTips={label === false}
        classPrefix={classPrefix}
        style={style}
        onChange={(e) => onSliderChange(e, nodeIndex)}
      />
    );
  };

  return (
    <div
      style={{ ...style }}
      className={classNames(`${classPrefix}-slider__container`, {
        'is-vertical': isVertical,
      })}
      ref={ref}
    >
      <div
        ref={sliderRef}
        className={classNames(`${classPrefix}-slider`, className, {
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-slider--vertical`]: isVertical,
          [`${classPrefix}-slider--with-input`]: inputNumberProps,
        })}
        onClick={onSliderChange}
      >
        <div className={classNames(`${classPrefix}-slider__rail`)}>
          <div
            style={{ [startDirection]: numberToPercent(start), [sizeKey]: numberToPercent(width) }}
            className={classNames(`${classPrefix}-slider__track`)}
          ></div>
          {range ? createHandleButton(LEFT_NODE, { [startDirection]: numberToPercent(start) }) : null}
          {createHandleButton(RIGHT_NODE, { [startDirection]: numberToPercent(end) })}
          <div>
            {renderDots.map(({ position, value }) => (
              <div
                key={value}
                style={{ [stepDirection]: numberToPercent(position) }}
                className={classNames(`${classPrefix}-slider__stop`)}
              ></div>
            ))}
          </div>
          <div className={classNames(`${classPrefix}-slider__mark`)}>
            {renderDots.map(({ position, value, label }) => (
              <div
                key={value}
                onClick={(event) => handleClickMarks(event, value)}
                style={{ [stepDirection]: numberToPercent(position) }}
                className={classNames(`${classPrefix}-slider__mark-text`)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {inputNumberProps ? (
        <div
          className={classNames(`${classPrefix}-slider__input-container`, {
            'is-vertical': isVertical,
          })}
        >
          {range && createInput(LEFT_NODE)}
          {range && <div className={`${classPrefix}-slider__center-line`}></div>}
          {createInput(RIGHT_NODE)}
        </div>
      ) : null}
    </div>
  );
});

Slider.displayName = 'Slider';
Slider.defaultProps = sliderDefaultProps;

export default Slider;
