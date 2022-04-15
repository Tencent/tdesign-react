import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from 'tdesign-icons-react';
import { COLOR_MODES } from '../../const';
import Radio, { RadioValue } from '../../../radio';
import { TdColorModes } from '../../interface';
import { TdColorPickerProps } from '../../type';

export interface ColorPanelHeaderProps extends TdColorPickerProps {
  mode?: TdColorModes;
  togglePopup?: Function;
  onModeChange?: (value: RadioValue, context: { e: React.ChangeEvent<HTMLInputElement> }) => void;
  baseClassName?: string;
}

const Header = (props: ColorPanelHeaderProps) => {
  const { baseClassName, mode = 'monochrome', colorModes, togglePopup, closeBtn = true, onModeChange } = props;

  const handleClosePopup = () => {
    togglePopup?.(false);
  };

  return (
    <div className={`${baseClassName}__head`}>
      <div className={`${baseClassName}__mode`}>
        {colorModes?.length === 1 ? (
          COLOR_MODES[colorModes[0]]
        ) : (
          <Radio.Group variant="default-filled" size="small" value={mode} onChange={onModeChange}>
            {Object.keys(COLOR_MODES).map((key) => (
              <Radio.Button key={key} value={key}>
                {COLOR_MODES[key]}
              </Radio.Button>
            ))}
          </Radio.Group>
        )}
      </div>
      {closeBtn ? (
        <span
          role="button"
          className={classNames(`${baseClassName}__icon`, `${baseClassName}__close`)}
          onClick={handleClosePopup}
        >
          <CloseIcon />
        </span>
      ) : null}
    </div>
  );
};

export default React.memo(Header);
