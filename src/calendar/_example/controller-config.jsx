import React from 'react';
import { Calendar, Switch, Icon } from '@tencent/tdesign-react';

export default function CalendarExample() {
  const [visible, setVisible] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [modeVisible, setModeVisible] = React.useState(true);
  const [modeDisabled, setModeDisabled] = React.useState(false);
  const [yearVisible, setYearVisible] = React.useState(true);
  const [yearDisabled, setYearDisabled] = React.useState(false);
  const [monthVisible, setMonthVisible] = React.useState(true);
  const [monthDisabled, setMonthDisabled] = React.useState(false);
  const [weekendToggleVisible, setWeekendToggleVisible] = React.useState(true);
  const [weekendShowButtonDisabled, setWeekendShowButtonDisabled] = React.useState(false);
  const [weekendHideButtonDisabled, setWeekendHideButtonDisabled] = React.useState(false);
  const [currentVisible, setCurrentVisible] = React.useState(true);
  const [currentDayButtonDisabled, setCurrentDayButtonDisabled] = React.useState(false);
  const [currentMonthButtonDisabled, setCurrentMonthButtonDisabled] = React.useState(false);

  const fieldsetStyle = React.useMemo(
    () => ({
      border: 'solid 1px #eee',
      padding: '10px 20px 10px 20px',
      marginBottom: '20px',
    }),
    [],
  );

  const legendStyle = React.useMemo(() => ({ marginLeft: '20px', padding: '0 10px' }), []);

  return (
    <div>
      <div style={{ margin: '12px 0' }}>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>控件全局</legend>
          <p>
            <label>是否显示（全部控件）：</label>
            <Switch value={visible} onChange={setVisible} />
          </p>
          <br />
          <p>
            <label>是否禁用（全部控件）：</label>
            <Switch value={disabled} onChange={setDisabled} />
          </p>
          <br />
          <Calendar controllerConfig={{ visible, disabled }} />
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>控件局部</legend>
          <p>
            <label>是否显示“模式切换”控件：</label>
            <Switch value={modeVisible} onChange={setModeVisible} />
            <label>是否禁用“模式切换”控件：</label>
            <Switch value={modeDisabled} onChange={setModeDisabled} />
          </p>
          <br />
          <p>
            <label>是否显示“年份选择”控件：</label>
            <Switch value={yearVisible} onChange={setYearVisible} />
            <label>是否禁用“年份选择”控件：</label>
            <Switch value={yearDisabled} onChange={setYearDisabled} />
          </p>
          <br />
          <p>
            <label>是否显示“月份选择”控件：</label>
            <Switch value={monthVisible} onChange={setMonthVisible} />
            <label>是否禁用“月份选择”控件：</label>
            <Switch value={monthDisabled} onChange={setMonthDisabled} />
          </p>
          <br />
          <p>
            <label>是否显示“隐藏\显示周末”控件：</label>
            <Switch value={weekendToggleVisible} onChange={setWeekendToggleVisible} />
            <label>是否禁用“隐藏周末”控件：</label>
            <Switch value={weekendHideButtonDisabled} onChange={setWeekendHideButtonDisabled} />
            <label>是否禁用“显示周末”控件：</label>
            <Switch value={weekendShowButtonDisabled} onChange={setWeekendShowButtonDisabled} />
          </p>
          <br />
          <p>
            <label>是否显示“今天\本月”控件：</label>
            <Switch value={currentVisible} onChange={setCurrentVisible} />
            <label>是否禁用“今天”控件：</label>
            <Switch value={currentDayButtonDisabled} onChange={setCurrentDayButtonDisabled} />
            <label>是否禁用“本月”控件：</label>
            <Switch value={currentMonthButtonDisabled} onChange={setCurrentMonthButtonDisabled} />
          </p>
          <br />
          <Calendar
            controllerConfig={{
              visible,
              disabled,
              mode: { visible: modeVisible, radioGroupProps: { disabled: modeDisabled, buttonStyle: 'solid' } },
              year: {
                visible: yearVisible,
                selectProps: {
                  disabled: yearDisabled,
                  style: { minWidth: '110px' },
                  prefixIcon: <Icon name="chart-bar" />,
                },
              },
              month: {
                visible: monthVisible,
                selectProps: {
                  disabled: monthDisabled,
                  style: { minWidth: '90px' },
                  prefixIcon: <Icon name="discount" />,
                },
              },
              weekend: {
                visible: weekendToggleVisible,
                showWeekendButtonProps: { disabled: weekendShowButtonDisabled, theme: 'primary', icon: 'browse' },
                hideWeekendButtonProps: { disabled: weekendHideButtonDisabled, theme: 'warning', icon: 'browse-off' },
              },
              current: {
                visible: currentVisible,
                currentDayButtonProps: { disabled: currentDayButtonDisabled, theme: 'primary', icon: 'rollback' },
                currentMonthButtonProps: { disabled: currentMonthButtonDisabled, theme: 'primary', icon: 'rollback' },
              },
            }}
          />
        </fieldset>
      </div>
    </div>
  );
}
