import React, { useState } from 'react';
import { Cell, Popup, Picker } from 'tdesign-mobile-react';

const options = [
  [
    {
      label: '北京市',
      value: '北京市',
    },
    {
      label: '上海市',
      value: '上海市',
    },
    {
      label: '广州市',
      value: '广州市',
    },
    {
      label: '深圳市',
      value: '深圳市',
    },
  ],
];

const AreaPicker: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [area] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [areaText, setAreaText] = useState('');

  const onConfirm = (val: string[], context: { label: string[] }) => {
    const { label } = context;
    setAreaText(label.join(' '));
    setVisible(false);
  };

  const onShowPicker = (showTitle) => {
    setVisible(true);
    setTitle(showTitle ? '选择城市' : '');
  };

  return (
    <>
      <Cell arrow title="自定义高度选择器" note={areaText} onClick={() => onShowPicker(false)} />
      <Popup
        visible={visible}
        placement="bottom"
        onClose={() => setVisible(false)}
        className="picker-custom-height-demo"
      >
        <Picker title={title} value={area} columns={options} onConfirm={onConfirm} onCancel={() => setVisible(false)} />
      </Popup>
    </>
  );
};

export default AreaPicker;
