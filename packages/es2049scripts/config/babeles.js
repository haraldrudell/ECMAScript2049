"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _babel = _interopRequireDefault(require("./babel85"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
_babel.default.presets[0][1].modules = false; // @babel/preset-env: transpile kee;piung ECMAScript modules

var _default = _babel.default;
exports.default = _default;
