'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _spawnAsync = require('./spawn-async');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// from allspawn package

class ScriptsTester {
  // from cwd: workspace/packages/es2049scripts
  constructor(o) {
    this.packagesDir = _path2.default.resolve('..');
    this.testsDir = _path2.default.join(this.packagesDir, '..', '..', 'tests');
    this.testProjectDir = _path2.default.join(this.testsDir, 'es2049scripts-test');
    this.testUsage = 'test-usage';
    this.testUsageDir = _path2.default.join(this.testProjectDir, this.testUsage);
    this.es2049scripts = 'es2049scripts';
    this.allSpawn = 'allspawn';
    this.start = 'es2049scripts -- node config';
    this.configES = 'configes';
    this.configESDir = _path2.default.join(this.testUsageDir, this.configES);
    this.indexMjs = 'index.mjs';
    this.indexMjsCode = [`import {spawnAsync} from \'${this.allSpawn}\'`, 'f()', 'async function f () {', '  await spawnAsync(\'node\', [\'--print\', \'"value is: " + (1+2)\'])', '}', ''].join('\n');
    this.indexMjsOutput = 'value is: 3';
    this.beta = '-beta';

    var _ref = o || false;

    const debug = _ref.debug;
    var _ref$name = _ref.name;
    const m = _ref$name === undefined ? 'ScriptsTester' : _ref$name;

    (0, _assign2.default)(this, { debug, m });
  }

  test() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const es2049scripts = _this.es2049scripts,
            allSpawn = _this.allSpawn;

      _this.cwd = yield _this.getTestProjectDir();
      console.log(`${_this.m} TESTING in directory: ${_this.cwd}`);
      yield _this.useFsLinks(es2049scripts, allSpawn);
      yield _this.run('yarn', ['test']);

      const configESDir = _this.configESDir,
            indexMjs = _this.indexMjs,
            indexMjsOutput = _this.indexMjsOutput;

      _this.cwd = yield _this.getTestUsageDir();
      console.log(`${_this.m} TESTING in directory: ${_this.cwd}`);
      yield _this.run('yarn', ['init', '--yes']);
      yield _this.useFsLinks(es2049scripts, allSpawn);
      yield _this.ensureScriptsStart();
      yield _this.writeCode(configESDir, indexMjs);

      yield _this.run('yarn', []); // install dependencies

      var _ref2 = yield _this.run('yarn', ['start'], true);

      const stdout = _ref2.stdout;

      if (!stdout.includes(indexMjsOutput)) throw new Error(`${_this.m} yarn start failed: output: '${stdout}' search: ${indexMjsOutput}`);
      console.log(`${_this.m}.test: code transpiled by es2049scripts executed successfully.`);
    })();
  }

  getTestProjectDir() {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const testProjectDir = _this2.testProjectDir;

      if (!(yield _fsExtra2.default.pathExists(testProjectDir))) throw new Error(`${_this2.m} cannot find directory [entire monorepo must be present]: '${testProjectDir}'`);
      return testProjectDir;
    })();
  }

  getTestUsageDir() {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const testUsageDir = _this3.testUsageDir;

      yield _fsExtra2.default.emptyDir(testUsageDir);
      return testUsageDir;
    })();
  }

  writeCode(dir, file) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      yield _fsExtra2.default.ensureDir(dir);
      return _fsExtra2.default.writeFile(_path2.default.join(dir, file), _this4.indexMjsCode);
    })();
  }

  useFsLinks(...packages) {
    var _this5 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const cwd = _this5.cwd,
            packagesDir = _this5.packagesDir;

      const paths = packages.map(function (p) {
        return _path2.default.relative(cwd, _path2.default.join(packagesDir, p));
      });
      return _this5.writeDependencies(packages, paths);
    })();
  }

  useBetaVersions(...packages) {
    var _this6 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const versions = yield _promise2.default.all(packages.map(function (p) {
        return _this6.getWSBetaVersion(p);
      }));
      return _this6.writeDependencies(packages, versions);
    })();
  }

  writeDependencies(packages, values) {
    var _this7 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const cwd = _this7.cwd;

      const filename = _path2.default.join(cwd, 'package.json');
      const json = (yield _this7.readJson(filename)) || {};
      const devDependencies = json.devDependencies || (json.devDependencies = {});
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(packages.entries()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let _ref3 = _step.value;

          var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

          let ix = _ref4[0];
          let p = _ref4[1];
          devDependencies[p] = values[ix];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _this7.writeJson(filename, json);
    })();
  }

  run(cmd, args, getStdout) {
    var _this8 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      console.log(cmd, ...args);
      const cwd = _this8.cwd;

      if (!getStdout) return (0, _spawnAsync.spawnAsync)(cmd, args, { cwd });else return (0, _spawnAsync.spawnCapture)(cmd, args, { cwd, stderrFails: true, doPipe: true });
    })();
  }

  getWSBetaVersion(workspacePackage) {
    var _this9 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const packagesDir = _this9.packagesDir;

      const filename = _path2.default.join(packagesDir, workspacePackage, 'package.json');
      const json = yield _this9.readJson(filename);
      return _this9.getBetaVersion(filename, json, workspacePackage);
    })();
  }

  readJson(filename) {
    var _this10 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let e;
      const text = yield _fsExtra2.default.readFile(filename, 'utf8');
      const json = yield _this10.parseJSON(text).catch(function (er) {
        return e = er;
      });
      if (e) {
        console.error(`Failed to parse JSON from file: ${filename}`);
        const t = String(text);
        console.error(`Text: ${typeof text} ${t.length} '${t.substring(0, 50)}'`);
        throw (0, _assign2.default)(e, { filename });
      }
      return json;
    })();
  }

  parseJSON(t) {
    return (0, _asyncToGenerator3.default)(function* () {
      return JSON.parse(t);
    })();
  }

  writeJson(filename, json) {
    return (0, _asyncToGenerator3.default)(function* () {
      return _fsExtra2.default.writeFile(filename, (0, _stringify2.default)(json, null, '\x20\x20'));
    })();
  }

  getBetaVersion(filename, json, workspacePackage) {
    var _this11 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const beta = _this11.beta;

      let version = _this11.getNonEmptyStringValue(json, 'version', `package version for ${workspacePackage}`);
      if (version.endsWith(beta)) return version;
      version = _this11.getNextPatchVersion(version, workspacePackage) + beta;
      json.version = version;
      yield _this11.writeJson(filename, json);
      return version;
    })();
  }

  getNextPatchVersion(version, workspacePackage) {
    const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) throw new Error(`${this.m} bad workspace package version: ${version} package: ${workspacePackage}`);

    var _match$slice$map = match.slice(1, 4).map(v => +v),
        _match$slice$map2 = (0, _slicedToArray3.default)(_match$slice$map, 3);

    const major = _match$slice$map2[0],
          minor = _match$slice$map2[1],
          patch = _match$slice$map2[2]; // convert to Number
    //const [, major, minor, patch] = match

    return `${major}.${minor}.${patch + 1}`;
  }

  getNonEmptyStringValue(json, key, msg) {
    const value = Object(json)[key];
    const tv = typeof value;
    if (tv !== 'string' || !value) throw new Error(`${this.m} key value not non-empty string: ${tv} ${string}`);
    return value;
  }

  ensureScriptsStart() {
    var _this12 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const start = _this12.start,
            cwd = _this12.cwd;

      const filename = _path2.default.join(cwd, 'package.json');
      const json = (yield _this12.readJson(filename)) || {};
      const scripts = json.scripts || (json.scripts = {});
      if (!scripts.start) (0, _assign2.default)(scripts, { start });
      return _fsExtra2.default.writeJSON(filename, json);
    })();
  }
}
exports.default = ScriptsTester; /*
                                 © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                 This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                                 */
