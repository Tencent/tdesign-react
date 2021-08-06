import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
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

import pkg from '../package.json';

const name = 'tdesign';
const externalDeps = Object.keys(pkg.dependencies || {});
const externalPeerDeps = Object.keys(pkg.peerDependencies || {});
const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;
const input = 'src/index.ts';
const inputList = [
  'src/**/*.ts',
  'src/**/*.jsx',
  'src/**/*.tsx',
  '!src/**/_example',
  '!src/**/*.d.ts',
  '!src/**/__tests__',
];

const getPlugins = ({
  env,
  isProd = false,
  ignoreLess = true,
  extractOneCss = false,
  extractMultiCss = false,
} = {}) => {
  const plugins = [
    nodeResolve(),
    commonjs(),
    esbuild({
      include: /\.[jt]sx?$/,
      target: 'esnext',
      minify: false,
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      tsconfig: 'tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
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
    plugins.push(postcss({
      extract: `${isProd ? `${name}.min` : name}.css`,
      minimize: isProd,
      sourceMap: true,
      extensions: ['.sass', '.scss', '.css', '.less'],
    }));
  } else if (extractMultiCss) {
    plugins.push(
      staticImport({
        include: [
          'src/**/style/css.js',
        ],
      }),
      ignoreImport({
        include: ['src/*/style/*'],
        body: 'import "./style/css.js";',
      }),
    );
  } else if (ignoreLess) {
    plugins.push(ignoreImport({ extensions: ['*.less'] }));
  } else {
    plugins.push(
      staticImport({
        include: [
          'src/**/style/index.js',
          'src/_common/style/web/**/*.less',
        ],
      }),
      ignoreImport({
        include: ['src/*/style/*'],
        body: 'import "./style/index.js";',
      }),
    );
  }

  if (env) {
    plugins.push(replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(env),
      },
    }));
  }

  if (isProd) {
    plugins.push(terser({
      output: {
        /* eslint-disable */
        ascii_only: true,
        /* eslint-enable */
      },
    }));
  }

  return plugins;
};

/** @type {import('rollup').RollupOptions} */
const cssConfig = {
  input: ['src/**/style/index.js'],
  plugins: [
    multiInput(),
    styles({ mode: 'extract' }),
  ],
  output: {
    banner,
    dir: 'es/',
    sourcemap: true,
    assetFileNames: '[name].css',
  },
};

// 不带样式打包 es 模块
const libConfig = {
  input: inputList,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()].concat(getPlugins()),
  output: {
    banner,
    dir: 'lib/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

// 按需加载组件 带 css 样式
/** @type {import('rollup').RollupOptions} */
const esConfig = {
  input: inputList,
  // 为了保留 style/css.js
  treeshake: false,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()].concat(getPlugins({ extractMultiCss: true })),
  output: {
    banner,
    dir: 'es/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

// 按需加载组件 带原始 less 文件，可定制主题
const esmConfig = {
  input: inputList,
  // 为了保留 style/index.js
  treeshake: false,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()].concat(getPlugins({ ignoreLess: false })),
  output: {
    banner,
    dir: 'esm/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

/** @type {import('rollup').RollupOptions} */
const cjsConfig = {
  input: inputList,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()].concat(getPlugins()),
  output: {
    banner,
    dir: 'cjs/',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

/** @type {import('rollup').RollupOptions} */
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
    globals: { react: 'React', lodash: '_' },
    sourcemap: true,
    file: `dist/${name}.js`,
  },
};

/** @type {import('rollup').RollupOptions} */
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
    globals: { react: 'React', lodash: '_' },
    sourcemap: true,
    file: `dist/${name}.min.js`,
  },
};

export default [cssConfig, libConfig, esConfig, esmConfig, cjsConfig, umdConfig, umdMinConfig];
