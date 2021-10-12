#!/usr/bin/env node
/* eslint-disable */
/**
 * 动态生成 svg 图标单文件
 */
// TODO 接下来在官网展示可以考虑由kyrielin统一出一份demo来实现 这样每个框架不用每次单独跑这种脚本来更新demo
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { promisify } = require('util');
const { template } = require('lodash');
const rimraf = require('rimraf');

const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);
const rm = promisify(rimraf);
const mkdir = promisify(fs.mkdir);

const SRC_ICONS_DIR = path.resolve(__dirname, '../node_modules/@tencent/tdesign-icons-react/lib/components');
const ICONS_DIR = path.resolve(__dirname, '../icons');
const ICON_EXAMPLE_DIR = path.resolve(__dirname, '../src/icon/_example');

const iconDemoRender =
  template(`<div style={{ width: 140, height: 140, fontSize:'12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <<%= SVG_ICON_NAME %> size="2em" />
          <div style={{ marginTop: 12 }}><%= SVG_ICON_NAME %></div>
        </div>`);

const iconFontDemoRender =
  template(`<div style={{ width: 140, height: 140, fontSize:'12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <IconFont name="<%= ICON_FONT_NAME %>" size="2em" />
          <div style={{ marginTop: 12 }}><%= ICON_FONT_NAME %></div>
        </div>`);

const iconDemosRender = template(
  `import React from 'react';
  import {
    <%= SVG_ICON_NAMES %>
  } from '@tencent/tdesign-icons-react';
  
  export default function IconExample() {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <%= SVG_ICON_DEMOS %>
      </div>
    );
  }
  `,
);

const iconFontDemosRender = template(
  `import React from 'react';
  import { IconFont } from '@tencent/tdesign-icons-react';
  
  export default function IconFontExample() {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <%= ICON_FONT_DEMOS %>
      </div>
    );
  }
  `,
);

// 生成图标
(async function generate() {
  try {
    await checkIconFolder();

    let icons = [];
    // 请求图标数据
    const files = glob.sync(`${SRC_ICONS_DIR}/**/*.js`);

    icons = files.map((file) => path.basename(file).replace('.js', ''));

    const iconNames = []; // 图标名称列表
    const iconDemos = []; // 使用示例
    const iconFontDemos = []; // iconfont 使用示例

    // 生成图标文件
    for (const icon of icons) {
      const name = toPascalCase(icon) + 'Icon';

      // 生成名称和使用示例
      iconNames.push(name);
      iconDemos.push(iconDemoRender({ SVG_ICON_NAME: name }));
      iconFontDemos.push(iconFontDemoRender({ ICON_FONT_NAME: icon }));

      console.log(`图标生成成功：${name}`);
    }

    // 生成 Demo
    await writeFile(
      path.join(ICON_EXAMPLE_DIR, `IconExample.jsx`),
      iconDemosRender({
        SVG_ICON_NAMES: iconNames.join(',\n  '),
        SVG_ICON_DEMOS: iconDemos.join('\n      '),
      }),
    );
    console.log('示例 IconExample.jsx 生成成功');

    // 生成 iconfont 的 Demo
    await writeFile(
      path.join(ICON_EXAMPLE_DIR, `IconFontExample.jsx`),
      iconFontDemosRender({
        ICON_FONT_DEMOS: iconFontDemos.join('\n      '),
      }),
    );
    console.log('示例 IconFontExample.jsx 生成成功');
  } catch (e) {
    console.error('生成图标失败', e);
  }
})();

// 改写大驼峰：close-fill -> CloseFill
function toPascalCase(str) {
  let upper = true;
  return str
    .split('')
    .map((char) => {
      // 过滤掉非 a-z 的字符，并让下一个字符大写
      if (!/[a-z0-9]/.test(char.toLowerCase())) {
        upper = true;
        return '';
      }

      // 首字母大写
      if (upper) {
        upper = false;
        return char.toUpperCase();
      }

      return char.toLowerCase();
    })
    .join('');
}

// 检查文件夹是否存在
async function checkIconFolder() {
  try {
    await access(ICONS_DIR);
    // 删除所有文件夹
    await rm(ICONS_DIR);
  } catch (err) {}

  await mkdir(ICONS_DIR);
}
