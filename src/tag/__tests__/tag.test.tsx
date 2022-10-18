import React, { useState } from 'react';
import { render, fireEvent, vi } from '@test/utils';
import { DiscountIcon, AddIcon } from 'tdesign-icons-react';
import Tag from '../Tag';
import CheckTag from '../CheckTag';
import Space from '../../space';
import Input from '../../input';

function ClosableTag() {
  const [inputVisible, toggleInputVisible] = useState(false);
  const [tagList, setTagList] = useState([
    {
      name: '可删除标签',
      showClose: true,
    },
    {
      name: '可删除标签',
      icon: <DiscountIcon />,
      showClose: true,
    },
    {
      name: '可删除标签',
      showClose: true,
      disabled: true,
    },
  ]);

  /**
   * @param {number} i
   */
  const deleteTag = (i) => {
    const newtagList = [...tagList];
    newtagList.splice(i, 1);
    setTagList(newtagList);
  };

  const handleClickAdd = () => {
    toggleInputVisible(true);
  };

  const handleInputEnter = (value) => {
    toggleInputVisible(false);
    if (value) setTagList((currentList) => currentList.concat([{ name: value, showClose: true }]));
  };

  return (
    <Space direction="vertical">
      <Space>
        {tagList.map((tag, i) => (
          <Tag
            key={i}
            closable
            onClose={() => {
              deleteTag(i);
            }}
            icon={tag.icon}
            disabled={tag.disabled}
            style={{ marginRight: 30 }}
          >
            {tag.name}
            {i}
          </Tag>
        ))}
      </Space>
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        {inputVisible ? (
          <Input onBlur={handleInputEnter} onEnter={handleInputEnter} style={{ width: '94px' }} />
        ) : (
          <Tag onClick={handleClickAdd}>
            <AddIcon />
            可添加标签
          </Tag>
        )}
      </div>
    </Space>
  );
}

describe('Tag 组件测试', () => {
  test('closable and onClose', async () => {
    const tagRegExp = /可删除标签/;

    const { queryAllByText, container } = render(<ClosableTag></ClosableTag>);
    // 点击i标签后，关闭一个，3个变2个
    expect(queryAllByText(tagRegExp).length).toEqual(3);
    fireEvent.click(container.querySelector('.t-tag').querySelector('.t-icon-close'));
    expect(queryAllByText(tagRegExp).length).toEqual(2);
  });

  test('content', async () => {
    const { queryByText } = render(<Tag maxWidth={200} content="内容" />);
    expect(queryByText('内容')).toBeInTheDocument();
  });

  test('disabled', async () => {
    const fn = vi.fn();
    const wrapper = render(<Tag disabled={true} onClick={fn}></Tag>);
    expect(wrapper).toMatchSnapshot();
    fireEvent.click(wrapper.container.firstChild);
    expect(fn).toBeCalledTimes(0);
  });

  test('icon', async () => {
    const wrapper = render(<Tag icon={<DiscountIcon />}></Tag>);
    expect(wrapper).toMatchSnapshot();
  });

  test('maxWidth', async () => {
    const { container } = render(<Tag maxWidth={'150px'}>默认超八个字超长文本标签超长省略文本标签</Tag>);
    expect(container.firstChild).toHaveStyle('max-width: 150px');
  });

  test('shape:square', async () => {
    const { container } = render(<Tag shape="square"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--square')).toBeTruthy();
  });

  test('shape:round', async () => {
    const { container } = render(<Tag shape="round"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--round')).toBeTruthy();
  });

  test('shape:mark', async () => {
    const { container } = render(<Tag shape="mark"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--mark')).toBeTruthy();
  });

  test('size:small', async () => {
    const { container } = render(<Tag size="small"></Tag>);
    expect(container.firstChild.classList.contains('t-size-s')).toBeTruthy();
  });

  test('size:medium', async () => {
    const { container } = render(<Tag size="medium"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--medium')).toBeTruthy();
  });

  test('size:large', async () => {
    const { container } = render(<Tag size="large"></Tag>);
    expect(container.firstChild.classList.contains('t-size-l')).toBeTruthy();
  });

  test('theme:default', async () => {
    const { container } = render(<Tag theme="default"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--default')).toBeTruthy();
  });

  test('theme:danger', async () => {
    const { container } = render(<Tag theme="danger"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--danger')).toBeTruthy();
  });

  test('theme:primary', async () => {
    const { container } = render(<Tag theme="primary"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--primary')).toBeTruthy();
  });

  test('theme:success', async () => {
    const { container } = render(<Tag theme="success"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--success')).toBeTruthy();
  });

  test('theme:warning', async () => {
    const { container } = render(<Tag theme="warning"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--warning')).toBeTruthy();
  });

  test('variant:dark', async () => {
    const { container } = render(<Tag variant="dark"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--dark')).toBeTruthy();
  });

  test('variant:light', async () => {
    const { container } = render(<Tag variant="light"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--light')).toBeTruthy();
  });

  test('variant:plain', async () => {
    const { container } = render(<Tag variant="plain"></Tag>);
    expect(container.firstChild.classList.contains('t-tag--plain')).toBeTruthy();
  });

  test('onClick', async () => {
    const fn = vi.fn();
    const wrapper = render(<Tag onClick={fn}></Tag>);
    fireEvent.click(wrapper.container.firstChild);
    expect(fn).toHaveBeenCalled();
  });
});

describe('CheckTag 组件测试', () => {
  test('checked & defaultChecked', () => {
    const wrapper = render(<CheckTag checked={true} defaultChecked={true}></CheckTag>);
    expect(wrapper.container.firstChild.classList.contains('t-tag--checked')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  test('content', () => {
    const { container, queryByText } = render(<CheckTag content="内容"></CheckTag>);
    expect(queryByText('内容')).toBeInTheDocument();
    expect(container.firstChild.classList.contains('t-tag--check')).toBeTruthy();
  });

  test('disabled', () => {
    const fn = vi.fn();
    const wrapper = render(<CheckTag onClick={fn} disabled={true}></CheckTag>);
    fireEvent.click(wrapper.container.firstChild);
    expect(fn).toBeCalledTimes(0);
  });

  test('onChange', () => {
    const fn = vi.fn();
    const wrapper = render(<CheckTag content="内容" onChange={fn}></CheckTag>);
    fireEvent.click(wrapper.container.firstChild);
    expect(fn).toHaveBeenCalled();
  });

  test('onClick', () => {
    const fn = vi.fn();
    const wrapper = render(<CheckTag onClick={fn}></CheckTag>);
    fireEvent.click(wrapper.container.firstChild);
    expect(fn).toHaveBeenCalled();
  });
});
