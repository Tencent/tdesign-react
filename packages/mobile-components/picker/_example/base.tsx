import React, { useMemo, useState } from 'react';
import { Popup, Picker, Cell, PickerValue, PickerContext } from 'tdesign-mobile-react';

const generateCityOptions = () => [
  {
    label: '北京市',
    value: '北京市',
  },
  {
    label: '上海市',
    value: '上海市',
    disabled: true,
  },
  {
    label: '广州市',
    value: '广州市',
  },
  {
    label: '深圳市',
    value: '深圳市',
  },
  {
    label: '杭州市',
    value: '杭州市',
  },
  {
    label: '成都市',
    value: '成都市',
  },
  {
    label: '长沙市',
    value: '长沙市',
  },
];

const generateSeasonOptions = () => {
  const currentYear = Number(new Date().getFullYear());
  return [
    Array.from(new Array(10), (_, index) => ({
      label: `${currentYear - index}`,
      value: `${currentYear - index}`,
    })),
    [
      {
        label: '春',
        value: '春',
      },
      {
        label: '夏',
        value: '夏',
      },
      {
        label: '秋',
        value: '秋',
      },
      {
        label: '冬',
        value: '冬',
      },
    ],
  ];
};

// const option = (item: PickerColumnItem, index: number) => item.label;

// const currentYear = Number(new Date().getFullYear());
// const yearOptions = Array.from(new Array(10), (_, index) => ({
// label: currentYear - index,
// value: `${currentYear - index}`,
// }));

export default function Base() {
  const [cityVisible, setCityVisible] = useState(false);
  const [seasonVisible, setSeasonVisible] = useState(false);

  const [city, setCity] = useState<PickerValue[]>([]);

  const [season, setSeason] = useState<PickerValue[]>([]);

  const cityOptions = useMemo(() => generateCityOptions(), []);
  const cityNote = useMemo(() => city.join(' '), [city]);

  const seasonOptions = useMemo(() => generateSeasonOptions(), []);
  const seasonNote = useMemo(() => season.join(' '), [season]);

  function onCancel() {
    setCityVisible(false);
    setSeasonVisible(false);
  }

  function onConfirm(val: string[], context: { index: number[] }) {
    console.log(val);
    console.log('context', context);
    setCityVisible(false);
    setSeasonVisible(false);
  }

  function handleOnPick(value: PickerValue[], context: PickerContext) {
    console.log('value', value);
    console.log('context', context);
  }

  return (
    <>
      <Cell arrow title="选择地区" note={cityNote} onClick={() => setCityVisible(true)} />
      <Popup visible={cityVisible} onClose={onCancel} placement="bottom">
        <Picker
          columns={cityOptions}
          onPick={handleOnPick}
          onConfirm={onConfirm}
          onCancel={onCancel}
          value={city}
          onChange={setCity}
        />
      </Popup>
      <Cell arrow title="选择季节" note={seasonNote} onClick={() => setSeasonVisible(true)} />
      <Popup visible={seasonVisible} onClose={onCancel} placement="bottom">
        <Picker
          columns={seasonOptions}
          onPick={handleOnPick}
          onConfirm={onConfirm}
          onCancel={onCancel}
          value={season}
          onChange={setSeason}
        />
      </Popup>
    </>
  );
}
