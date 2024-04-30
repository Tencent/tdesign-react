import React, { useState } from 'react';
import { Space, Tag } from 'tdesign-react';

const { CheckTagGroup } = Tag;

const options = [
  { label: '标签1', value: 1 },
  { label: '标签2', value: 2 },
  { label: <span>标签3</span>, value: 3 },
  { label: '标签4', value: 4 },
  { label: '标签5', value: '5' },
  { label: '标签6', value: 6 },
];

const avatarStyle = {
  width: '16px',
  height: '16px',
  borderRadius: '2px',
  verticalAlign: '-4px',
  marginRight: '4px',
};

function CustomTag(option) {
  return (
    <div>
      <img src={option.avatar} style={avatarStyle} />
      <span>
        {option.label}({option.value})
      </span>
    </div>
  );
}

const AVATAR = 'https://tdesign.gtimg.com/site/avatar.jpg';
const options2 = [
  { label: 'TAG_A', value: 1, avatar: AVATAR },
  { label: 'TAG_B', value: 2, avatar: AVATAR },
  { label: 'TAG_C', value: 3, avatar: AVATAR },
  { label: 'TAG_D', value: 4, avatar: AVATAR },
  { label: 'TAG_E', value: '5', avatar: AVATAR },
  { label: 'TAG_F', value: 6, avatar: AVATAR },
].map((option) => ({ ...option, label: <CustomTag {...option} /> }));

const STYLE_B_UNCHECKED_PROPS = {
  theme: 'default',
  variant: 'outline',
};

const STYLE_C_CHECKED_PROPS = {
  theme: 'primary',
  variant: 'outline',
};

const CheckTagGroupDemo = () => {
  const [checkTagValue1, setCheckTagValue1] = useState([1]);
  const [checkTagValue2, setCheckTagValue2] = useState([2]);
  const [checkTagValue3, setCheckTagValue3] = useState([3]);
  const [checkTagValue4, setCheckTagValue4] = useState([4, 6]);

  return (
    <Space direction="vertical">
      <Space>
        <label>StyleA</label>
        <CheckTagGroup value={checkTagValue1} onChange={setCheckTagValue1} options={options} />
      </Space>

      <Space>
        <label>StyleB</label>
        <CheckTagGroup
          value={checkTagValue2}
          onChange={setCheckTagValue2}
          options={options}
          uncheckedProps={STYLE_B_UNCHECKED_PROPS}
        />
      </Space>

      <Space>
        <label>StyleC</label>
        <CheckTagGroup
          value={checkTagValue3}
          onChange={setCheckTagValue3}
          options={options}
          checkedProps={STYLE_C_CHECKED_PROPS}
          uncheckedProps={STYLE_B_UNCHECKED_PROPS}
        />
      </Space>

      <Space>
        <label>CustomContent</label>
        <CheckTagGroup
          value={checkTagValue4}
          onChange={setCheckTagValue4}
          options={options2}
          checkedProps={STYLE_C_CHECKED_PROPS}
          uncheckedProps={STYLE_B_UNCHECKED_PROPS}
        />
      </Space>
    </Space>
  );
};

export default CheckTagGroupDemo;
