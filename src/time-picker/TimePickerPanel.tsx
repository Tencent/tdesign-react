import React, { FC, useCallback } from 'react';
import dayjs from 'dayjs';
import SinglePanel, { SinglePanelProps } from './SinglePanel';

import useConfig from '../_util/useConfig';
import Button from '../button';

import { TEXT_CONFIG } from './consts';

export interface TimePickerPanelProps extends SinglePanelProps {
  // 是否展示footer
  isFooterDisplay?: boolean;
}

const TimePickerPanel: FC<TimePickerPanelProps> = (props) => {
  const { isFooterDisplay, format, onChange } = props;
  const { classPrefix } = useConfig();

  const panelClassName = `${classPrefix}-time-picker-panel`;

  const handleClickConfirm = useCallback(() => {
    // todo
  }, []);
  return (
    <div className={panelClassName}>
      <div className={`${panelClassName}-section__body`}>
        <SinglePanel {...props} />
      </div>
      {isFooterDisplay ? (
        <div className={`${panelClassName}-section__footer`}>
          <Button theme="primary" variant="base" onClick={handleClickConfirm}>
            {TEXT_CONFIG.confirm}
          </Button>
          <Button theme="primary" variant="text" onClick={() => onChange(dayjs().format(format))}>
            {TEXT_CONFIG.nowtime}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
