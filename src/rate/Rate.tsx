import React, { MouseEvent, useState, forwardRef } from 'react';
import classNames from 'classnames';
import { StarFilledIcon as TdStarFilledIcon } from 'tdesign-icons-react';
import Tooltip from '../tooltip';
import { TdRateProps } from './type';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useControlled from '../hooks/useControlled';
import { rateDefaultProps } from './defaultProps';

export interface RateProps extends TdRateProps, StyledProps {}

const Rate = forwardRef((props: RateProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    allowHalf, // 是否允许半选
    color, // 评分图标的颜色，样式中默认为 #ED7B2F。一个值表示设置选中高亮的五角星颜色，两个值表示分别设置 选中高亮的五角星颜色 和 未选中暗灰的五角星颜色。示例：['#ED7B2F', '#999999']
    count, // 评分的数量
    disabled, // 是否禁用评分
    gap, // 评分图标的间距
    showText, // 是否显示对应的辅助文字
    size, // 评分图标的大小，示例：`20`
    texts, // 自定义评分等级对应的辅助文字。组件内置默认值为：['极差', '失望', '一般', '满意', '惊喜']。自定义值示例：['1分', '2分', '3分', '4分', '5分']
    className,
    style,
    onChange,
  } = props;

  const { classPrefix } = useConfig();
  const { StarFilledIcon } = useGlobalIcon({ StarFilledIcon: TdStarFilledIcon });
  const [starValue = 0, setStarValue] = useControlled(props, 'value', onChange);

  const [hoverValue = undefined, setHoverValue] = useState<number | undefined>(undefined);
  const displayValue = hoverValue || starValue;
  const rootRef = React.useRef(null);

  const activeColor = Array.isArray(color) ? color[0] : color;
  const defaultColor = Array.isArray(color) ? color[1] : 'var(--td-bg-color-component)';

  const getStarValue = (event: MouseEvent<HTMLElement>, index: number) => {
    if (allowHalf) {
      const rootNode = rootRef.current;
      const { left } = rootNode.getBoundingClientRect();
      const firstStar = rootNode.firstChild as HTMLElement;
      const { width } = firstStar.getBoundingClientRect();
      const { clientX } = event;
      const starMiddle = width * (index - 0.5) + gap * (index - 1);
      if (clientX - left >= starMiddle) return index;
      if (clientX - left < starMiddle) return index - 0.5;
    }

    return index;
  };

  const mouseEnterHandler = (event: MouseEvent<HTMLElement>, index: number) => {
    if (disabled) return;
    setHoverValue(getStarValue(event, index));
  };

  const mouseLeaveHandler = () => {
    if (disabled) return;
    setHoverValue(undefined);
  };

  const clickHandler = (event: MouseEvent<HTMLElement>, index: number) => {
    if (disabled) return;
    setStarValue(getStarValue(event, index));
  };

  const getStarCls = (index: number) => {
    if (allowHalf && index + 0.5 === displayValue) return `${classPrefix}-rate__item--half`;
    if (index >= displayValue) return '';
    if (index < displayValue) return `${classPrefix}-rate__item--full`;
  };

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(`${classPrefix}-rate`, className)}
      onMouseLeave={mouseLeaveHandler}
    >
      <ul className={`${classPrefix}-rate__list`} style={{ gap }} ref={rootRef}>
        {[...Array(count)].map((_, index) => (
          <li
            key={index}
            className={classNames(`${classPrefix}-rate__item`, getStarCls(index))}
            onClick={(event) => clickHandler(event, index + 1)}
            onMouseMove={(event) => mouseEnterHandler(event, index + 1)}
          >
            {showText ? (
              <Tooltip key={index} content={texts[displayValue - 1]}>
                <div className={`${classPrefix}-rate__star-top`}>
                  <StarFilledIcon size={size} color={activeColor} />
                </div>
                <div className={`${classPrefix}-rate__star-bottom`}>
                  <StarFilledIcon size={size} color={defaultColor} />
                </div>
              </Tooltip>
            ) : (
              <>
                <div className={`${classPrefix}-rate__star-top`}>
                  <StarFilledIcon size={size} color={activeColor} />
                </div>
                <div className={`${classPrefix}-rate__star-bottom`}>
                  <StarFilledIcon size={size} color={defaultColor} />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {showText && <div className={`${classPrefix}-rate__text`}>{texts[displayValue - 1]}</div>}
    </div>
  );
});

Rate.displayName = 'Rate';
Rate.defaultProps = rateDefaultProps;

export default Rate;
