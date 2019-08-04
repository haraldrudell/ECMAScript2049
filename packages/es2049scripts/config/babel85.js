"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
var _default = {
  presets: [['@babel/preset-env', {
    targets: {
      node: '8.5'
    }
  }]],
  plugins: [// 181204 https://babeljs.io/docs/en/babel-preset-stage-0
  // stage 0
  '@babel/plugin-proposal-function-bind', // Stage 1
  '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-logical-assignment-operators', ['@babel/plugin-proposal-optional-chaining', {
    loose: false
  }], ['@babel/plugin-proposal-pipeline-operator', {
    proposal: 'minimal'
  }], ['@babel/plugin-proposal-nullish-coalescing-operator', {
    loose: false
  }], '@babel/plugin-proposal-do-expressions', // Stage 2
  ['@babel/plugin-proposal-decorators', {
    legacy: true
  }], '@babel/plugin-proposal-function-sent', '@babel/plugin-proposal-export-namespace-from', '@babel/plugin-proposal-numeric-separator', '@babel/plugin-proposal-throw-expressions', // Stage 3
  '@babel/plugin-syntax-dynamic-import', '@babel/plugin-syntax-import-meta', ['@babel/plugin-proposal-class-properties', {
    loose: false
  }], '@babel/plugin-proposal-json-strings']
};
exports.default = _default;
