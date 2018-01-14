'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cspawn = _child_process2.default.spawn; /*
                                              © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                              This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                                              */
class Builder {
  build() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      yield _this.run('eslint', ['configes', 'configrollup']);
      yield _this.run('rollup', ['--config', 'config/rollup.config.js']);
    })();
  }

  run(cmd, args) {
    return (0, _asyncToGenerator3.default)(function* () {
      console.log(`${cmd} ${args.join(' ')}`);
      return new _promise2.default(function (resolve, reject) {
        return cspawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] }).once('close', function (status, signal) {
          if (status === 0 && !signal) resolve(status);else {
            let msg = `status code: ${status}`;
            if (signal) msg += ` signal: ${signal}`;
            msg += ` '${cmd} ${args.join(' ')}'`;
            const e = new Error(msg);
            (0, _assign2.default)(e, { status, signal });
            reject(e);
          }
        }).on('error', reject);
      });
    })();
  }
}
exports.default = Builder;
