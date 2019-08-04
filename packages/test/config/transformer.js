"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _babel = _interopRequireDefault(require("./babel.config"));

var _babelJest = require("babel-jest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var _default = (0, _babelJest.createTransformer)(_babel.default);

exports.default = _default;