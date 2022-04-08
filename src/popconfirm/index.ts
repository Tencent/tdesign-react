import _Popconfirm from './Popconfirm';

// 后续移除错误命名
import _PopConfirmOld from './PopConfirm-old';

import './style/index.js';

export type { PopconfirmProps } from './Popconfirm';
export * from './type';

export const Popconfirm = _Popconfirm;
export default Popconfirm;

// 后续移除错误命名
export const PopConfirm = _PopConfirmOld;
