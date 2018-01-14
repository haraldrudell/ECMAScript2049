'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _spawnAsync = require('./spawn-async');

var _spawnAsync2 = _interopRequireDefault(_spawnAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Builder {
  build() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      yield _this.run('eslint', ['configes', 'configrollup']);
      return _this.run('rollup', ['--config', 'config/rollup.config.js']);
    })();
  }

  run(cmd, args) {
    return (0, _asyncToGenerator3.default)(function* () {
      console.log(cmd, ...args);
      return (0, _spawnAsync2.default)(cmd, args);
    })();
  }
}
exports.default = Builder; /*
                           © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                           This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                           */
