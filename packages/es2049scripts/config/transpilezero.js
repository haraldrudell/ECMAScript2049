"use strict";

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules (v8.5+ v9.3+)
//import ZeroTranspiler from './ZeroTranspiler'
const m = 'transpile-zero';
let debug;
run().catch(onRejected);

async function run() {
  const argv = process.argv.slice(2);
  debug = argv[0] === '-debug'; // babel will concatenate this script with ./ZeroTranspiler
  // package.json scripts.transpilezero:babel

  await Promise.resolve(); // wait for the class to parse

  return new ZeroTranspiler({
    debug
  }).transpile();
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`);
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`);
  console.error(!debug ? e.message : e);
  process.exit(1);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const spawn = _child_process.default.spawn;

class ZeroTranspiler {
  constructor(o) {
    _defineProperty(this, "config", 'config');

    _defineProperty(this, "configRollup", 'configrollup');

    _defineProperty(this, "configES", 'configes');

    _defineProperty(this, "mjs", '.mjs');

    _defineProperty(this, "js", '.js');

    _defineProperty(this, "babelrc", _path.default.resolve('config/babel85.js'));

    _defineProperty(this, "babeles", _path.default.resolve('config/babeles.js'));

    const {
      debug
    } = o || false;
    Object.assign(this, {
      debug
    });
  }

  async transpile() {
    const {
      config,
      configRollup,
      configES,
      babelrc,
      babeles
    } = this;
    await this.transpileFilesMjsToJs(configRollup, config, babeles);
    return this.transpileFilesMjsToJs(configES, config, babelrc);
  }

  async transpileFilesMjsToJs(fromDirectory, toDirectory, babelrc) {
    return Promise.all((await _fsExtra.default.readdir(fromDirectory)).map(file => this.transpileFile(_path.default.join(fromDirectory, file), _path.default.join(toDirectory, this.mjsToJs(file)), babelrc)));
  }

  async transpileFile(from, to, babelrc) {
    return this.spawn(...this.getBabelCmd(from, to, babelrc));
  }

  mjsToJs(filename) {
    const {
      mjs,
      js
    } = this;
    return filename.endsWith(mjs) ? filename.slice(0, -mjs.length) + js : filename;
  }

  getBabelCmd(from, to, babelrc) {
    return ['babel', ['--out-file', to, '--config-file', babelrc, from]];
  }

  async spawn(cmd, args) {
    this.debug && console.log(cmd, ...args);
    return new Promise((resolve, reject) => spawn(cmd, args, {
      stdio: ['ignore', 'inherit', 'inherit']
    }).once('close', (status, signal) => status === 0 && !signal && resolve(status) || reject(this.getError(cmd, args, status, signal))).on('error', reject));
  }

  getError(cmd, args, status, signal) {
    let msg = `status code: ${status}`;
    if (signal) msg += ` signal: ${signal}`;
    msg += ` '${cmd} ${args.join(' ')}'`;
    const e = new Error(msg);
    Object.assign(e, {
      status,
      signal,
      cmd,
      args
    });
    return e;
  }

}

exports.default = ZeroTranspiler;
