import React from 'react';
import classnames from 'classnames';
import { DeleteIcon } from 'tdesign-icons-react';
import Color from '../../utils/color';
import { RecentColorsChangeTrigger } from '../../type';
import { TdColorBaseProps } from '../../interface';
import useCommonClassName from '../../../_util/useCommonClassName';

export interface TdColorSwathcesProps extends TdColorBaseProps {
  colors?: string[];
  title?: String;
  removable?: Boolean;
  onSetColor?: Function;
}

const Swatches = (props: TdColorSwathcesProps) => {
  const { baseClassName, colors = [], title = '系统色彩', removable = false, onChange, disabled, onSetColor } = props;
  const swatchesClass = `${baseClassName}__swatches`;
  const { STATUS: statusClassNames } = useCommonClassName();
  const isEqualCurrentColor = (color: string) => Color.compare(color, props.color.css);

  // 移除颜色
  const selectedColorIndex = () => colors.findIndex((color) => isEqualCurrentColor(color));
  const handleRemoveColor = () => {
    const colors = [...props.colors];
    const selectedIndex = selectedColorIndex();
    let trigger: RecentColorsChangeTrigger = 'delete';
    if (selectedIndex > -1) {
      colors.splice(selectedIndex, 1);
    } else {
      colors.length = 0;
      trigger = 'clear';
    }
    onChange(colors, trigger);
  };

  const handleClick = (color: string) => onSetColor(color);

  return (
    <div className={swatchesClass}>
      <h3 className={`${swatchesClass}--title`}>
        <span>{title}</span>
        {removable && (
          <span role="button" className={`${baseClassName}__icon`} onClick={() => handleRemoveColor()}>
            <DeleteIcon />
          </span>
        )}
      </h3>
      <ul className={classnames(`${swatchesClass}--items`, 'narrow-scrollbar')}>
        {colors.map((color) => (
          <li
            className={classnames(
              `${swatchesClass}--item`,
              isEqualCurrentColor(color) && removable ? statusClassNames.active : '',
            )}
            key={color}
            onClick={() => {
              if (disabled) {
                return;
              }
              handleClick(color);
            }}
          >
            <div className={classnames(`${swatchesClass}--item__color`, `${baseClassName}--bg-alpha`)}>
              <span
                className={`${swatchesClass}--item__inner`}
                style={{
                  background: color,
                }}
              ></span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(Swatches);
