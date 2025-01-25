import enUS from '../_common/js/global-config/locale/en_US';
import { GlobalConfigProvider } from '../config-provider/type';

// 需要 GlobalConfigProvider 保证数据类型正确，本次提交就检查出了英文字段缺少
export default enUS as unknown as GlobalConfigProvider;
