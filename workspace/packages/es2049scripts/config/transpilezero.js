'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let run = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (argv) {
    debug = argv[0] === '-debug';
    // babel will concatenate this script with ./ZeroTranspiler
    // package.json scripts.transpilezero:babel
    yield _promise2.default.resolve(); // wait for the class to parse
    return new ZeroTranspiler({ debug }).transpile();
  });

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules (v8.5+ v9.3+)
//import ZeroTranspiler from './ZeroTranspiler'

const m = 'transpile-zero';
let debug;

run(process.argv.slice(2)).catch(onRejected);

function onRejected(e) {
  debug && console.error(`${m} error handler:`);
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`);
  console.error(!debug ? e.message : e);
  process.exit(1);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spawn = _child_process2.default.spawn; /*
                                             © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                             This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                                             */
class ZeroTranspiler {

  constructor(o) {
    this.config = 'config';
    this.configRollup = 'configrollup';
    this.configES = 'configes';
    this.mjs = '.mjs';
    this.js = '.js';
    this.BABEL_ENV_rollup = 'rollup';
    this.BABEL_ENV_ES = 'development';

    var _ref = o || false;

    const debug = _ref.debug;

    (0, _assign2.default)(this, { debug });
  }

  transpile() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const config = _this.config,
            configRollup = _this.configRollup,
            configES = _this.configES,
            BABEL_ENV_rollup = _this.BABEL_ENV_rollup,
            BABEL_ENV_ES = _this.BABEL_ENV_ES;


      process.env.BABEL_ENV = BABEL_ENV_rollup;
      yield _this.transpileFilesMjsToJs(configRollup, config);

      process.env.BABEL_ENV = BABEL_ENV_ES;
      return _this.transpileFilesMjsToJs(configES, config);
    })();
  }

  transpileFilesMjsToJs(fromDirectory, toDirectory) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      return _promise2.default.all((yield _fsExtra2.default.readdir(fromDirectory)).map(function (file) {
        return _this2.transpileFile(_path2.default.join(fromDirectory, file), _path2.default.join(toDirectory, _this2.mjsToJs(file)));
      }));
    })();
  }

  transpileFile(from, to) {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      return _this3.spawn(..._this3.getBabelCmd(from, to));
    })();
  }

  mjsToJs(filename) {
    const mjs = this.mjs,
          js = this.js;

    return filename.endsWith(mjs) ? filename.slice(0, -mjs.length) + js : filename;
  }

  getBabelCmd(from, to, isFile) {
    return ['babel', ['--out-file', to, from]];
  }

  spawn(cmd, args) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      _this4.debug && console.log(cmd, ...args);
      return new _promise2.default(function (resolve, reject) {
        return spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] }).once('close', function (status, signal) {
          return status === 0 && !signal && resolve(status) || reject(_this4.getError(cmd, args, status, signal));
        }).on('error', reject);
      });
    })();
  }

  getError(cmd, args, status, signal) {
    let msg = `status code: ${status}`;
    if (signal) msg += ` signal: ${signal}`;
    msg += ` '${cmd} ${args.join(' ')}'`;
    const e = new Error(msg);
    (0, _assign2.default)(e, { status, signal, cmd, args });
    return e;
  }
}
exports.default = ZeroTranspiler;
