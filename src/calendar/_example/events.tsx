import React from 'react';
import { Switch, Calendar } from 'tdesign-react';

export default function CalendarExample() {
  const [preventCellContextmenu, setPreventCellContextmenu] = React.useState(false);

  const cellClick = (options) => {
    console.log(`鼠标左键单击单元格 ${options.cell.formattedDate}`);
  };

  const cellDoubleClick = (options) => {
    console.log(`鼠标双击单元格 ${options.cell.formattedDate}`);
  };

  const cellRightClick = (options) => {
    console.log(`鼠标右键点击元格 ${options.cell.formattedDate}`);
  };

  const controllerChange = (data) => {
    console.log('控件值变化', data);
  };

  const monthChange = (data) => {
    console.log('月份变化', data);
  };

  return (
    <div>
      <div style={{ margin: '12px 0' }}>
        <label>禁用单元格右键菜单：</label>
        <Switch value={preventCellContextmenu} onChange={setPreventCellContextmenu} />
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
