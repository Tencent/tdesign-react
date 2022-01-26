import { GlobalConfigProvider } from './type';

const DEFAULT_GLOBAL_CONFIG: GlobalConfigProvider = {
  pagination: {},
  cascader: {},
  calendar: {
    firstDayOfWeek: 1,
    fillWithZero: true,
  },
  transfer: {},
  timePicker: {},
  dialog: {},
  drawer: {},
  popconfirm: {},
  table: {
    // 展开和收起图标（使用收起图标）
    expandIcon: undefined,
    // 排序图标（使用降序图标）
    sortIcon: undefined,
  },
  select: {
    // 清除按钮
    clearIcon: undefined,
  },
  tree: {
    // 目录层级图标
    folderIcon: undefined,
  },
  treeSelect: {},
  datePicker: {
    firstDayOfWeek: 1,
  },
  steps: {
    errorIcon: undefined,
  },
  upload: {},
  tag: {
    closeIcon: undefined,
  },
  form: {
    requiredMark: true,
  },
  input: {},
};

export default DEFAULT_GLOBAL_CONFIG;
