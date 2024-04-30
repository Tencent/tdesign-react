import React from 'react';
import { Calendar, Tag } from 'tdesign-react';
import dayjs from 'dayjs';

export default function CalendarExample() {
  const getShow = (data) =>
    data.mode === 'month'
      ? dayjs().format('YYYY-MM-DD') === data.formattedDate
      : data.date.getMonth() === new Date().getMonth();

  return (
    <Calendar
      cellAppend={(cellData) =>
        getShow(cellData) && (
          <div className="cell-append-demo-outer">
            <Tag theme="success" variant="light" size="small" className="activeTag" style={{ width: '100%' }}>
              {cellData.mode == 'month' ? '我们的纪念日' : '我们的纪念月'}
            </Tag>
            <Tag theme="warning" variant="light" size="small" className="activeTag" style={{ width: '100%' }}>
              {cellData.mode == 'month' ? '家庭聚会' : '家庭聚会'}
            </Tag>
          </div>
        )
      }
    />
  );
}
