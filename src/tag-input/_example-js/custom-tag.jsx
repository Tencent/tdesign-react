import React, { useState } from 'react';
import { TagInput, Tag, Space } from 'tdesign-react';

export default function CustomTagExample() {
  const [tags, setTags] = useState(['StudentA', 'StudentB', 'StudentC']);
  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      {/* 方式一：使用 tag 定义标签内部内容  */}
      <TagInput
        value={tags}
        onChange={setTags}
        clearable
        minCollapsedNum={2}
        tag={({ value }) => (
          <span>
            <img
              src="https://tdesign.gtimg.com/site/avatar.jpg"
              style={{ maxWidth: '18px', maxHeight: '18px', borderRadius: '50%', verticalAlign: 'text-top' }}
            />
            {value}
          </span>
        )}
      ></TagInput>

      <br />
      <br />

      {/* 方式二：使用 valueDisplay 定义全部内容 */}
      <TagInput
        value={tags}
        onChange={setTags}
        valueDisplay={({ value, onClose }) =>
          value.map((item, index) => (
            <Tag key={item} closable style={{ marginRight: '4px' }} onClose={() => onClose(index)}>
              <div>
                <img
                  src="https://tdesign.gtimg.com/site/avatar.jpg"
                  style={{ maxWidth: '18px', maxHeight: '18px', borderRadius: '50%', verticalAlign: 'text-top' }}
                />
                {item}
              </div>
            </Tag>
          ))
        }
        clearable
      ></TagInput>
    </Space>
  );
}
