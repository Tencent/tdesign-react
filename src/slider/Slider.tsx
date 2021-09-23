import React, { forwardRef, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { TdSliderProps } from '../_type/components/slider';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { numberToPencent } from './utils/handleNumber';
import { StyledProps, TNode } from '../_type';
import Tooltip from '../tooltip/Tooltip';
import InputNumber from '../input-number/InputNumber';

export type SliderProps = TdSliderProps & StyledProps;

const LEFT_NODE = 0;
const RIGHT_NODE = 1;
type SliderHandleNode = typeof LEFT_NODE | typeof RIGHT_NODE;

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      disabled,
      inputNumberProps = true,
      label,
      layout = 'horizontal',
      marks,
      max = 100,
      min = 0,
      range,
      step = 1,
      tooltipProps,
      value: propsValue,
      defaultValue,
      onChange,
      className,
      style,
    },
    ref,
  ) => {
    const { classPrefix } = useConfig();
    const movingNodeRef = useRef<SliderHandleNode | null>();
    const sliderRef = useRef<HTMLDivElement>();
    const [value, setValue] = useDefault(propsValue, defaultValue, onChange);
    const isVertical = layout === 'vertical';

    const renderVaule = Array.isArray(value) ? value : [min, value];
    const start = (renderVaule[LEFT_NODE] - min) / max;
    const width = (renderVaule[RIGHT_NODE] - renderVaule[LEFT_NODE]) / (max - min);
    const end = start + width;

    const dots: { value: number; label: TNode; position: number }[] = useMemo(() => {
      // 当 marks 为数字数组
      if (Array.isArray(marks)) {
        if (marks.find((mark) => typeof mark !== 'number')) {
          console.warn('The props "marks" only support number!');
          return [];
        }
        return marks.map((mark) => ({
          value: mark,
          position: (mark - min) / max,
          label: mark,
        }));
      }
      // 当 marks 为对象
      if (marks && typeof marks === 'object') {
        const result = [];
        // eslint-disable-next-line guard-for-in
        for (const key in marks) {
          const numberKey = Number(key);
          if (typeof numberKey !== 'number' || !numberKey) {
            console.warn('The props "marks" key only support number!');
          } else {
            result.push({
              value: numberKey,
              label: marks[numberKey],
              position: (numberKey - min) / max,
            });
          }
        }
        return result;
      }
      return [];
    }, [max, min, marks]);

    const allDots = useMemo(() => {
      // 默认
      const result = [];
      const gap = step / max;
      for (let i = min; i <= max; i += step) {
        const index = (i - min) / step;
        result.push({
          value: i,
          position: gap * index,
        });
      }
      return result;
    }, [max, min, step]);

    const startDirection = isVertical ? 'bottom' : 'left';
    const stepDirection = isVertical ? 'top' : 'left';
    const sizeKey = isVertical ? 'height' : 'width';
    const renderDots = isVertical ? dots.map((item) => ({ ...item, position: 1 - item.position })) : dots;

    const handleInputChange = (newValue: number, nodeIndex: SliderHandleNode) => {
      const resultValue = Math.max(Math.min(max, newValue), min);
      if (Array.isArray(value)) {
        const arrValue = value.slice();
        arrValue[nodeIndex] = resultValue;
        setValue(arrValue);
      } else {
        setValue(resultValue);
      }
    };

    const createInput = (nodeIndex: SliderHandleNode) => {
      const inputProps = typeof inputNumberProps === 'object' ? inputNumberProps : {};
      const currentValue = renderVaule[nodeIndex];

      return (
        <InputNumber
          theme="normal"
          value={currentValue}
          onChange={(value: number) => handleInputChange(Number(value), nodeIndex)}
          className={classNames(`${classPrefix}-slider-input`, {
            [`is-vertical`]: isVertical,
          })}
          disabled={disabled}
          {...inputProps}
        />
      );
    };

    const nearbyValueChange = (value: number) => {
      const buttonBias =
        Math.abs(value - renderVaule[LEFT_NODE]) > Math.abs(value - renderVaule[RIGHT_NODE]) ? RIGHT_NODE : LEFT_NODE;
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
      let { value } = allDots[index];
      if (nodeIndex === undefined && range) {
        nearbyValueChange(value);
      } else {
        // 防止溢出
        if (nodeIndex === LEFT_NODE && value > renderVaule[RIGHT_NODE]) value = renderVaule[RIGHT_NODE];
        if (nodeIndex === RIGHT_NODE && value < renderVaule[LEFT_NODE]) value = renderVaule[LEFT_NODE];
        handleInputChange(value, nodeIndex);
      }
    };

    const onSliderChange = (event: React.MouseEvent | MouseEvent, nodeIndex?: SliderHandleNode) => {
      const clientKey = isVertical ? 'clientY' : 'clientX';
      const sliderPositionInfo = sliderRef.current.getBoundingClientRect();
      const sliderOffset = sliderPositionInfo[startDirection];
      const position = ((event[clientKey] - sliderOffset) / sliderPositionInfo[sizeKey]) * (isVertical ? -1 : 1);
      setPosition(position, nodeIndex);
    };

    const onSliderDragging = (e: MouseEvent) => {
      if (movingNodeRef.current !== null) onSliderChange(e, movingNodeRef.current);
    };

    const onSliderDraggingEnd = () => {
      movingNodeRef.current = null;
      window.removeEventListener('mousemove', onSliderDragging);
      window.removeEventListener('mouseup', onSliderDraggingEnd);
      window.removeEventListener('touchmove', onSliderDragging);
      window.removeEventListener('touchend', onSliderDraggingEnd);
    };

    const handleSliderMouseDown = (e: React.MouseEvent, nodeIndex: SliderHandleNode) => {
      e.stopPropagation();
      movingNodeRef.current = nodeIndex;
      window.addEventListener('mousemove', onSliderDragging);
      window.addEventListener('mouseup', onSliderDraggingEnd);
      window.addEventListener('touchmove', onSliderDragging);
      window.addEventListener('touchend', onSliderDraggingEnd);
    };

    const handleClickMarks = (event: React.MouseEvent, value: number) => {
      event.stopPropagation();
      nearbyValueChange(value);
    };

    const createHandleButton = (nodeIndex: SliderHandleNode, style: React.CSSProperties) => {
      const currentValue = renderVaule[nodeIndex];
      // 模板替换
      let tipLabel = typeof label === 'string' ? label.replace(/\$\{value\}/g, currentValue.toString()) : label;
      if (tipLabel === true || !tipLabel) tipLabel = currentValue;

      return (
        <div
          style={style}
          className={classNames(`${classPrefix}-slider__button-wrapper`)}
          onMouseDown={(e) => handleSliderMouseDown(e, nodeIndex)}
        >
          <Tooltip disabled={label === false} placement="top" content={tipLabel} {...tooltipProps}>
            <div className={classNames(`${classPrefix}-slider__button`)}></div>
          </Tooltip>
        </div>
      );
    };

    return (
      <div
        style={{ ...style }}
        className={classNames(`${classPrefix}-slider-contianer`, {
          [`is-vertical`]: isVertical,
        })}
        ref={ref}
      >
        <div
          ref={sliderRef}
          className={classNames(className, `${classPrefix}-slider`, {
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-slider-vertical`]: isVertical,
            [`${classPrefix}-slider--with-input`]: inputNumberProps,
          })}
          onClick={onSliderChange}
        >
          <div className={classNames(`${classPrefix}-slider__rail`)}>
            <div
              style={{ [startDirection]: numberToPencent(start), [sizeKey]: numberToPencent(width) }}
              className={classNames(`${classPrefix}-slider__track`)}
            ></div>
            {range ? createHandleButton(LEFT_NODE, { [startDirection]: numberToPencent(start) }) : null}
            {createHandleButton(RIGHT_NODE, { [startDirection]: numberToPencent(end) })}
            <div className={classNames(`${classPrefix}-slider__step`)}>
              {renderDots.map(({ position, value }) => (
                <div
                  key={value}
                  style={{ [stepDirection]: numberToPencent(position) }}
                  className={classNames(`${classPrefix}-slider__stop`)}
                ></div>
              ))}
            </div>
            <div className={classNames(`${classPrefix}-slider__mark`)}>
              {renderDots.map(({ position, value, label }) => (
                <div
                  key={value}
                  onClick={(event) => handleClickMarks(event, value)}
                  style={{ [stepDirection]: numberToPencent(position) }}
                  className={classNames(`${classPrefix}-slider__mark-text`)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
        {inputNumberProps ? (
          <div className={classNames(`${classPrefix}-slider-input-container`)}>
            {range && createInput(LEFT_NODE)}
            {createInput(RIGHT_NODE)}
          </div>
        ) : null}
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export default Slider;
