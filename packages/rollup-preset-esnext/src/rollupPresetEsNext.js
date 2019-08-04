/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import presetEsNext from 'babel-preset-7-esnext'
import {eslint} from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'

const eslintPath = require.resolve('eslint')

export default options => {
  options = {...options}
  const jail = options.jail !== undefined ? options.jail : process.cwd()
  if (options.env == null) options.env = {targets: {node: '8.5'}}
  const compact = options.compact != null ? options.compact : false

  return [
    eslint({
      include: ['**/*.js', '**/*.mjs'],
      exclude: 'node_modules/**',
      eslintPath,
      ignore: false,
    }),
    resolve({
      extensions: ['.mjs', '.js', '.json'],
      customResolveOptions: {jail},
    }),
    json(),
    babel({
      babelrc: false,
      configFile: false,
      include: ['**/*.js', '**/*.mjs'],
      exclude: 'node_modules/**',
      presets: [[presetEsNext, options]],
      runtimeHelpers: true,
      compact,
    }),
    commonjs(),
  ]
}
