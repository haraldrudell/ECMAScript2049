/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {transform} from '@babel/core'
import presetEsNext from './presetEsNext'

test('transpile CommonJS', async () => {
  const input = [
    `import path from 'path'`,
    `export {path}`,
  ].join('\n')
  const expected = [
    `"use strict";`,
    ``,
    `Object.defineProperty(exports, "__esModule", {`,
    `  value: true`,
    `});`,
    `Object.defineProperty(exports, "path", {`,
    `  enumerable: true,`,
    `  get: function () {`,
    `    return _path.default;`,
    `  }`,
    `});`,
    ``,
    `var _path = _interopRequireDefault(require("path"));`,
    ``,
    `function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }`,
  ].join('\n')
  const options = {
    configFile: false,
    babelrc: false,
    presets: [presetEsNext],
  }

  const {code, map, ast} = await new Promise((resolve, reject) => transform(input, options, (e, result) => !e ? resolve(result) : reject(e)))
  //console.log('CODECOMMONJS', code)
  expect(code).toBe(expected)
})

test('transpile ECMAScript modules', async () => {
  const input = [
    `import path from 'path'`,
    `export {path}`,
  ].join('\n')
  const expected = [
    `import path from 'path';`,
    `export { path };`,
  ].join('\n')
  const options = {
    configFile: false,
    babelrc: false,
    presets: [[presetEsNext, {env: {targets: {node: true}, modules: false}}]],
  }

  const {code, map, ast} = await new Promise((resolve, reject) => transform(input, options, (e, result) => !e ? resolve(result) : reject(e)))
  //console.log('CODESM', code)
  expect(code).toBe(expected)
})
