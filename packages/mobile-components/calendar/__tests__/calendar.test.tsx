import React from 'react';
import { describe, it, expect, render, vi, fireEvent, beforeAll, screen } from '@test/utils';
import Calendar, { TDate } from '../index';

const prefix = 't';
const name = `.${prefix}-calendar`;

// calendar 弹窗形式基于 popup 实现，默认挂载在 body 上
describe('Calendar', () => {
  beforeAll(() => {
    process.env.TZ = 'UTC'; // 使用 UTC 时间
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  describe('props', () => {
    it(':className', () => {
      const { container } = render(<Calendar className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it(':style', () => {
      const { container } = render(<Calendar style={{ color: '#fff' }} />);
      expect(container.firstChild).toHaveStyle('color: #fff');
    });

    it(':visible', async () => {
      const { rerender } = render(<Calendar visible={false} />);
      const el = document.querySelector('.t-popup');
      expect(el).toBeTruthy();
      expect(el).toHaveStyle({ display: 'none' });

      rerender(<Calendar visible={true} />);
      expect(el).toBeTruthy();
      expect(el).not.toHaveStyle({ display: 'none' });
    });

    it(':autoClose', () => {
      // TODO: autoClose 感觉不是很合理。
      // visible 是一个受控属性，当 autoClose = false，visible = true 时，点击遮罩层，组件内部 visible 主动变更为 false，但此时用户侧的 visible 依旧是 true，导致出现非预期行为。
    });

    it(':confirmBtn', () => {
      // string
      const { rerender } = render(<Calendar visible confirmBtn="Confirm" />);
      expect(screen.getByText('Confirm')).toBeInTheDocument();

      // buttonProps
      rerender(<Calendar visible confirmBtn={{ content: 'ConfirmBtn' }} />);
      expect(screen.getByRole('button', { name: 'ConfirmBtn' })).toBeInTheDocument();

      // function
      rerender(<Calendar visible confirmBtn={() => <button>CustomBtn</button>} />);
      expect(screen.getByRole('button', { name: 'CustomBtn' })).toBeInTheDocument();

      // null
      rerender(<Calendar visible confirmBtn={null} />);
      const footer = document.querySelector(`${name}__footer`);
      expect(footer).toBeEmptyDOMElement();
    });

    it(':firstDayOfWeek', () => {
      // 默认 0，从周日开始
      const { rerender } = render(<Calendar visible />);
      const days = document.querySelector(`${name}__days`);
      expect(days).toHaveTextContent('日一二三四五六');

      // firstDayOfWeek = 1，从周一开始
      rerender(<Calendar visible firstDayOfWeek={1} />);
      expect(days).toHaveTextContent('一二三四五六日');
    });

    it(':format', () => {
      const value = new Date(2022, 0, 15);
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 0, 31);
      const prefix = 'special';
      const suffix = 'Birthday';
      const className = 'is-holiday';
      const format = (day: TDate) => {
        const { date } = day;
        const dayTmp = day;

        if (date.toISOString().split('T')[0] === value.toISOString().split('T')[0]) {
          dayTmp.prefix = prefix;
          dayTmp.suffix = suffix;
          dayTmp.className = className;
        }
        return day;
      };
      render(<Calendar visible value={value} minDate={minDate} maxDate={maxDate} format={format} />);

      // 2022-1-15为默认选中项，通过 format 设置了前缀 special，后缀 Birthday，且 className 为 is-holiday
      const selectedItem = document.querySelector(`${name}__dates-item--selected`);
      expect(selectedItem).toHaveTextContent(`${prefix}15${suffix}`);
      expect(selectedItem).toHaveClass(className);
    });

    it(':minDate && maxDate', () => {
      const value = new Date(2022, 0, 15);
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);
      render(<Calendar visible value={value} minDate={minDate} maxDate={maxDate} />);
      const months = document.querySelectorAll(`${name}__month`);
      expect(months[0].textContent.replace(/\s+/g, '')).toBe('2022年1月');
      expect(months[months.length - 1].textContent.replace(/\s+/g, '')).toBe('2022年2月');
    });

    it(':readonly', () => {
      const onSelect = vi.fn();
      const value = new Date(2022, 0, 15);
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);
      const { rerender } = render(
        <Calendar visible value={value} minDate={minDate} maxDate={maxDate} onSelect={onSelect} />,
      );
      const firstDay = document.querySelector(`${name}__dates-item`);
      fireEvent.click(firstDay);
      expect(onSelect).toHaveBeenCalledTimes(1);

      // 设置只读，点击日期不触发 onSelect
      rerender(<Calendar visible readonly value={value} minDate={minDate} maxDate={maxDate} onSelect={onSelect} />);
      fireEvent.click(firstDay);
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it(':switchMode', async () => {
      const { rerender } = render(<Calendar visible switchMode="none" />);
      const header1 = document.querySelector(`${name}-header`);
      expect(header1).toBeFalsy();

      // 月翻页，2 个图标按钮
      rerender(<Calendar visible switchMode="month" />);
      const header2 = document.querySelector(`${name}-header`);
      const actions = document.querySelectorAll(`${name}-header__icon`);
      expect(header2).toBeTruthy();
      expect(actions).toHaveLength(2);

      // 年月翻页，4 个图标按钮
      rerender(<Calendar visible switchMode="year-month" />);
      const header3 = document.querySelector(`${name}-header`);
      const action3 = document.querySelectorAll(`${name}-header__icon`);
      expect(header3).toBeTruthy();
      expect(action3).toHaveLength(4);
    });

    it(':title', () => {
      // 不传默认为“请选择日期”
      const { rerender } = render(<Calendar visible />);
      expect(document.querySelector(`${name}__title`).innerHTML).toBe('请选择日期');

      // string
      const title2 = 'title test';
      rerender(<Calendar visible title={title2} />);
      expect(screen.getByText(title2)).toBeInTheDocument();

      // function
      const title3 = 'title test';
      rerender(<Calendar visible title={() => <div>{title3}</div>} />);
      expect(screen.getByText(title3)).toBeInTheDocument();
    });

    it(':type', () => {
      const onSelect = vi.fn();
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);

      const value = [new Date(2022, 0, 15)];
      const { rerender } = render(
        <Calendar visible value={value} minDate={minDate} maxDate={maxDate} onSelect={onSelect} />,
      );

      // single：模拟点击 2022-1-1和2022-1-2，onSelect 返回值为 2022-1-2
      const days = document.querySelectorAll(`${name}__dates-item`);
      fireEvent.click(days[0]);
      expect(onSelect).toHaveBeenCalledTimes(1);
      fireEvent.click(days[1]);
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect.mock.calls[1][0]).toStrictEqual(new Date(2022, 0, 2));
      expect(onSelect.mock.calls[1][0]).not.toBeInstanceOf(Array);

      // multiple：模拟点击 2022-1-1、2022-1-2、2022-1-3，onSelect 返回值为 [2022-1-1, 2022-1-2, 2022-1-3]
      const onSelect2 = vi.fn();
      rerender(
        <Calendar visible type="multiple" value={value} minDate={minDate} maxDate={maxDate} onSelect={onSelect2} />,
      );
      const days2 = document.querySelectorAll(`${name}__dates-item`);
      fireEvent.click(days2[0]);
      fireEvent.click(days2[1]);
      fireEvent.click(days2[2]);
      expect(onSelect2).toHaveBeenCalledTimes(3);
      expect(onSelect2.mock.calls[2][0]).toBeInstanceOf(Array);
      expect(onSelect2.mock.calls[2][0].length).toBe(4); // 默认值1项，点选中3项，共4项

      const onSelect3 = vi.fn();
      rerender(
        <Calendar
          visible
          type="range"
          value={[new Date(2022, 0, 1), new Date(new Date(2022, 0, 1).getTime() + 2 * 24 * 3600 * 1000)]}
          minDate={minDate}
          maxDate={maxDate}
          onSelect={onSelect3}
        />,
      );
      const days3 = document.querySelectorAll(`${name}__dates-item`);
      // range：依次模拟点击 2022-1-1、2022-1-2、2022-1-3、2022-1-7，onSelect 返回值应为 [2022-1-3, 2022-1-7]
      fireEvent.click(days3[0]);
      fireEvent.click(days3[1]);
      fireEvent.click(days3[2]);
      fireEvent.click(days3[6]);
      expect(onSelect3).toHaveBeenCalledTimes(4);
      expect(onSelect3.mock.calls[3][0].length).toBe(2);
      expect(onSelect3.mock.calls[3][0][0]).toStrictEqual(new Date(2022, 0, 3));
      expect(onSelect3.mock.calls[3][0][1]).toStrictEqual(new Date(2022, 0, 7));
    });

    it(':usePopup', () => {
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);

      const value = new Date(2022, 0, 15);
      const { rerender } = render(<Calendar visible value={value} minDate={minDate} maxDate={maxDate} />);
      const calendar = document.querySelector(`${name}`);
      expect(calendar).toHaveClass('t-calendar t-calendar--popup');

      rerender(<Calendar visible usePopup={false} value={value} minDate={minDate} maxDate={maxDate} />);
      expect(calendar).toHaveClass('t-calendar');
    });

    it(':value', () => {
      render(<Calendar visible value={null} type="multiple" switchMode="month" />);
      const start = document.querySelector(`${name}__dates-item--start`);
      const end = document.querySelector(`${name}__dates-item--end`);
      expect(start).toBeNull();
      expect(end).toBeNull();

      render(<Calendar visible value={null} type="single" switchMode="month" />);
      const selected = document.querySelector(`${name}__dates-item--selected`);
      expect(selected).toBeTruthy();
      // type = single，不传value时，默认取当天
      expect(selected).toHaveTextContent(new Date().getDate().toString());
    });
  });

  describe('events', () => {
    it(':close', () => {
      const onClose = vi.fn();
      render(<Calendar visible autoClose confirmBtn={{ content: 'ConfirmBtn' }} onClose={onClose} />);
      const overlay = document.querySelector('.t-overlay');
      expect(overlay).toBeInTheDocument();

      // from 遮罩
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);

      // from  关闭按钮
      const closeBtn = document.querySelector(`${name}__close-btn`);
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(2);

      // from 确认按钮
      const confirmBtn = screen.getByRole('button', { name: 'ConfirmBtn' });
      fireEvent.click(confirmBtn);
      expect(onClose).toHaveBeenCalledTimes(3);
    });

    it(':select', () => {
      const onSelect = vi.fn();
      const value = [new Date(2022, 0, 1)];
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);

      render(
        <Calendar
          visible
          switchMode="year-month"
          value={value}
          type="multiple"
          minDate={minDate}
          maxDate={maxDate}
          onSelect={onSelect}
        />,
      );
      const days = document.querySelectorAll(`${name}__dates-item`);
      fireEvent.click(days[0]); // 取消点选
      expect(onSelect).toHaveBeenCalledTimes(1);
      const selected = document.querySelector(`${name}__dates-item--selected`);
      expect(selected).toBeFalsy();
    });

    it(':confirm', () => {
      const value = [new Date(2022, 0, 5)];
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);
      const onConfirm = vi.fn();
      render(
        <Calendar
          visible
          value={value}
          type="range"
          minDate={minDate}
          maxDate={maxDate}
          confirmBtn={{ content: 'ConfirmBtn' }}
          onConfirm={onConfirm}
        />,
      );

      const days = document.querySelectorAll(`${name}__dates-item`);
      fireEvent.click(days[0]);
      fireEvent.click(days[2]);

      const confirmBtn = screen.getByRole('button', { name: 'ConfirmBtn' });
      fireEvent.click(confirmBtn);
      expect(onConfirm).toHaveBeenCalledTimes(1);

      expect(onConfirm).toHaveBeenCalledWith([new Date(2022, 0, 1), new Date(2022, 0, 3)]);
    });

    it(':change', () => {
      const value = [new Date(2022, 0, 15), new Date(2022, 0, 16)];
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);
      const onChange = vi.fn();
      const onConfirm = vi.fn();
      const onSelect = vi.fn();
      render(
        <Calendar
          visible
          type="range"
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          confirmBtn={null}
          onConfirm={onConfirm}
          onChange={onChange}
          onSelect={onSelect}
        />,
      );

      const days = document.querySelectorAll(`${name}__dates-item`);
      fireEvent.click(days[0]);
      fireEvent.click(days[1]);

      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it(':panelChange', () => {
      const value = new Date(2022, 5, 5);
      const minDate = new Date(2021, 0, 1);
      const maxDate = new Date(2023, 1, 1);
      const onConfirm = vi.fn();
      const onPanelChange = vi.fn();
      render(
        <Calendar
          visible
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          switchMode="year-month"
          confirmBtn={{ content: 'ConfirmBtn' }}
          onConfirm={onConfirm}
          onPanelChange={onPanelChange}
        />,
      );
      const actions = document.querySelectorAll(`${name}-header__icon`);
      // 年月翻页，4 个操作按钮，依次为 上一年、上一月、下一月、下一年
      expect(actions).toHaveLength(4);
      fireEvent.click(actions[0]); // 上年，(2021, 5, 5)
      fireEvent.click(actions[1]); // 上月，(2021, 4, 5)
      fireEvent.click(actions[2]); // 下月，(2021, 5, 5)
      fireEvent.click(actions[3]); // 下年，(2022, 5, 5)，此时下一年按钮为禁用态
      fireEvent.click(actions[3]); // 禁用，切换失败，不会触发 onPanelChange

      expect(onPanelChange).toHaveBeenCalledTimes(4);
      expect(onPanelChange.mock.calls[3][0]).toStrictEqual({ year: 2022, month: 6 });
      const confirmBtn = screen.getByRole('button', { name: 'ConfirmBtn' });
      fireEvent.click(confirmBtn);
      expect(onConfirm).toHaveBeenCalledWith(new Date(2022, 5, 5));
    });

    it(':scroll', () => {
      const onScroll = vi.fn();
      const minDate = new Date(2022, 0, 1);
      const maxDate = new Date(2022, 1, 1);
      render(<Calendar visible minDate={minDate} maxDate={maxDate} onScroll={onScroll} />);
      const scrollContainer = document.querySelector(`${name}__months`);

      // 模拟滚动到 100px
      fireEvent.scroll(scrollContainer, {
        target: { scrollTop: 100 },
      });
      expect(onScroll).toHaveBeenCalledTimes(1);
    });
  });
});
