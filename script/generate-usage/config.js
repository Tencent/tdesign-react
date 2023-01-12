module.exports = {
  button: {
    importStr: `
      import configProps from './props.json';\n
      import { Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'button', value: 'button' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Button {...changedProps}>确定</Button>);
      }, [changedProps]);
    `,
  },
  divider: {
    importStr: `
      import configProps from './props.json';\n
      import { Divider } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'divider', value: 'divider' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp((
          <div style={{ width: 200 }}>
            <span>正直</span>
            <Divider {...changedProps}>TDesign</Divider>
            <span>进取</span>
            <Divider {...changedProps}>TDesign</Divider>
            <span>合作</span>
            <Divider {...changedProps}>TDesign</Divider>
            <span>创新</span>
          </div>
        ));
      }, [changedProps]);
    `,
  },
  alert: {
    importStr: `
      import configProps from './props.json';\n
      import { Alert } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'alert', value: 'alert' }];
    `,
    usageStr: `
      const defaultProps = { message: '这是一条信息' };\n
      useEffect(() => {
        setRenderComp(<Alert {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  anchor: {
    importStr: `
      import configProps from './props.json';\n
      import { Anchor } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'anchor', value: 'anchor' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp((
          <Anchor {...changedProps}>
            <Anchor.AnchorItem href="#锚点一" title="基础锚点" />
            <Anchor.AnchorItem href="#锚点二" title="多级锚点" />
            <Anchor.AnchorItem href="#锚点三" title="指定容器锚点" />
          </Anchor>
        ));
      }, [changedProps]);
    `,
  },
  calendar: {
    importStr: `
      import configProps from './props.json';\n
      import { Calendar } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'calendar', value: 'calendar' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Calendar {...changedProps} />);
      }, [changedProps]);
    `,
  },
  card: {
    importStr: `
      import configProps from './props.json';\n
      import { Card } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'card', value: 'card' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Card {...changedProps}>仅有内容区域的卡片形式。卡片内容区域可以是文字、图片、表单、表格等形式信息内容。可使用大中小不同的卡片尺寸，按业务需求进行呈现。</Card>);
      }, [changedProps]);
    `,
  },
  'date-picker': {
    importStr: `
      import DatePickerConfigProps from './date-picker-props.json';\n
      import DateRangePickerConfigProps from './date-range-picker-props.json';\n
      import { DatePicker, DateRangePicker } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(DatePickerConfigProps);
    `,
    panelStr: `
      const panelList = [
        { label: 'datePicker', value: 'datePicker', config: DatePickerConfigProps },
        { label: 'dateRangePicker', value: 'dateRangePicker', config: DateRangePickerConfigProps }
      ];

      const panelMap = {
        datePicker: <DatePicker {...changedProps} />,
        dateRangePicker: <DateRangePicker {...changedProps} />
      };
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(panelMap[panel]);
      }, [changedProps, panel]);
    `,
  },
  dropdown: {
    importStr: `
      import configProps from './props.json';\n
      import { Dropdown, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'dropdown', value: 'dropdown' }];
    `,
    usageStr: `
      const defaultProps = { options: [{ content: '操作一', value: 1 }, { content: '操作二', value: 2 }]};
      useEffect(() => {
        setRenderComp((
          <Dropdown {...defaultProps} {...changedProps}>
            <Button>更多...</Button>
          </Dropdown>
        ));
      }, [changedProps]);
    `,
  },
  menu: {
    importStr: `
      import configProps from './props.json';\n
      import { Menu } from 'tdesign-react';\n
      import { CodeIcon, AppIcon, FileIcon } from 'tdesign-icons-react';\n
    `,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'menu', value: 'menu' }, { label: 'headMenu', value: 'headMenu' }];
      const defaultProps = {
        logo: <img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" />,
      };
      const panelMap = {
        menu: (
          <div style={{ padding: 24, background: 'var(--bg-color-page)', borderRadius: 3 }}>
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
        ),
        headMenu: (
          <div style={{ padding: 24, background: 'var(--bg-color-page)', borderRadius: 3 }}>
            <Menu.HeadMenu {...defaultProps} {...changedProps}>
              <Menu.MenuItem value='0'>
                <span>菜单1</span>
              </Menu.MenuItem>
              <Menu.MenuItem value='1'>
                <span>菜单2</span>
              </Menu.MenuItem>
            </Menu.HeadMenu>
          </div>
        )
      };
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(panelMap[panel]);
      }, [changedProps, panel]);
    `,
  },
  pagination: {
    importStr: `
      import configProps from './props.json';\n
      import { Pagination } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'pagination', value: 'pagination' }];
    `,
    usageStr: `
      const defaultProps = { total: 30 };
      useEffect(() => {
        setRenderComp(<Pagination {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  steps: {
    importStr: `
      import configProps from './props.json';\n
      import { Steps } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'steps', value: 'steps' }];
    `,
    usageStr: `
      const defaultProps = { defaultCurrent: 1 };
      useEffect(() => {
        setRenderComp((
          <Steps {...defaultProps} {...changedProps}>
            <Steps.StepItem title="步骤1" content="提示文字" />
            <Steps.StepItem title="步骤2" content="提示文字" />
            <Steps.StepItem title="步骤3" content="提示文字" />
          </Steps>
        ));
      }, [changedProps]);
    `,
  },
  tabs: {
    importStr: `
      import configProps from './props.json';\n
      import { Tabs } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'tabs', value: 'tabs' }];
    `,
    usageStr: `
      const defaultProps = { defaultValue: '1' };
      useEffect(() => {
        setRenderComp((
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
        ));
      }, [changedProps]);
    `,
  },
  cascader: {
    importStr: `
      import configProps from './props.json';\n
      import { Cascader } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'cascader', value: 'cascader' }];
    `,
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
      useEffect(() => {
        setRenderComp(<Cascader {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  checkbox: {
    importStr: `
      import configProps from './props.json';\n
      import { Checkbox } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'checkbox', value: 'checkbox' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Checkbox {...changedProps}>基础多选框</Checkbox>);
      }, [changedProps]);
    `,
  },
  form: {
    importStr: `
      import configProps from './props.json';\n
      import { Form, Input, Checkbox } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'form', value: 'form' }];
    `,
    usageStr: `
      const defaultProps = {};
      useEffect(() => {
        setRenderComp((
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
        ));
      }, [changedProps]);
    `,
  },
  input: {
    importStr: `
      import configProps from './props.json';\n
      import { Input } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'input', value: 'input' }];
    `,
    usageStr: `
      const defaultProps = { tips: '这是 tips 文本信息' };
      useEffect(() => {
        setRenderComp(<Input {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  'input-number': {
    importStr: `
      import configProps from './props.json';\n
      import { InputNumber } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'inputNumber', value: 'inputNumber' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<InputNumber {...changedProps} />);
      }, [changedProps]);
    `,
  },
  radio: {
    importStr: `
      import configProps from './props.json';\n
      import { Radio } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'radio', value: 'radio' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Radio {...changedProps}>单选框</Radio>);
      }, [changedProps]);
    `,
  },
  select: {
    importStr: `
      import configProps from './props.json';\n
      import { Select } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'select', value: 'select' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp((
          <Select {...changedProps}>
            <Select.Option key="apple" label="Apple" value="apple" />
            <Select.Option key="orange" value="orange">Orange</Select.Option>
            <Select.Option key="banana" label="Banana" value="banana" />
          </Select>
        ));
      }, [changedProps]);
    `,
  },
  'select-input': {
    importStr: `
      import configProps from './props.json';\n
      import { SelectInput } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'selectInput', value: 'selectInput' }];
    `,
    usageStr: `
      const defaultProps = { panel: <div>暂无数据</div>, tips: '这是 tips 文本信息' };
      useEffect(() => {
        setRenderComp(<SelectInput {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  slider: {
    importStr: `
      import configProps from './props.json';\n
      import { Slider } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'slider', value: 'slider' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Slider {...changedProps} />);
      }, [changedProps]);
    `,
  },
  switch: {
    importStr: `
      import configProps from './props.json';\n
      import { Switch } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'switch', value: 'switch' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Switch {...changedProps} />);
      }, [changedProps]);
    `,
  },
  'tag-input': {
    importStr: `
      import configProps from './props.json';\n
      import { TagInput } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'tagInput', value: 'tagInput' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<TagInput {...changedProps} />);
      }, [changedProps]);
    `,
  },
  textarea: {
    importStr: `
      import configProps from './props.json';\n
      import { Textarea } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'textarea', value: 'textarea' }];
    `,
    usageStr: `
      const defaultProps = { placeholder: '请输入内容' };
      useEffect(() => {
        setRenderComp(<Textarea {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  'tree-select': {
    importStr: `
      import configProps from './props.json';\n
      import { TreeSelect } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'tree', value: 'tree' }];
    `,
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
      useEffect(() => {
        setRenderComp(<TreeSelect {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  transfer: {
    importStr: `
      import configProps from './props.json';\n
      import { Transfer } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'transfer', value: 'transfer' }];
    `,
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
      useEffect(() => {
        setRenderComp(<Transfer {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  'time-picker': {
    importStr: `
      import configProps from './props.json';\n
      import { TimePicker } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'timePicker', value: 'timePicker' }, { label: 'timeRangePicker', value: 'timeRangePicker' }];
      const panelMap = {
        timePicker: <TimePicker {...changedProps} />,
        timeRangePicker: <TimePicker.TimeRangePicker {...changedProps} />
      };
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(panelMap[panel]);
      }, [changedProps, panel]);
    `,
  },
  upload: {
    importStr: `
      import configProps from './props.json';\n
      import { Upload } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'upload', value: 'upload' }];
    `,
    usageStr: `
      const defaultProps = { action: 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo' };
      useEffect(() => {
        setRenderComp(<Upload {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  avatar: {
    importStr: `
      import configProps from './props.json';\n
      import { Avatar } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'avatar', value: 'avatar' }];
    `,
    usageStr: `
      const defaultProps = { image: 'https://tdesign.gtimg.com/site/avatar.jpg' };
      useEffect(() => {
        setRenderComp(<Avatar {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  badge: {
    importStr: `
      import configProps from './props.json';\n
      import { Badge, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'badge', value: 'badge' }];
    `,
    usageStr: `
      const defaultProps = { count: 100 };
      useEffect(() => {
        setRenderComp((
          <Badge {...defaultProps} {...changedProps}>
            <Button>按钮</Button>
          </Badge>
        ));
      }, [changedProps]);
    `,
  },
  list: {
    importStr: `
      import configProps from './props.json';\n
      import { List } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'list:', value: 'list:' }];
    `,
    usageStr: `
      const avatarUrl = 'https://tdesign.gtimg.com/list-icon.png';
      const listData = [
        { id: 1, content: '列表内容列表内容列表内容' },
        { id: 2, content: '列表内容列表内容列表内容' },
        { id: 3, content: '列表内容列表内容列表内容' },
      ];
      useEffect(() => {
        setRenderComp((
          <List {...changedProps}>
            {listData.map((item) => (
              <List.ListItem key={item.id}>
                <List.ListItemMeta image={avatarUrl} title="列表主内容" description="列表内容列表内容列表内容" />
              </List.ListItem>
            ))}
          </List>
        ));
      }, [changedProps]);
    `,
  },
  loading: {
    importStr: `
      import configProps from './props.json';\n
      import { Loading } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'loading', value: 'loading' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Loading {...changedProps} />);
      }, [changedProps]);
    `,
  },
  progress: {
    importStr: `
      import configProps from './props.json';\n
      import { Progress } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'progress', value: 'progress' }];
    `,
    usageStr: `
      const [percent, setPercent] = useState(0);
      const defaultProps = { percentage: percent };

      useEffect(() => {
        const timer = setInterval(() => setPercent((percent) => (percent % 100) + 10), 1000);
        return () => clearInterval(timer);
      }, []);

      useEffect(() => {
        setRenderComp((
          <div style={{ width: 200 }}>
            <Progress {...defaultProps} {...changedProps} />
          </div>
        ));
      }, [changedProps, percent]);
    `,
  },
  swiper: {
    importStr: `
      import configProps from './props.json';\n
      import { Swiper } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'swiper', value: 'swiper' }];
    `,
    usageStr: `
      const defaultProps = { duration: 300, interval: 2000 };
      useEffect(() => {
        setRenderComp((
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
        ));
      }, [changedProps]);
    `,
  },
  skeleton: {
    importStr: `
      import configProps from './props.json';\n
      import { Skeleton } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'skeleton', value: 'skeleton' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp((
          <Skeleton {...changedProps}>
            <div>内容</div>
          </Skeleton>
        ));
      }, [changedProps]);
    `,
  },
  tag: {
    importStr: `
      import configProps from './props.json';\n
      import { Tag } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'tag', value: 'tag' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(<Tag {...changedProps}>标签</Tag>);
      }, [changedProps]);
    `,
  },
  tooltip: {
    importStr: `
      import configProps from './props.json';\n
      import { Tooltip, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'tooltip', value: 'tooltip' }];
    `,
    usageStr: `
      const defaultProps = { content: '这是Tooltip内容' };
      useEffect(() => {
        setRenderComp((
          <Tooltip {...defaultProps} {...changedProps}>
            <Button>hover me</Button>
          </Tooltip>
        ));
      }, [changedProps]);
    `,
  },
  tree: {
    importStr: `
      import configProps from './props.json';\n
      import { Tree } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'tree:', value: 'tree:' }];
    `,
    usageStr: `
      const [data] = useState([
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
      ]);
      useEffect(() => {
        setRenderComp(<Tree data={data} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  dialog: {
    importStr: `
      import configProps from './props.json';\n
      import { Dialog, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'dialog', value: 'dialog' }];
    `,
    usageStr: `
      const [visible, setVisible] = React.useState(false);
      const defaultProps = { onClose: () => setVisible(false) };

      useEffect(() => {
        if (changedProps.visible) setVisible(true);
      }, [changedProps]);

      useEffect(() => {
        setRenderComp((
          <div>
            <Button onClick={() => setVisible(true)}>Open Modal</Button>
            <Dialog {...defaultProps} {...changedProps} visible={visible}>
              <p>This is a dialog</p>
            </Dialog>
          </div>
        ));
      }, [changedProps, visible]);
    `,
  },
  drawer: {
    importStr: `
      import configProps from './props.json';\n
      import { Drawer, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'drawer', value: 'drawer' }];
    `,
    usageStr: `
      const [visible, setVisible] = React.useState(false);
      const defaultProps = { onClose: () => setVisible(false) };
      useEffect(() => {
        if (changedProps.visible) setVisible(true);
      }, [changedProps]);

      useEffect(() => {
        setRenderComp((
          <div>
            <Button onClick={() => setVisible(true)}>Open Drawer</Button>
            <Drawer {...defaultProps} {...changedProps} visible={visible}>
              <p>This is a Drawer</p>
            </Drawer>
          </div>
        ));
      }, [changedProps, visible]);
    `,
  },
  message: {
    importStr: `
      import configProps from './props.json';\n
      import { Message } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'message', value: 'message' }];
    `,
    usageStr: `
      const defaultProps = { duration: 0, content: '这里是 Message 信息' };
      useEffect(() => {
        setRenderComp(<Message {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  notification: {
    importStr: `
      import configProps from './props.json';\n
      import { Notification } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'notification', value: 'notification' }];
    `,
    usageStr: `
      const defaultProps = { duration: 0, title: "标题名称", content: "这是一条消息通知" };
      useEffect(() => {
        setRenderComp(<Notification {...defaultProps} {...changedProps} />);
      }, [changedProps]);
    `,
  },
  popconfirm: {
    importStr: `
      import configProps from './props.json';\n
      import { Popconfirm, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'popconfirm', value: 'popconfirm' }];
    `,
    usageStr: `
      const defaultProps = { content: "确认删除吗" };
      useEffect(() => {
        setRenderComp((
          <Popconfirm {...defaultProps} {...changedProps}>
            <Button>删除</Button>
          </Popconfirm>
        ));
      }, [changedProps]);
    `,
  },
  popup: {
    importStr: `
      import configProps from './props.json';\n
      import { Popup, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'popup', value: 'popup' }];
    `,
    usageStr: `
      const defaultProps = { content: '这是一个弹出框' };
      useEffect(() => {
        setRenderComp((
          <Popup {...defaultProps} {...changedProps}>
            <Button>按钮</Button>
          </Popup>
        ));
      }, [changedProps]);
    `,
  },
  table: {
    importStr: `
      import baseTableConfigProps from './base-table-props.json';\n
      import { Table } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(baseTableConfigProps);
    `,
    panelStr: `
      const panelList = [
        { label: 'Table', value: 'baseTable', config: baseTableConfigProps },
      ];

      const data = Array(30).fill(0).map((_, i) => ({
        index: i,
        platform: '公有',
        description: '数据源',
      }));

      const columns = [
        {colKey: 'index', title: 'index'},
        {colKey: 'platform', title: '平台'},
        {colKey: 'description', title: '说明'},
      ];

      const defaultProps = {
        data,
        columns,
        maxHeight: 140,
        pagination: { total: 30, defaultPageSize: 10 },
      };

      const panelMap = {
        baseTable: <Table {...defaultProps} {...changedProps} />,
      };
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp(panelMap[panel]);
      }, [changedProps, panel]);
    `,
  },
  Space: {
    importStr: `
      import configProps from './props.json';\n
      import { Space, Button } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'space', value: 'space' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp((
          <Space {...changedProps}>
            <Button>按钮</Button>
            <Button>按钮</Button>
            <Button>按钮</Button>
            <Button>按钮</Button>
            <Button>按钮</Button>
          </Space>
        ));
      }, [changedProps]);
    `,
  },
  Jumper: {
    importStr: `
      import configProps from './props.json';\n
      import { Jumper } from 'tdesign-react';\n`,
    configStr: `
      const [configList, setConfigList] = useState(configProps);
    `,
    panelStr: `
      const panelList = [{ label: 'jumper', value: 'jumper' }];
    `,
    usageStr: `
      useEffect(() => {
        setRenderComp((
          <Jumper {...changedProps}></Jumper>
        ));
      }, [changedProps]);
    `,
  },
  Collapse: {
    importStr: `
    import configProps from './props.json';\n
    import { Collapse } from 'tdesign-react';\n`,
    configStr: `
    const [configList, setConfigList] = useState(configProps);
  `,
    panelStr: `
    const panelList = [{ label: 'collapse', value: 'collapse' }];
  `,
    usageStr: `
    const { Panel } = Collapse;
    useEffect(() => {
      setRenderComp((
        <Collapse defaultValue="default" {...changedProps}>
          <Panel header="这是一个折叠标题">
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </Panel>
          <Panel header="设置默认展开项" value="default">
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </Panel>
          <Panel header="嵌套使用折叠面板">
            <Collapse>
              <Panel header="这是一个折叠标题">
                这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>
      ));
    }, [changedProps]);
  `,
  },
};
