import React from 'react';
import classnames from 'classnames';
import { AddIcon as TdAddIcon, DeleteIcon as TdDeleteIcon } from 'tdesign-icons-react';
import Color from '@tdesign/common-js/color-picker/color';

import useCommonClassName from '../../../hooks/useCommonClassName';
import useGlobalIcon from '../../../hooks/useGlobalIcon';

import type { TdColorBaseProps } from '../../interface';

export interface TdColorSwathcesProps extends TdColorBaseProps {
  colors?: string[];
  title?: String;
  editable?: Boolean;
  onSetColor?: Function;
  handleAddColor?: Function;
}

const Swatches = (props: TdColorSwathcesProps) => {
  const { baseClassName, colors = [], editable = false, title, onChange, disabled, onSetColor, handleAddColor } = props;
  const { DeleteIcon, AddIcon } = useGlobalIcon({ DeleteIcon: TdDeleteIcon, AddIcon: TdAddIcon });
  const swatchesClass = `${baseClassName}__swatches`;
  const { STATUS: statusClassNames } = useCommonClassName();
  const isEqualCurrentColor = (color: string) => Color.compare(color, props.color.css);

  // 移除颜色
  const selectedColorIndex = () => colors.findIndex((color) => isEqualCurrentColor(color));
  const handleRemoveColor = () => {
    const selectedIndex = selectedColorIndex();
    if (selectedIndex > -1) {
      const newColors = colors.filter((item, index) => index !== selectedIndex);
      onChange(newColors);
    }
  };

  const handleClick = (color: string) => onSetColor(color);

  return (
    <div className={swatchesClass}>
      {title ? (
        <h3 className={`${swatchesClass}--title`}>
          <span>{title}</span>
          {editable && (
            <div className={`${swatchesClass}--actions`}>
              <span role="button" className={`${baseClassName}__icon`} onClick={() => handleAddColor()}>
                <AddIcon />
              </span>
              {colors.length > 0 ? (
                <span role="button" className={`${baseClassName}__icon`} onClick={() => handleRemoveColor()}>
                  <DeleteIcon />
                </span>
              ) : null}
            </div>
          )}
        </h3>
      ) : (
        <></>
      )}
      <ul className={classnames(`${swatchesClass}--items`, 'narrow-scrollbar')}>
        {colors.map((color) => (
          <li
            className={classnames(
              `${swatchesClass}--item`,
              isEqualCurrentColor(color) && editable ? statusClassNames.active : '',
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
