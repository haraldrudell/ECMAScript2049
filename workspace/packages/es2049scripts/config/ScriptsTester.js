'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _spawnAsync = require('./spawn-async');

var _spawnAsync2 = _interopRequireDefault(_spawnAsync);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScriptsTester {

  constructor(o) {
    this.testProjectDirectory = ['..', '..', '..', '..', 'es2049scripts-test'];
    this.testProject = _path2.default.resolve(...this.testProjectDirectory);
    this.testUsageDirectory = 'test-usage';
    this.package = 'es2049scripts';
    this.start = 'es2049scripts -- node config';
    this.configES = 'configes';
    this.indexMjs = 'index.mjs';

    var _ref = o || false;

    const debug = _ref.debug;
    var _ref$name = _ref.name;
    const m = _ref$name === undefined ? 'ScriptsTester' : _ref$name;

    (0, _assign2.default)(this, { debug, m });
  }

  test() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      _this.cwd = yield _this.getTestProject();
      yield _this.run('yarn', ['install']);
      yield _this.run('yarn', ['test']);

      _this.cwd = yield _this.getTestUsageDirectory();
      yield _this.run('yarn', ['init', '--yes']);
      yield _this.run('yarn', ['add', _this.package, '--dev']);
      yield _this.ensureScriptsStart();
      yield _this.writeCode();

      const stdout = yield _this.run('yarn', ['start'], true);
      const expected = _this.indexMjsOutput();
      if (!stdout.includes(expected)) throw new Error(`${_this.m} yarn start failed: output: '${stdout}' search: ${expected}`);
      console.log(`${_this.m}.test: code transpiled by es2049scripts executed successfully.`);
    })();
  }

  getTestProject() {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const testProject = _this2.testProject;

      if (!(yield _fsExtra2.default.pathExists(testProject))) throw new Error(`${_this2.m} cannot find directory [entire monorepo must be present]: '${testProject}'`);
      return testProject;
    })();
  }

  getTestUsageDirectory() {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const testProject = _this3.testProject;

      const testUsageDirectory = _path2.default.join(testProject, _this3.testUsageDirectory);
      yield _fsExtra2.default.emptyDir(testUsageDirectory);
      return testUsageDirectory;
    })();
  }

  writeCode() {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const cwd = _this4.cwd,
            configES = _this4.configES,
            indexMjs = _this4.indexMjs;

      const configes = _path2.default.join(cwd, configES);
      yield _fsExtra2.default.ensureDir(configes);
      const code = _this4.indexMjsCode();
      return _fsExtra2.default.writeFile(_path2.default.join(configes, indexMjs), code);
    })();
  }

  run(cmd, args, getStdout) {
    var _this5 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      console.log(cmd, ...args);
      const cwd = _this5.cwd;

      if (!getStdout) return (0, _spawnAsync2.default)(cmd, args, { cwd });

      const cp = {};
      const p = (0, _spawnAsync2.default)(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }, cp);
      const cmdStdout = cp.cp.stdout;
      var _process = process;
      const stdout = _process.stdout;

      let output = '';
      function dataLogger(d) {
        output += d;
      }
      cmdStdout.on('data', dataLogger).setEncoding('utf8').pipe(stdout);
      let e;
      yield p.catch(function (er) {
        return e = er;
      });
      cmdStdout.removeListener('data', dataLogger);
      if (e) throw e;
      return output;
    })();
  }

  ensureScriptsStart() {
    var _this6 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const start = _this6.start,
            cwd = _this6.cwd;

      const filename = _path2.default.join(cwd, 'package.json');
      const pj = JSON.parse((yield _fsExtra2.default.readFile(filename, 'utf8'))) || {};
      const scripts = pj.scripts || (pj.scripts = {});
      if (!scripts.start) (0, _assign2.default)(scripts, { start });
      return _fsExtra2.default.writeFile(filename, (0, _stringify2.default)(pj, null, '\x20\x20'));
    })();
  }

  indexMjsCode() {
    return "console.log('The next ReactJS version:')\n" + "f()\n" + "async function f () {\n" + "  for await (let v of [Promise.resolve(17)])\n" + "  console.log(v)\n" + "}\n";
  }

  indexMjsOutput() {
    return 'The next ReactJS version:\n17';
  }
}
exports.default = ScriptsTester; /*
                                 © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                 This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                                 */
