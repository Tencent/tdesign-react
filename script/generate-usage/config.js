module.exports = {
  button: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Button } from 'tdesign-react';\n`,
    usageStr: `const renderComp = <Button {...changedProps}>确定</Button>;`,
  },
  divider: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Divider } from 'tdesign-react';\n`,
    usageStr: `
    const renderComp = (
      <div style={{ width: 200 }}>
        <span>正直</span>
        <Divider {...changedProps}>TDesign</Divider>
        <span>进取</span>
        <Divider {...changedProps}>TDesign</Divider>
        <span>合作</span>
        <Divider {...changedProps}>TDesign</Divider>
        <span>创新</span>
      </div>
    )`,
  },
  alert: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Alert } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = { message: '这是一条信息' };\n
      const renderComp = <Alert {...defaultProps} {...changedProps} />;
    `,
  },
  anchor: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Anchor } from 'tdesign-react';\n`,
    usageStr: `
      const renderComp = (
        <Anchor {...changedProps}>
          <Anchor.AnchorItem href="#锚点一" title="基础锚点" />
          <Anchor.AnchorItem href="#锚点二" title="多级锚点" />
          <Anchor.AnchorItem href="#锚点三" title="指定容器锚点" />
        </Anchor>
      );
    `,
  },
  calendar: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Calendar } from 'tdesign-react';\n`,
    usageStr: `const renderComp = <Calendar {...changedProps} />;`,
  },
  'date-picker': {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { DatePicker } from 'tdesign-react';\n`,
    usageStr: `const renderComp = <DatePicker {...changedProps} />;`,
  },
  dropdown: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Dropdown, Button } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = { options: [{ content: '操作一', value: 1 }, { content: '操作二', value: 2 }]};
      const renderComp = (
        <Dropdown {...defaultProps} {...changedProps}>
          <Button>更多...</Button>
        </Dropdown>
      );`,
  },
  menu: {
    configStr: `import configList from './props.json';\n`,
    importStr: `
      import { Menu } from 'tdesign-react';\n
      import { CodeIcon, AppIcon, FileIcon } from 'tdesign-icons-react';\n
    `,
    usageStr: `
      const defaultProps = {
        style: { marginBottom: 20 },
        logo: <img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" />,
      };
      const renderComp = (
        <div style={{ padding: 24, background: 'var(--bg-color-page)', borderRadius: 3 }}>
          <Menu.HeadMenu {...defaultProps} {...changedProps}>
            <Menu.MenuItem value='0'>
              <span>菜单1</span>
            </Menu.MenuItem>
            <Menu.MenuItem value='1'>
              <span>菜单2</span>
            </Menu.MenuItem>
          </Menu.HeadMenu>

          <Menu {...changedProps}>
            <Menu.MenuItem value="0" icon={<AppIcon />}>
              仪表盘
            </Menu.MenuItem>
            <Menu.SubMenu value="1" title={<span>资源列表</span>} icon={<CodeIcon />}>
              <Menu.MenuItem value="1-1" disabled>
                <span>菜单二</span>
              </Menu.MenuItem>
            </Menu.SubMenu>
            <Menu.SubMenu value="2" title={<span>调度平台</span>} icon={<FileIcon />}>
              <Menu.SubMenu value="2-1" title="二级菜单-1">
                <Menu.MenuItem value="3-1">三级菜单-1</Menu.MenuItem>
                <Menu.MenuItem value="3-2">三级菜单-2</Menu.MenuItem>
                <Menu.MenuItem value="3-3">三级菜单-3</Menu.MenuItem>
              </Menu.SubMenu>
              <Menu.MenuItem value="2-2">
                <span>二级菜单-2</span>
              </Menu.MenuItem>
            </Menu.SubMenu>
          </Menu>
        </div>
      );`,
  },
  pagination: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Pagination } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { total: 30 };
    const renderComp = (
      <div>
        <Pagination {...defaultProps} {...changedProps} />
      </div>
    );`,
  },
  steps: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Steps } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { current: 1 };
    const renderComp = (
      <Steps {...defaultProps} {...changedProps}>
        <Steps.StepItem title="步骤1" content="提示文字" />
        <Steps.StepItem title="步骤2" content="提示文字" />
        <Steps.StepItem title="步骤3" content="提示文字" />
      </Steps>
    );`,
  },
  tabs: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Tabs } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { defaultValue: '1' };
    const renderComp = (
      <div style={{ padding: 24, background: 'var(--bg-color-page)', borderRadius: 3 }}>
        <Tabs {...defaultProps} {...changedProps}>
          <Tabs.TabPanel value="1" label="选项卡1">
            <div style={{ margin: 20 }}>
              选项卡1内容区
            </div>
          </Tabs.TabPanel>
          <Tabs.TabPanel value="2" label="选项卡2">
            <div style={{ margin: 20 }}>
              选项卡2内容区
            </div>
          </Tabs.TabPanel>
          <Tabs.TabPanel value="3" label="选项卡3">
            <div style={{ margin: 20 }}>
              选项卡3内容区
            </div>
          </Tabs.TabPanel>
        </Tabs>
      </div>
    );`,
  },
  cascader: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Cascader } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { options: [
      {
        label: '选项一',
        value: '1',
        children: [
          { label: '子选项一', value: '1.1' },
          { label: '子选项二', value: '1.2' },
        ],
      },
      {
        label: '选项二',
        value: '2',
        children: [
          { label: '子选项一', value: '2.1' },
          { label: '子选项二', value: '2.2' },
        ],
      },
    ] };
    const renderComp = <Cascader {...defaultProps} {...changedProps} />;`,
  },
  checkbox: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Checkbox } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = {};
    const renderComp = (<Checkbox {...defaultProps} {...changedProps}>基础多选框</Checkbox>);`,
  },
  form: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Form, Input, Checkbox } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = {};
    const renderComp = (
      <Form {...defaultProps} {...changedProps}>
        <Form.FormItem label="姓名" name="name" initialData="TDesign">
          <Input placeholder="请输入内容" />
        </Form.FormItem>
        <Form.FormItem label="手机号码" name="tel" initialData="123456">
          <Input placeholder="请输入内容" />
        </Form.FormItem>
        <Form.FormItem label="课程" name="course" initialData={['1']}>
          <Checkbox.Group>
            <Checkbox value="1">语文</Checkbox>
            <Checkbox value="2">数学</Checkbox>
            <Checkbox value="3">英语</Checkbox>
            <Checkbox value="4">体育</Checkbox>
          </Checkbox.Group>
        </Form.FormItem>
      </Form>
    );`,
  },
  input: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Input } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<Input {...changedProps} />);`,
  },
  'input-number': {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { InputNumber } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<InputNumber {...changedProps} />);`,
  },
  radio: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Radio } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<Radio {...changedProps}>单选框</Radio>);`,
  },
  select: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Select } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (
      <Select {...changedProps}>
        <Select.Option key="apple" label="Apple" value="apple" />
        <Select.Option key="orange" value="orange">Orange</Select.Option>
        <Select.Option key="banana" label="Banana" value="banana" />
      </Select>
    );`,
  },
  'select-input': {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { SelectInput } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { panel: <div>暂无数据</div>, tips: '这是 tips 文本信息' };
    const renderComp = (<SelectInput {...defaultProps} {...changedProps} />);`,
  },
  slider: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Slider } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<Slider {...defaultProps} {...changedProps} />);`,
  },
  switch: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Switch } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<Switch {...changedProps} />);`,
  },
  'tag-input': {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { TagInput } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<TagInput {...changedProps} />);`,
  },
  textarea: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Textarea } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { placeholder: '请输入内容' };
    const renderComp = (<Textarea {...defaultProps} {...changedProps} />);`,
  },
  'tree-select': {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { TreeSelect } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = {
      data: [{
        label: '广东省',
        value: 'guangdong',
        children: [{
          label: '广州市',
          value: 'guangzhou',
        }, {
          label: '深圳市',
          value: 'shenzhen',
        }],
      }, {
        label: '江苏省',
        value: 'jiangsu',
        children: [{
          label: '南京市',
          value: 'nanjing',
        }, {
          label: '苏州市',
          value: 'suzhou',
        }],
      }]
    };
    const renderComp = (<TreeSelect {...defaultProps} {...changedProps} />);`,
  },
  transfer: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Transfer } from 'tdesign-react';\n`,
    usageStr: `
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        value: i.toString(),
        label: '内容' + i,
        disabled: i % 4 < 1,
      });
    }
    const defaultProps = { data };
    const renderComp = (<Transfer {...defaultProps} {...changedProps} />);`,
  },
  'time-picker': {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { TimePicker } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<TimePicker {...defaultProps} {...changedProps} />);`,
  },
  upload: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Upload } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { action: 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo' };
    const renderComp = (<Upload {...defaultProps} {...changedProps} />);`,
  },
  avatar: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Avatar } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { image: 'https://tdesign.gtimg.com/site/avatar.jpg' };
    const renderComp = (<Avatar {...defaultProps} {...changedProps} />);`,
  },
  badge: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Badge, Button } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { count: 100 };
    const renderComp = (
      <Badge {...defaultProps} {...changedProps}>
        <Button>按钮</Button>  
      </Badge>
    );`,
  },
  list: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { List } from 'tdesign-react';\n`,
    usageStr: `
    const avatarUrl = 'https://tdesign.gtimg.com/list-icon.png';
    const listData = [
      { id: 1, content: '列表内容列表内容列表内容' },
      { id: 2, content: '列表内容列表内容列表内容' },
      { id: 3, content: '列表内容列表内容列表内容' },
    ];
    const renderComp = (
      <List {...changedProps}>
        {listData.map((item) => (
          <List.ListItem key={item.id}>
            <List.ListItemMeta image={avatarUrl} title="列表主内容" description="列表内容列表内容列表内容" />
          </List.ListItem>
        ))}
      </List>
    )`,
  },
  loading: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Loading } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = {};
    const renderComp = (
      <Loading {...defaultProps} {...changedProps} />
    );`,
  },
  progress: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Progress } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { percentage: 50 };
    const renderComp = (
      <div style={{ width: 200 }}>
        <Progress {...defaultProps} {...changedProps} />
      </div>
    );`,
  },
  swiper: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Swiper } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { duration: 300, interval: 2000 };
    const renderComp = (
      <div style={{ width: 500 }}>
        <Swiper {...defaultProps} {...changedProps}>
          <Swiper.SwiperItem>
            <div style={{ height: 200, background: 'var(--td-success-color-7)' }}></div>
          </Swiper.SwiperItem>
          <Swiper.SwiperItem>
            <div style={{ height: 200, background: 'var(--td-warning-color-7)' }}></div>
          </Swiper.SwiperItem>
          <Swiper.SwiperItem>
            <div style={{ height: 200, background: 'var(--td-error-color-7)' }}></div>
          </Swiper.SwiperItem>
        </Swiper>
      </div>
    );`,
  },
  skeleton: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Skeleton } from 'tdesign-react';\n`,
    usageStr: `
    const renderComp = (
      <Skeleton {...changedProps}>
        <div>内容</div>
      </Skeleton>
    );`,
  },
  tag: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Tag } from 'tdesign-react';\n`,
    usageStr: `const renderComp = (<Tag {...changedProps}>标签</Tag>);`,
  },
  tooltip: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Tooltip, Button } from 'tdesign-react';\n`,
    usageStr: `
    const defaultProps = { content: '这是Tooltip内容' };
    const renderComp = (
      <Tooltip {...defaultProps} {...changedProps}>
        <Button>hover me</Button>
      </Tooltip>
    );`,
  },
  tree: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Tree } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = {
        data: [
          {
            label: '第一段',
            children: [ { label: '第二段' }, { label: '第二段' } ],
          },
          {
            label: '第一段',
            children: [ { label: '第二段' }, { label: '第二段' } ],
          },
          {
            label: '第一段',
            children: [ { label: '第二段' }, { label: '第二段' } ],
          },
        ]
      };
      const renderComp = (<Tree {...defaultProps} {...changedProps} />);
    `,
  },
  dialog: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Dialog, Button } from 'tdesign-react';\n`,
    usageStr: `
    const [visible, setVisible] = React.useState(false);
    const defaultProps = { onClose: () => setVisible(false) };
    React.useEffect(() => {
      if (changedProps.visible) setVisible(true);
    }, [changedProps, visible]);
    const renderComp = (
      <div>
        <Button onClick={() => setVisible(true)}>Open Modal</Button>
        <Dialog {...defaultProps} {...changedProps} visible={visible}>
          <p>This is a dialog</p>
        </Dialog>
      </div>
    );`,
  },
  drawer: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Drawer, Button } from 'tdesign-react';\n`,
    usageStr: `
    const [visible, setVisible] = React.useState(false);
    const defaultProps = { onClose: () => setVisible(false) };
    React.useEffect(() => {
      if (changedProps.visible) setVisible(true);
    }, [changedProps, visible]);
    const renderComp = (
      <div>
        <Button onClick={() => setVisible(true)}>Open Drawer</Button>
        <Drawer {...defaultProps} {...changedProps} visible={visible}>
          <p>This is a Drawer</p>
        </Drawer>
      </div>
    );`,
  },
  message: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Message } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = { duration: 0, content: '这里是 Message 信息' };
      const renderComp = (<Message {...defaultProps} {...changedProps} />);
    `,
  },
  notification: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Notification } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = { duration: 0, title: "标题名称", content: "这是一条消息通知" };
      const renderComp = (<Notification {...defaultProps} {...changedProps} />);
    `,
  },
  popconfirm: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { PopConfirm, Button } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = { content: "确认删除吗" };
      const renderComp = (
        <PopConfirm {...defaultProps} {...changedProps}>
          <Button>删除</Button>
        </PopConfirm>
      );
    `,
  },
  popup: {
    configStr: `import configList from './props.json';\n`,
    importStr: `import { Popup, Button } from 'tdesign-react';\n`,
    usageStr: `
      const defaultProps = { content: '这是一个弹出框' };
      const renderComp = (
        <Popup {...defaultProps} {...changedProps}>
          <Button>按钮</Button>
        </Popup>
      );
    `,
  },
};
