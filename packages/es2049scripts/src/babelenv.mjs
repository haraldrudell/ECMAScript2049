/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import presetEnv from '@babel/preset-env'
import stage0Preset from './stage0Preset'

export default {
  development: {
    babelrc: false,
    sourceMaps: true,
    presets: [[presetEnv, {targets: {node: '8.5'}}], stage0Preset],
  },
  active: {
      babelrc: false,
      sourceMaps: true,
      presets: [[presetEnv, {targets: {node: '8.9.4'}}], stage0Preset],
  },
  current: {
    babelrc: false,
    sourceMaps: true,
    presets: [stage0Preset],
  },
  latest: {
    babelrc: false,
    sourceMaps: true,
    presets: [stage0Preset],
  },
  rollup: {
    babelrc: false,
    sourceMaps: true,
    presets: [[presetEnv, {targets: {node: '8.5'}, modules: false}], stage0Preset],
  },
}
