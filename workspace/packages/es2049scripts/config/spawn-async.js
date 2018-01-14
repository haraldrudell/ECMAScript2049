'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spawn = _child_process2.default.spawn; /*
                                             © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                             This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                                             */

exports.default = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (cmd, args, options, cp) {
    if (!cp) cp = {};
    return new _promise2.default(function (resolve, reject) {
      return cp.cp = spawn(cmd, args, (0, _extends3.default)({ stdio: ['ignore', 'inherit', 'inherit'] }, options)).once('close', function (status, signal) {
        return status === 0 && !signal && resolve(status) || reject(getError(cmd, args, status, signal));
      }).on('error', reject);
    });
  });

  function spawnAsync(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  }

  return spawnAsync;
})();

function getError(cmd, args, status, signal) {
  let msg = `status code: ${status}`;
  if (signal) msg += ` signal: ${signal}`;
  msg += ` '${cmd} ${args.join(' ')}'`;
  const e = new Error(msg);
  (0, _assign2.default)(e, { status, signal, cmd, args });
  return e;
}
