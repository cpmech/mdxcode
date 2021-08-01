import { terser } from 'rollup-plugin-terser';
import autoexternal from 'rollup-plugin-auto-external';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const cacheRoot = '/tmp/rollup_typescript_cache';

const external = [
  'fs',
  'path',
  'js-yaml',
  'child_process',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      banner: '#!/usr/bin/env node\n',
      file: 'dist/mdxcode.js',
      format: 'cjs',
    },
    plugins: [
      autoexternal(),
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve({ preferBuiltins: true }),
      commonjs(),
      terser(),
    ],
  },
];
