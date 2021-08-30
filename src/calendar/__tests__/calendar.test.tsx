import { testExamples } from '@test/utils';
import MockDate from 'mockdate';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2021-08-27');

// 测试组件代码 Example 快照
testExamples(__dirname);
