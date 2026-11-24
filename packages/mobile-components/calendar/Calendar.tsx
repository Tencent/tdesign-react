import React, { useEffect, useRef, FC, useState, useCallback } from 'react';
import TPopup from '../popup';
import CalendarTemplate from './CalendarTemplate';
import useDefaultProps from '../hooks/useDefaultProps';
import { calendarDefaultProps } from './defaultProps';
import { TdCalendarProps } from './type';
import { StyledProps } from '../common';

export interface CalendarProps extends TdCalendarProps, StyledProps {}

export interface CalendarContextValue {
  inject: (props: CalendarProps) => CalendarProps;
}

export const CalendarContext = React.createContext<CalendarContextValue>(null);

const Calendar: FC<CalendarProps> = (_props) => {
  const calendarTemplateRef = useRef(null);

  const props = useDefaultProps(_props, calendarDefaultProps);
  const { title, onClose, confirmBtn, usePopup, visible, className, style, value } = props;

  const [currentVisible, setCurrentVisible] = useState(visible);
  const contextValue: CalendarContextValue = {
    inject() {
      return {
        ...props,
        onClose: (trigger) => {
          props.onClose?.(trigger);
          setCurrentVisible(false);
        },
      };
    },
  };

  const selectedValueIntoView = useCallback(() => {
    if (!value || !calendarTemplateRef.current) return;
    const date = new Date(Array.isArray(value) ? value[0] : value);
    const templateRef = calendarTemplateRef.current;
    const selected = templateRef.querySelector(`#year_${date.getFullYear()}_month_${date.getMonth()}`);
    if (selected && typeof selected.scrollIntoView === 'function') {
      selected?.scrollIntoView({
        behavior: 'auto',
      });
    }
  }, [value, calendarTemplateRef]);

  const onPopupVisibleChange = (v) => {
    if (!v) {
      onClose?.('overlay');
    } else {
      selectedValueIntoView();
    }
    setCurrentVisible(v);
  };

  useEffect(() => {
    if (!usePopup) {
      selectedValueIntoView();
      return;
    }

    setCurrentVisible(visible);
    if (visible) {
      const timer = setTimeout(selectedValueIntoView, 0);
      return () => clearTimeout(timer);
    }
  }, [visible, usePopup, selectedValueIntoView]);

  return (
    <CalendarContext.Provider value={contextValue}>
      <div className={className} style={style}>
        {!usePopup ? (
          <CalendarTemplate ref={calendarTemplateRef} title={title} confirmBtn={confirmBtn} />
        ) : (
          <TPopup visible={currentVisible} placement="bottom" onVisibleChange={onPopupVisibleChange}>
            <CalendarTemplate ref={calendarTemplateRef} title={title} confirmBtn={confirmBtn} />
          </TPopup>
        )}
      </div>
    </CalendarContext.Provider>
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
