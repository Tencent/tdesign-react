import { GlobalConfigProvider } from '../config-provider/type';

const GLOBAL_CONFIG_EN: GlobalConfigProvider = {
  pagination: {
    itemsPerPage: '{size} / page',
    jumpTo: 'jump to',
    page: '',
    total: '{total} items',
  },
  cascader: {
    empty: 'Empty Data',
    loadingText: '',
    placeholder: '',
  },
  calendar: {
    firstDayOfWeek: 7,
    fillWithZero: true,
    yearSelection: '{year}',
    monthSelection: '{month}',
    yearRadio: 'year',
    monthRadio: 'month',
    hideWeekend: 'Hide Week',
    showWeekend: 'Show Week',
    today: 'Today',
    thisMonth: 'This Month',
    week: 'Monday,Tuesday,Wedsday,Thuresday,Friday,Staturday,Sunday',
    cellMonth: 'January,February,March,April,May,June,July,August,September,October,November,December',
  },
  transfer: {
    title: '{checked} / {total}',
    empty: 'Empty Data',
    placeholder: 'enter keyworkd to search',
  },
  timePicker: {
    now: 'Now',
    confirm: 'Confirm',
    anteMeridiem: 'AM',
    postMeridiem: 'PM',
    placeholder: '',
  },
  dialog: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    confirmBtnTheme: {
      default: 'primary',
      info: 'primary',
      warning: 'primary',
      danger: 'primary',
      success: 'primary',
    },
  },
  drawer: {
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  popconfirm: {
    confirm: 'OK',
    cancel: 'Cancel',
    confirmBtnTheme: {
      default: 'primary',
      warning: 'primary',
      danger: 'primary',
    },
  },
  table: {
    empty: 'Empty Data',
    loadingText: 'loading...',
    filterInputPlaceholder: '',
    sortAscendingOperationText: 'click to sort ascending',
    sortCancelOperationText: 'click to cancel sorting',
    sortDescendingOperationText: 'click to sort descending',
    // 展开和收起图标（使用收起图标）
    expandIcon: undefined,
    // 排序图标（使用降序图标）
    sortIcon: undefined,
  },
  select: {
    empty: 'Empty Data',
    loadingText: 'loading...',
    placeholder: '',
    // 清除按钮
    clearIcon: undefined,
  },
  tree: {
    empty: 'Empty Data',
    // 目录层级图标
    folderIcon: undefined,
  },
  treeSelect: {
    empty: 'Empty Data',
    loadingText: 'loading...',
    placeholder: '',
  },
  datePicker: {
    placeholder: {
      date: 'select date',
      month: 'select month',
      year: 'select year',
    },
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    firstDayOfWeek: 7,
    rangeSeparator: ' ~ ',
    format: 'YYYY-MM-DD',
    yearAriaLabel: '',
    confirm: 'Confirm',
    selectTime: 'Select Time',
    selectDate: 'Select Date',
    nextYear: 'Next Year',
    preYear: 'Last Year',
    nextMonth: 'Next Month',
    preMonth: 'Last Month',
    preDecade: 'Last Decade',
    nextDecade: 'Next Decade',
    now: 'Now',
  },
  steps: {
    errorIcon: undefined,
  },
  upload: {
    sizeLimitMessage: 'File is too large to upload. {sizeLimit}',
    cancelUploadText: 'Cancel',
    triggerUploadText: {
      fileInput: 'Upload',
      image: 'Click to upload',
      normal: 'Upload',
      reupload: 'Reupload',
      delete: 'Delete',
    },
    dragger: {
      dragDropText: 'Drop hear',
      draggingText: 'Drag file to this area to upload',
      clickAndDragText: 'Click "Upload" or Drag file to this area to upload',
    },
    file: {
      fileNameText: 'filename',
      fileSizeText: 'size',
      fileStatusText: 'status',
      fileOperationText: 'operation',
      fileOperationDateText: 'date',
    },
    progress: {
      uploadingText: 'Uploading',
      waitingText: 'Waiting',
      failText: 'Failed',
      successText: 'Success',
    },
  },
  list: {
    loadingText: 'loading...',
    loadingMoreText: 'loading more',
  },
};

export default GLOBAL_CONFIG_EN;
