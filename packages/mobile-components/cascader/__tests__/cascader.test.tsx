import React from 'react';
import { describe, it, expect, render, vi, fireEvent, beforeEach, afterEach, act } from '@test/utils';

import ConfigProvider from '../../config-provider';
import Toast from '../../toast';
import Cascader, { CascaderProps } from '../Cascader';
import LoadDemo from '../_example/lazy';

const prefix = 't';
const name = `.${prefix}-cascader`;

const data = {
  areaList: [
    {
      label: '北京市',
      value: '110000',
      children: [
        {
          value: '110100',
          label: '北京市',
          children: [
            { value: '110101', label: '东城区' },
            { value: '110102', label: '西城区' },
            { value: '110105', label: '朝阳区' },
            { value: '110106', label: '丰台区' },
            { value: '110107', label: '石景山区' },
            { value: '110108', label: '海淀区' },
            { value: '110109', label: '门头沟区' },
            { value: '110111', label: '房山区' },
            { value: '110112', label: '通州区' },
            { value: '110113', label: '顺义区' },
            { value: '110114', label: '昌平区' },
            { value: '110115', label: '大兴区' },
            { value: '110116', label: '怀柔区' },
            { value: '110117', label: '平谷区' },
            { value: '110118', label: '密云区' },
            { value: '', label: '' },
          ],
        },
      ],
    },
    {
      label: '天津市',
      value: '120000',
      children: [
        {
          value: '120100',
          label: '天津市',
          children: [
            { value: '120101', label: '和平区' },
            { value: '120102', label: '河东区' },
            { value: '120103', label: '河西区' },
            { value: '120104', label: '南开区' },
            { value: '120105', label: '河北区' },
            { value: '120106', label: '红桥区' },
            { value: '120110', label: '东丽区' },
            { value: '120111', label: '西青区' },
            { value: '120112', label: '津南区' },
            { value: '120113', label: '北辰区' },
            { value: '120114', label: '武清区' },
            { value: '120115', label: '宝坻区' },
            { value: '120116', label: '滨海新区' },
            { value: '120117', label: '宁河区' },
            { value: '120118', label: '静海区' },
            { value: '120119', label: '蓟州区' },
          ],
        },
      ],
    },
  ],
};

describe('Cascader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('props', () => {
    it(': visible', async () => {
      const onClose = vi.fn();
      await render(<Cascader options={data.areaList} onClose={onClose} visible={true} value="110000" />);
      expect(document.querySelector(`.${prefix}-popup`)).not.toHaveStyle({ display: 'none' });
      fireEvent.click(document.querySelector('.t-overlay'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it(': closeBtn', async () => {
      await render(<Cascader options={data.areaList} closeBtn={true} visible={true} value="110000" theme="tab" />);
      expect(document.querySelector(`.${prefix}-icon-close`)).toBeTruthy();
    });

    it(': closeBtn - custom', async () => {
      await render(
        <Cascader
          options={data.areaList}
          closeBtn={<span className="close-button">Button</span>}
          visible={true}
          value="110000"
          theme="tab"
        />,
      );
      expect(document.querySelector('.close-button')).toBeTruthy();
    });

    it(': title', async () => {
      const title = '标题';
      await render(<Cascader options={data.areaList} title={title} visible={true} value="110000" theme="tab" />);
      expect(document.querySelector(`${name}__title`).innerHTML).toBe(title);
    });

    it(': options', async () => {
      await render(<Cascader options={data.areaList} visible={true} value="110000" theme="tab" />);
      expect(document.querySelectorAll(`${name}__options`).length).toBe(1);
      expect(document.querySelectorAll(`.${prefix}-radio`).length).toBe(2);
    });

    it(': value', async () => {
      await render(<Cascader options={data.areaList} visible={true} value="110114" />);
      expect(document.querySelector(`${name}__step-label--active`).innerHTML).toBe('昌平区');
    });

    it(': placeholder', async () => {
      const placeholder = '请选择';
      await render(<Cascader options={data.areaList} placeholder={placeholder} visible={true} />);
      expect(document.querySelector(`${name}__step-label--active`).innerHTML).toBe(placeholder);
    });

    it(': placeholder - global config fallback', async () => {
      const placeholder = '全局占位';
      await render(
        <ConfigProvider globalConfig={{ cascader: { placeholder } }}>
          <Cascader options={data.areaList} visible={true} />
        </ConfigProvider>,
      );
      expect(document.querySelector(`${name}__step-label--active`).innerHTML).toBe(placeholder);
    });

    it(': placeholder - prop has higher priority', async () => {
      const placeholder = '组件占位';
      await render(
        <ConfigProvider globalConfig={{ cascader: { placeholder: '全局占位' } }}>
          <Cascader options={data.areaList} placeholder={placeholder} visible={true} />
        </ConfigProvider>,
      );
      expect(document.querySelector(`${name}__step-label--active`).innerHTML).toBe(placeholder);
    });

    it(': theme - step', async () => {
      await render(<Cascader options={data.areaList} visible={true} value="110000" theme="step" />);
      expect(document.querySelector(`${name}__steps`)).toBeTruthy();
    });

    it(': subTitles', async () => {
      const subTitles = ['一级', '二级', '三级'];
      await render(<Cascader options={data.areaList} subTitles={subTitles} visible={true} theme="tab" />);
      expect(document.querySelector(`${name}__options-title`).innerHTML).toBe(subTitles[0]);
    });

    it(': checkStrictly', async () => {
      const onChange = vi.fn();
      const { rerender } = await render(
        <Cascader
          options={data.areaList}
          onChange={onChange}
          closeBtn={<span style={{ color: '#0052d9' }}>确定</span>}
          checkStrictly={true}
          visible={true}
          value="110000"
        />,
      );
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[0]);
      fireEvent.click(document.querySelector(`${name}__close-btn`));
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith('110000', [{ value: '110000', label: '北京市' }]);

      rerender(
        <Cascader
          options={[
            {
              label: '',
              value: '',
            },
          ]}
          onChange={onChange}
          closeBtn={<span style={{ color: '#0052d9' }}>确定</span>}
          checkStrictly={true}
          visible={true}
          value="110000"
        />,
      );
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[0]);
      expect(onChange).toHaveBeenCalledWith('', [{ value: '', label: '' }]);
    });

    it(': load', async () => {
      const option = { value: '110000', label: '北京市', children: true, extra: 'parent' };
      const children = [
        { value: '110001', label: '朝阳门街道', children: [] },
        { value: '110002', label: '建国门街道', children: [] },
      ];
      let resolveLoad: (loadedChildren: typeof children) => void;
      const load = vi.fn<CascaderProps['load']>(
        () =>
          new Promise<typeof children>((resolve) => {
            resolveLoad = resolve;
          }),
      );
      const onPick = vi.fn();
      const onChange = vi.fn();
      const onClose = vi.fn();

      render(
        <Cascader
          visible
          options={[option]}
          load={load}
          placeholder="请选择"
          onPick={onPick}
          onChange={onChange}
          onClose={onClose}
        />,
      );

      expect(load).not.toHaveBeenCalled();
      fireEvent.click(document.querySelector(`.${prefix}-radio`));
      expect(load).toHaveBeenCalledExactlyOnceWith({ data: option, value: option.value, label: option.label });
      expect(load.mock.calls[0][0].data).toBe(option);
      expect(onPick).toHaveBeenCalledWith({ value: option.value, label: option.label, index: 0, level: 0 });
      expect(onPick.mock.invocationCallOrder[0]).toBeLessThan(load.mock.invocationCallOrder[0]);
      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(1);
      expect(onChange).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();

      await act(async () => {
        resolveLoad(children);
      });

      expect(document.querySelectorAll(`.${prefix}-radio`)).toHaveLength(3);
      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(2);
      expect(document.querySelector(`${name}__options-container`)).toHaveStyle({ transform: 'translateX(-100vw)' });
      expect(document.querySelector(`${name}__step-label--active`)).toHaveTextContent('请选择');
      expect(option.children).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[1]);
      expect(onChange).toHaveBeenCalledExactlyOnceWith('110001', [
        { value: '110000', label: '北京市' },
        { value: '110001', label: '朝阳门街道' },
      ]);
      expect(onClose).toHaveBeenCalledExactlyOnceWith('finish');
    });

    it(': load - empty children opens the next step', async () => {
      const load = vi.fn().mockResolvedValue([]);
      const onChange = vi.fn();
      const onClose = vi.fn();
      render(
        <Cascader
          visible
          options={[{ value: '440300', label: '深圳市', children: true }]}
          load={load}
          placeholder="请选择"
          onChange={onChange}
          onClose={onClose}
        />,
      );

      await act(async () => {
        fireEvent.click(document.querySelector(`.${prefix}-radio`));
      });

      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(2);
      expect(document.querySelectorAll(`${name}__options`)[1].querySelectorAll(`.${prefix}-radio`)).toHaveLength(0);
      expect(document.querySelector(`${name}__step-label--active`)).toHaveTextContent('请选择');
      expect(document.querySelector(`${name}__options-container`)).toHaveStyle({ transform: 'translateX(-100vw)' });
      expect(onChange).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it(': load - rejected promise', async () => {
      const error = new Error('load failed');
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const load = vi.fn().mockRejectedValue(error);
      const onChange = vi.fn();
      const onClose = vi.fn();

      try {
        render(
          <Cascader
            visible
            options={[{ value: '440300', label: '深圳市', children: true }]}
            load={load}
            onChange={onChange}
            onClose={onClose}
          />,
        );
        await act(async () => {
          fireEvent.click(document.querySelector(`.${prefix}-radio`));
        });

        expect(consoleError).toHaveBeenCalledWith('Load children failed:', error);
        expect(document.querySelectorAll(`${name}__options`)).toHaveLength(1);
        expect(onChange).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
      } finally {
        consoleError.mockRestore();
      }
    });

    it(': load - keys and nested lazy children', async () => {
      const option = { code: '440000', name: '广东省', items: true, extra: 'province' };
      const city = { code: '440300', name: '深圳市', items: true, extra: 'city' };
      const district = { code: '440304', name: '福田区', items: [] };
      const load = vi.fn().mockResolvedValueOnce([city]).mockResolvedValueOnce([district]);
      const onChange = vi.fn();
      render(
        <Cascader
          visible
          options={[option]}
          keys={{ value: 'code', label: 'name', children: 'items' }}
          load={load}
          onChange={onChange}
        />,
      );

      await act(async () => {
        fireEvent.click(document.querySelector(`.${prefix}-radio`));
      });
      expect(load).toHaveBeenNthCalledWith(1, { data: option, value: option.code, label: option.name });

      await act(async () => {
        fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[1]);
      });
      expect(load).toHaveBeenNthCalledWith(2, { data: city, value: city.code, label: city.name });
      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(3);
      expect(document.querySelector(`${name}__options-container`)).toHaveStyle({ transform: 'translateX(-200vw)' });
      expect(option.items).toBe(true);
      expect(city.items).toBe(true);

      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[2]);
      expect(onChange).toHaveBeenCalledWith('440304', [
        { code: '440000', name: '广东省' },
        { code: '440300', name: '深圳市' },
        { code: '440304', name: '福田区' },
      ]);
    });

    it(': load - switching branches reloads children without caching', async () => {
      const options = [
        { value: '440000', label: '广东省', children: true },
        { value: '110000', label: '北京市', children: [{ value: '110100', label: '北京市' }] },
      ];
      const load = vi
        .fn()
        .mockResolvedValue([{ value: '440300', label: '深圳市', children: [{ value: '440304', label: '福田区' }] }]);
      render(<Cascader visible options={options} load={load} theme="tab" />);

      await act(async () => {
        fireEvent.click(document.querySelector(`.${prefix}-radio`));
      });
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[2]);
      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(3);

      fireEvent.click(document.querySelector(`.${prefix}-tabs__item`));
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[1]);
      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(2);
      expect(document.querySelectorAll(`.${prefix}-tabs__item`)).toHaveLength(2);
      expect(document.querySelector(`${name}__options-container`)).toHaveStyle({ transform: 'translateX(-100vw)' });

      fireEvent.click(document.querySelector(`.${prefix}-tabs__item`));
      await act(async () => {
        fireEvent.click(document.querySelector(`.${prefix}-radio`));
      });
      expect(load).toHaveBeenCalledTimes(2);
      expect(document.querySelectorAll(`${name}__options`)[1]).toHaveTextContent('深圳市');
      expect(options[0].children).toBe(true);
    });

    it(': close when select leaf item', async () => {
      const onClose = vi.fn();

      await render(
        <Cascader
          visible
          onClose={onClose}
          options={[
            {
              value: '440300',
              label: '深圳市',
              children: [
                {
                  value: '440304',
                  label: '福田区',
                  children: [],
                },
              ],
            },
          ]}
        />,
      );

      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[0]);
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[1]);

      expect(onClose).toHaveBeenCalledWith('finish');
    });

    it(': filterable', async () => {
      const filterableOptions = [
        {
          label: '北京市',
          value: '110000',
          children: [
            {
              label: '北京市',
              value: '110100',
              children: [
                { label: '海淀区', value: '110108' },
                { label: '朝阳区', value: '110105' },
              ],
            },
          ],
        },
        {
          label: '上海市',
          value: '310000',
          children: [{ label: '上海市', value: '310100', children: [{ label: '浦东新区', value: '310115' }] }],
        },
        {
          label: '广东省',
          value: '440000',
          children: [{ label: '珠海市', value: '440400' }],
        },
      ];

      const renderCascader = (overrides = {}) => {
        const props: CascaderProps = {
          visible: true,
          filterable: true,
          options: filterableOptions,
          ...overrides,
        };
        return render(<Cascader {...props} />);
      };

      const typeInSearch = (value: string) => {
        const searchInput = document.querySelector('.t-search input') as HTMLInputElement;
        fireEvent.input(searchInput, { target: { value } });
      };

      // renders search input
      renderCascader();
      expect(document.querySelector('.t-search')).toBeTruthy();

      // default filter matches full-path label
      typeInSearch('海');
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      const results = document.querySelectorAll(`${name}__filter-result-item`);
      expect(results.length).toBeGreaterThan(0);

      // shows empty state when no match
      typeInSearch('xxxxx');
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(document.querySelector(`${name}__filter-empty`)).toBeTruthy();
    });

    it(': filterable - custom filter function', async () => {
      const filterableOptions = [
        {
          label: '北京市',
          value: '110000',
          children: [
            {
              label: '北京市',
              value: '110100',
              children: [{ label: '海淀区', value: '110108' }],
            },
          ],
        },
        {
          label: '上海市',
          value: '310000',
          children: [{ label: '上海市', value: '310100', children: [{ label: '浦东新区', value: '310115' }] }],
        },
      ];

      const customFilter = vi.fn((keyword: string, option: any) => option.label === keyword);
      render(<Cascader visible filterable options={filterableOptions} filter={customFilter} />);

      const searchInput = document.querySelector('.t-search input') as HTMLInputElement;
      fireEvent.input(searchInput, { target: { value: '浦东新区' } });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(customFilter).toHaveBeenCalled();
    });

    it(': filterable - selecting result closes cascader', async () => {
      const filterableOptions = [
        {
          label: '北京市',
          value: '110000',
          children: [
            {
              label: '北京市',
              value: '110100',
              children: [{ label: '海淀区', value: '110108' }],
            },
          ],
        },
      ];

      const onChange = vi.fn();
      const onClose = vi.fn();
      render(<Cascader visible filterable options={filterableOptions} onChange={onChange} onClose={onClose} />);

      const searchInput = document.querySelector('.t-search input') as HTMLInputElement;
      fireEvent.input(searchInput, { target: { value: '海淀' } });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      const resultItem = document.querySelector(`${name}__filter-result-item`);
      expect(resultItem).toBeTruthy();

      fireEvent.click(resultItem);
      expect(onChange).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledWith('finish');
    });

    it(': filterable - checkStrictly matches parent nodes', async () => {
      const filterableOptions = [
        {
          label: '广东省',
          value: '440000',
          children: [
            {
              label: '深圳市',
              value: '440300',
              children: [{ label: '福田区', value: '440304' }],
            },
          ],
        },
      ];

      const onChange = vi.fn();
      const onClose = vi.fn();
      const { rerender } = await render(
        <Cascader visible filterable checkStrictly options={filterableOptions} onChange={onChange} onClose={onClose} />,
      );

      const typeInSearch = (value: string) => {
        const searchInput = document.querySelector('.t-search input') as HTMLInputElement;
        fireEvent.input(searchInput, { target: { value } });
      };

      // checkStrictly 下父节点“深圳市”与叶子“福田区”路径均含“深圳”，均可命中
      typeInSearch('深圳');
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      const results = document.querySelectorAll(`${name}__filter-result-item`);
      expect(results.length).toBe(2);

      // 点击中间父节点结果，selectedOptions 返回从根到该节点的完整路径（与非搜索态一致）
      fireEvent.click(results[0]);
      expect(onChange).toHaveBeenCalledWith('440300', [
        { label: '广东省', value: '440000' },
        { label: '深圳市', value: '440300' },
      ]);
      expect(onClose).toHaveBeenCalledWith('finish');

      // 非 checkStrictly 下仅叶子节点命中，父节点被排除
      rerender(<Cascader visible filterable checkStrictly={false} options={filterableOptions} />);
      typeInSearch('深圳');
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      const leafOnlyResults = document.querySelectorAll(`${name}__filter-result-item`);
      expect(leafOnlyResults.length).toBe(1);
    });

    it(': filterable - selecting lazy node triggers load and exits search', async () => {
      const option = { value: '440000', label: '广东省', children: true };
      const children = [
        { value: '440300', label: '深圳市', children: [] },
        { value: '440400', label: '珠海市', children: [] },
      ];
      const load = vi.fn().mockResolvedValue(children);
      const onPick = vi.fn();
      const onChange = vi.fn();
      const onClose = vi.fn();

      render(
        <Cascader
          visible
          filterable
          options={[option]}
          load={load}
          onPick={onPick}
          onChange={onChange}
          onClose={onClose}
        />,
      );

      const searchInput = document.querySelector('.t-search input') as HTMLInputElement;
      fireEvent.input(searchInput, { target: { value: '广东' } });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      const resultItem = document.querySelector(`${name}__filter-result-item`);
      expect(resultItem).toBeTruthy();

      await act(async () => {
        fireEvent.click(resultItem);
      });

      expect(onPick).toHaveBeenCalledWith({ value: '440000', label: '广东省', index: 0, level: 0 });
      expect(load).toHaveBeenCalledWith({ data: option, value: option.value, label: option.label });
      // 加载完成后退出搜索态，展示加载出的子级
      expect(document.querySelector(`${name}__filter-result`)).toBeNull();
      expect(document.querySelectorAll(`${name}__options`)).toHaveLength(2);
      expect(onChange).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it(': lazy demo unlocks after loading and allows selection', async () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { container } = render(<LoadDemo />);

    try {
      fireEvent.click(container.querySelector('.t-cell'));
      await act(async () => {
        fireEvent.click(document.querySelector('.t-radio'));
      });
      expect(document.body).toHaveClass('t-toast--lock', 't-popup--lock', 't-overlay--lock');

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(document.querySelector('.t-toast')).toBeNull();
      expect(document.body).not.toHaveClass('t-toast--lock');
      expect(document.body).toHaveClass('t-popup--lock', 't-overlay--lock');
      const childOptions = document.querySelectorAll(`${name}__options`)[1];
      expect(childOptions).toHaveTextContent('福田区');
      fireEvent.click(childOptions.querySelector('.t-radio'));
      expect(container.querySelector('.t-cell')).toHaveTextContent('深圳市/福田区');
      expect(document.body).not.toHaveClass('t-popup--lock');
      expect(document.body).not.toHaveClass('t-overlay--lock');
    } finally {
      await act(async () => {
        Toast.clear();
      });
      consoleLog.mockRestore();
    }
  });

  describe('events', () => {
    it(': onChange', async () => {
      const onChange = vi.fn();
      const { rerender } = await render(
        <Cascader options={data.areaList} onChange={onChange} visible={true} value="110114" />,
      );
      fireEvent.click(document.querySelectorAll(`${name}__step`)[1]);
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[6]);
      expect(onChange).toHaveBeenCalled();

      rerender(<Cascader options={data.areaList} onChange={onChange} visible={true} value="110114" theme="tab" />);
      fireEvent.click(document.querySelectorAll(`.${prefix}-tabs__item`)[1]);
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[2]);
      fireEvent.click(document.querySelectorAll(`.${prefix}-tabs__item`)[2]);
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[4]);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it(': onPick', async () => {
      const onPick = vi.fn();
      await render(<Cascader options={data.areaList} onPick={onPick} visible={true} value="110000" theme="tab" />);
      fireEvent.click(document.querySelectorAll(`.${prefix}-radio`)[1]);
      expect(onPick).toHaveBeenCalled();
    });

    it(': onClose', async () => {
      const onClose = vi.fn();
      await render(<Cascader options={data.areaList} onClose={onClose} visible={true} value="110000" theme="tab" />);
      fireEvent.click(document.querySelector(`.${prefix}-icon-close`));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
