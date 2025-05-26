import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import multiInput from 'rollup-plugin-multi-input';
import nodeResolve from '@rollup/plugin-node-resolve';
import staticImport from 'rollup-plugin-static-import';
import ignoreImport from 'rollup-plugin-ignore-import';
import { resolve } from 'path';

import pkg from '../../../packages/tdesign-react-aigc/package.json';

const name = 'tdesign';
const externalDeps = Object.keys(pkg.dependencies || {});
const externalPeerDeps = Object.keys(pkg.peerDependencies || {});
const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;
const inputList = [
  'packages/pro-components/chat/**/*.ts',
  'packages/pro-components/chat/**/*.tsx',
  '!packages/pro-components/chat/**/_example',
  '!packages/pro-components/chat/**/*.d.ts',
  '!packages/pro-components/chat/**/__tests__',
  '!packages/pro-components/chat/**/_usage',
];

const getPlugins = ({ env, isProd = false, ignoreLess = true, extractMultiCss = false } = {}) => {
  const plugins = [
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
    }),
    commonjs(),
    esbuild({
      include: /\.[jt]sx?$/,
      target: 'esnext',
      minify: false,
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      tsconfig: resolve(__dirname, '../tsconfig.build.json'),
    }),
    babel({
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
    json(),
    url(),
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: JSON.stringify(pkg.version),
      },
    }),
  ];

  if (env) {
    plugins.push(
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(env),
        },
      }),
    );
  }

  if (isProd) {
    plugins.push(
      terser({
        output: {
          /* eslint-disable */
          ascii_only: true,
          /* eslint-enable */
        },
      }),
    );
  }

  return plugins;
};

const cssConfig = {
  input: ['packages/pro-components/chat/style/index.js'],
  plugins: [multiInput({ relative: 'packages/pro-components/chat' }), styles({ mode: 'extract' })],
  output: {
    banner,
    dir: 'packages/tdesign-react-aigc/es/',
    sourcemap: true,
    assetFileNames: '[name].css',
  },
};

// 按需加载组件 带 css 样式
const esConfig = {
  input: inputList,
  // 为了保留 style/css.js
  treeshake: false,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput({ relative: 'packages/pro-components/chat' })].concat(getPlugins({ extractMultiCss: true })),
  output: {
    banner,
    dir: 'packages/tdesign-react-aigc/es/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

export default [esConfig, cssConfig];
