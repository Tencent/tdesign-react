import React from 'react';
import { Switch, Calendar } from 'tdesign-react';
import type { CalendarProps } from 'tdesign-react';

export default function CalendarExample() {
  const [preventCellContextmenu, setPreventCellContextmenu] = React.useState(false);

  const cellClick: CalendarProps['onCellClick'] = (options) => {
    console.log(`鼠标左键单击单元格 ${options.cell.formattedDate}`);
  };

  const cellDoubleClick: CalendarProps['onCellDoubleClick'] = (options) => {
    console.log(`鼠标双击单元格 ${options.cell.formattedDate}`);
  };

  const cellRightClick: CalendarProps['onCellRightClick'] = (options) => {
    console.log(`鼠标右键点击元格 ${options.cell.formattedDate}`);
  };

  const controllerChange: CalendarProps['onControllerChange'] = (data) => {
    console.log('控件值变化', data);
  };

  const monthChange: CalendarProps['onMonthChange'] = (data) => {
    console.log('月份变化', data);
  };

  return (
    <div>
      <div style={{ margin: '12px 0' }}>
        <label>禁用单元格右键菜单：</label>
        <Switch value={preventCellContextmenu} onChange={(val) => setPreventCellContextmenu(val)} />
      </div>
      <Calendar
        preventCellContextmenu={preventCellContextmenu}
        onCellClick={cellClick}
        onCellDoubleClick={cellDoubleClick}
        onCellRightClick={cellRightClick}
        onControllerChange={controllerChange}
        onMonthChange={monthChange}
      />
    </div>
  );
}
