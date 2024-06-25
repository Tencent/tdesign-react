import React, { useEffect } from 'react';
import { Calendar, Switch } from 'tdesign-react';

const classStyles = `
  <style>
    .controllerConfig-demo fieldset {
      border: solid 1px #eee;
      padding: 10px 20px 10px 0;
      margin-bottom: 10px;
    }
    .controllerConfig-demo fieldset legend {
      margin-left: 20px;
      padding: 0 10px;
    }
    .controllerConfig-demo fieldset p {
      margin-bottom: 5px;
    }
    .controllerConfig-demo fieldset p label {
      margin-left: 20px;
    }
    .outerWarper {
      width: 100%;
      height: 100%;
      position: relative;

      .shadow {
        position: absolute;
        width: 100%;
        height: 12px;
        bottom: 0;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
      }
      .number {
        font-weight: bold;
        position: absolute;
        top: 3px;
        right: 5px;
        font-size: 14px;
      }
      .item {
        position: relative;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.6);
        span {
          display: block;
          left: 1px;
          width: 5px;
          height: 5px;
          border-radius: 10px;
          margin-right: 4px;
        }
      }
      .error {
        background: #e34d59;
      }
      .warning {
        background: #ed7b2f;
      }
      .success {
        background: #00a870;
      }

      .slotWarper {
        position: absolute;
        bottom: 2px;
        left: 5px;
      }
    }
    .cellAppend {
      margin: 10px;
      background-color: #ebf2ff;
      color: #888;
      border-radius: 3px;
      padding: 2px 4px;
    }
    .cellAppend.belongCurrent {
      color: #0052d9;
    }
    .cellAppend.actived {
      background-color: #0052d9;
      color: #ebf2ff;
    }
  </style>
`;

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

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <div className="controllerConfig-demo">
      <div style={{ margin: '12px 0' }}>
        <fieldset>
          <legend>控件全局</legend>
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
        </fieldset>
        <fieldset>
          <legend>控件局部</legend>
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
            <label>是否禁用“隐藏周末”控件：</label>
            <Switch value={weekendHideButtonDisabled} onChange={setWeekendHideButtonDisabled} />
            <label>是否禁用“显示周末”控件：</label>
            <Switch value={weekendShowButtonDisabled} onChange={setWeekendShowButtonDisabled} />
            <label>是否显示“隐藏\显示周末”控件：</label>
            <Switch value={weekendToggleVisible} onChange={setWeekendToggleVisible} />
          </p>
          <br />
          <p>
            <label>是否显示“今天\本月”控件：</label>
            <Switch value={currentVisible} onChange={setCurrentVisible} />
            <label>是否禁用“今天”按钮控件：</label>
            <Switch value={currentDayButtonDisabled} onChange={setCurrentDayButtonDisabled} />
            <label>是否禁用“本月”按钮控件：</label>
            <Switch value={currentMonthButtonDisabled} onChange={setCurrentMonthButtonDisabled} />
          </p>
          <br />
          <Calendar
            controllerConfig={
              visible
                ? {
                    disabled,
                    mode: {
                      visible: modeVisible,
                      radioGroupProps: { disabled: modeDisabled, variant: 'default-filled' },
                    },
                    year: {
                      visible: yearVisible,
                      selectProps: {
                        disabled: yearDisabled,
                      },
                    },
                    month: {
                      visible: monthVisible,
                      selectProps: {
                        disabled: monthDisabled,
                      },
                    },
                    weekend: {
                      visible: weekendToggleVisible,
                      showWeekendButtonProps: { disabled: weekendShowButtonDisabled },
                      hideWeekendButtonProps: { disabled: weekendHideButtonDisabled },
                    },
                    current: {
                      visible: currentVisible,
                      currentDayButtonProps: { disabled: currentDayButtonDisabled },
                      currentMonthButtonProps: { disabled: currentMonthButtonDisabled },
                    },
                  }
                : false
            }
          />
        </fieldset>
      </div>
    </div>
  );
}
