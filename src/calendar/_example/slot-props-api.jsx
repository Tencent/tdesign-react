import React from 'react';
import { Calendar } from 'tdesign-react';
import dayjs from 'dayjs';

export default function CalendarExample() {
  const displayNum = React.useCallback((date) => {
    if (date.mode === 'month') {
      return date.date.getDate();
    }
    return date.date.getMonth() + 1;
  }, []);

  const isShow = (data) =>
    data.mode === 'month' ? dayjs(data.formattedDate).date() === 15 : dayjs(data.formattedDate).month() === 7;

  const dataList = [
    {
      value: 'error',
      label: '错误事件',
    },
    {
      value: 'warning',
      label: '警告事件',
    },
    {
      value: 'success',
      label: '正常事件',
    },
  ];

  const renderHead = (params) => {
    let title = params.filterDate.getFullYear();
    if (params.mode === 'month') {
      title += `-${params.filterDate.getMonth() + 1}`;
    }
    title += ' 工作安排';
    return <div>{title}</div>;
  };

  return (
    <Calendar
      head={renderHead}
      cell={(cellData) => (
        <>
          <div className="outerWarper">
            <div className="number">{displayNum(cellData)}</div>
            {isShow(cellData) && (
              <>
                <div className="slotWarper">
                  {dataList.map((item, index) => (
                    <div className="item" key={index}>
                      <span className={item.value} />
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="shadow" />
              </>
            )}
          </div>
        </>
      )}
    />
  );
}
