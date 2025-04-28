import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import analyzer from 'rollup-plugin-analyzer';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import multiInput from 'rollup-plugin-multi-input';
import nodeResolve from '@rollup/plugin-node-resolve';
import staticImport from 'rollup-plugin-static-import';
import ignoreImport from 'rollup-plugin-ignore-import';
import { resolve } from 'path';

import pkg from '../packages/tdesign-react/package.json';

// TODO: replace path with utils

const name = 'tdesign';
const externalDeps = Object.keys(pkg.dependencies || {});
const externalPeerDeps = Object.keys(pkg.peerDependencies || {}).concat(['react-dom/client']);
const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;
const input = 'packages/components/index-lib.ts';
const inputList = [
  'packages/components/**/*.ts',
  'packages/components/**/*.jsx',
  'packages/components/**/*.tsx',
  '!packages/components/**/_example',
  '!packages/components/**/_example-js',
  '!packages/components/**/*.d.ts',
  '!packages/components/**/__tests__',
  '!packages/components/**/_usage',
];

const getPlugins = ({
  env,
  isProd = false,
  ignoreLess = true,
  extractOneCss = false,
  extractMultiCss = false,
} = {}) => {
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

  // css
  if (extractOneCss) {
    plugins.push(
      postcss({
        extract: `${isProd ? `${name}.min` : name}.css`,
        minimize: isProd,
        sourceMap: true,
        extensions: ['.sass', '.scss', '.css', '.less'],
      }),
    );
  } else if (extractMultiCss) {
    plugins.push(
      staticImport({
        baseDir: 'packages/components',
        include: ['packages/components/**/style/css.js'],
      }),
      ignoreImport({
        include: ['packages/components/*/style/*'],
        body: 'import "./css.js";',
      }),
    );
  } else if (ignoreLess) {
    plugins.push(ignoreImport({ extensions: ['*.less'] }));
  } else {
    plugins.push(
      staticImport({
        baseDir: 'packages/components',
        include: ['packages/components/**/style/index.js'],
      }),
      staticImport({
        baseDir: 'packages/common',
        include: ['packages/common/style/web/**/*.less'],
      }),
      ignoreImport({
        include: ['packages/components/*/style/*'],
        body: 'import "./style/index.js";',
      }),
    );
  }

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
  input: ['packages/components/**/style/index.js'],
  plugins: [multiInput({ relative: 'packages/components/' }), styles({ mode: 'extract' })],
  output: {
    banner,
    dir: './packages/tdesign-react/es',
    sourcemap: true,
    assetFileNames: '[name].css',
  },
};

// 按需加载组件 不带 css 样式
const libConfig = {
  input: inputList.concat('!packages/components/index-lib.ts'),
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput({ relative: 'packages/components/' })].concat(getPlugins()),
  output: {
    banner,
    dir: 'packages/tdesign-react/lib/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

// 按需加载组件 带 css 样式
const esConfig = {
  input: inputList.concat('!packages/components/index-lib.ts'),
  // 为了保留 style/css.js
  treeshake: false,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput({ relative: 'packages/components/' })].concat(getPlugins({ extractMultiCss: true })),
  output: {
    banner,
    dir: 'packages/tdesign-react/es/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

// 按需加载组件 带原始 less 文件，可定制主题
const esmConfig = {
  input: inputList.concat('!packages/components/index-lib.ts'),
  // 为了保留 style/index.js
  treeshake: false,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [
    multiInput({ relative: 'packages/components/' }),
    copy({
      targets: [
        {
          src: 'packages/common/style/web/**/*.less',
          dest: 'packages/tdesign-react/esm/common',
          rename: (_, __, fullPath) => `${fullPath.replace('packages/common', '')}`,
        },
      ],
      verbose: true,
    }),
  ].concat(getPlugins({ ignoreLess: false })),
  output: {
    banner,
    dir: 'packages/tdesign-react/esm/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

const cjsExternalException = ['lodash-es'];
const cjsExternal = externalDeps.concat(externalPeerDeps).filter((value) => !cjsExternalException.includes(value));
// commonjs 导出规范，不带 css 样式
const cjsConfig = {
  input: inputList,
  external: cjsExternal,
  plugins: [multiInput({ relative: 'packages/components/' })].concat(getPlugins()),
  output: {
    banner,
    dir: 'packages/tdesign-react/cjs/',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

const umdConfig = {
  input,
  external: externalPeerDeps,
  plugins: getPlugins({
    env: 'development',
    extractOneCss: true,
  }).concat(analyzer({ limit: 5, summaryOnly: true })),
  output: {
    name: 'TDesign',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { react: 'React' },
    sourcemap: true,
    file: `packages/tdesign-react/dist/${name}.js`,
  },
};

const umdMinConfig = {
  input,
  external: externalPeerDeps,
  plugins: getPlugins({
    isProd: true,
    extractOneCss: true,
    env: 'production',
  }),
  output: {
    name: 'TDesign',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { react: 'React' },
    sourcemap: true,
    file: `packages/tdesign-react/dist/${name}.min.js`,
  },
};

// 单独导出 reset.css 到 dist 目录，兼容旧版本样式
const resetCss = {
  input: 'packages/common/style/web/_reset.less',
  output: {
    file: 'packages/tdesign-react/dist/reset.css',
  },
  plugins: [postcss({ extract: true })],
};

export default [cssConfig, libConfig, cjsConfig, esConfig, esmConfig, umdConfig, umdMinConfig, resetCss];
