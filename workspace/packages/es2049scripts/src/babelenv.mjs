/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import env from 'babel-preset-env'
import stage0 from 'babel-preset-stage-0'
import transformAsyncGeneratorFunctions from 'babel-plugin-transform-async-generator-functions'
import transformClassProperties from 'babel-plugin-transform-class-properties'
import transformEs2015ModulesCommonjs from 'babel-plugin-transform-es2015-modules-commonjs'
import transformExportExtensions from 'babel-plugin-transform-export-extensions'
import transformRuntime from 'babel-plugin-transform-runtime'
import externalHelpers from 'babel-plugin-external-helpers'
import resolve from 'resolve'

import path from 'path'

const babelRuntimePath = resolve.sync('babel-runtime/package.json')
const moduleName = path.dirname(babelRuntimePath)

export default {
  development: {
    babelrc: false,
    sourceMaps: true,
    presets: [
      [env, {targets: {node: 6}}],
      stage0,
    ]},
/*    current: { // fails for export * from 'fs'
      babelrc: false,
      sourceMaps: true,
      presets: [
        [env, {targets: {node: true}, modules: false}],
        stage0
      ]}, */
  current: {
    babelrc: false,
    sourceMaps: true,
    presets: [stage0],
    plugins: [
      transformAsyncGeneratorFunctions,
      transformClassProperties,
      transformEs2015ModulesCommonjs,
      transformExportExtensions,
    ]},
  latest: {
    babelrc: false,
    sourceMaps: true,
    presets: [stage0],
    plugins: [
      transformAsyncGeneratorFunctions,
      transformClassProperties,
      transformExportExtensions,
    ]},
  rollup: {
    babelrc: false,
    sourceMaps: true,
    presets: [
      [env, {targets: {node: '4.8.1'}, modules: false}],
      stage0,
    ],
    plugins: [
      externalHelpers,
      [transformRuntime, {moduleName}],
    ],
  },
}
