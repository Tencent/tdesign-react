import { cloneDeep, noop } from 'lodash-es';
import React, { useRef, useState } from 'react';
import { Button, Checkbox, DropdownItem, DropdownMenu } from 'tdesign-mobile-react';
import CheckboxGroup from 'tdesign-mobile-react/checkbox/CheckboxGroup';

const chineseNumber = '一二三四五六七八九十'.split('');

const options1 = new Array(8).fill(null).map((_, i) => ({
  label: `类型${chineseNumber[i]}`,
  value: `type_${i + 1}`,
  disabled: false,
}));

const options2 = new Array(8).fill(null).map((_, i) => ({
  label: `角色${chineseNumber[i]}`,
  value: `role_${i + 1}`,
  disabled: false,
}));

const groups = [
  {
    label: '类型',
    options: [
      ...options1,
      {
        label: '禁用选项',
        value: 'disabled',
        disabled: true,
      },
    ],
  },
  {
    label: '角色',
    options: [
      ...options2,
      {
        label: '禁用选项',
        value: 'disabled',
        disabled: true,
      },
    ],
  },
];

export default function CustomizedDemo() {
  const [checkSelectGroup, setCheckSelectGroup] = useState<string[][]>([['type_1', 'type_2'], ['role_2']]);

  const ref = useRef({ collapseMenu: noop });
  return (
    <DropdownMenu ref={ref}>
      <DropdownItem
        footer={
          <div className="demo-dropdown-item_footer">
            <Button
              size="large"
              theme="light"
              onClick={() => {
                setCheckSelectGroup([[], []]);
              }}
            >
              重置
            </Button>
            <Button
              size="large"
              theme="primary"
              onClick={() => {
                ref.current.collapseMenu();
              }}
            >
              确定
            </Button>
          </div>
        }
        label="三列多选"
        multiple
        optionsColumns="1"
      >
        {groups.map((group, groupIndex) => (
          <>
            <div className="demo-dropdown-item_label" key={`dropdown-${groupIndex}`}>
              {group.label}
            </div>
            <CheckboxGroup
              className="t-dropdown-item__checkbox-group"
              style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
              value={checkSelectGroup[groupIndex] || []}
              onChange={(value: string[]) => {
                const newValue = cloneDeep(checkSelectGroup);
                newValue[groupIndex] = value;
                setCheckSelectGroup(newValue);
              }}
            >
              {group.options.map((item, index) => (
                <Checkbox
                  className="t-dropdown-item__checkbox-item t-checkbox--tag"
                  key={`${item.value}-${index}`}
                  icon={false}
                  borderless
                  label={item.label}
                  value={item.value}
                  disabled={item.disabled}
                />
              ))}
            </CheckboxGroup>
          </>
        ))}
      </DropdownItem>
    </DropdownMenu>
  );
}
