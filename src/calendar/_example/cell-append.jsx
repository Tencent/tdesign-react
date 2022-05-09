import React from 'react';
import { Calendar, Tag } from 'tdesign-react';
import dayjs from 'dayjs';

export default function CalendarExample() {
  const getShow = (data) =>
    data.mode === 'month'
      ? dayjs().format('YYYY-MM-DD') === data.formattedDate
      : data.date.getMonth() === new Date().getMonth();

  return (
    <>
      <Calendar
        cellAppend={(cellData) =>
          getShow(cellData) && (
            <div className="cell-append-demo-outer">
              <Tag theme="primary" size="small">
                {cellData.mode === 'month' ? '今天' : '本月'}
              </Tag>
            </div>
          )
        }
      />
    </>
  );
}
