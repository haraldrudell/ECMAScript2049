"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawnAsync = require("./spawn-async");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ScriptsTester {
  // from cwd: workspace/packages/es2049scripts
  constructor(o) {
    _defineProperty(this, "packagesDir", _path.default.resolve('..'));

    _defineProperty(this, "testsDir", _path.default.join(this.packagesDir, '..', '..', 'tests'));

    _defineProperty(this, "testProjectDir", _path.default.join(this.testsDir, 'es2049scripts-test'));

    _defineProperty(this, "testUsage", 'test-usage');

    _defineProperty(this, "testUsageDir", _path.default.join(this.testProjectDir, this.testUsage));

    _defineProperty(this, "es2049scripts", 'es2049scripts');

    _defineProperty(this, "allSpawn", 'allspawn');

    _defineProperty(this, "start", 'es2049scripts -- node config');

    _defineProperty(this, "configES", 'configes');

    _defineProperty(this, "configESDir", _path.default.join(this.testUsageDir, this.configES));

    _defineProperty(this, "indexMjs", 'index.mjs');

    _defineProperty(this, "indexMjsCode", [`import {spawnAsync} from \'${this.allSpawn}\'`, 'f()', 'async function f () {', '  await spawnAsync(\'node\', [\'--print\', \'"value is: " + (1+2)\'])', '}', ''].join('\n'));

    _defineProperty(this, "indexMjsOutput", 'value is: 3');

    _defineProperty(this, "beta", '-beta');

    const {
      debug,
      name: m = 'ScriptsTester'
    } = o || false;
    Object.assign(this, {
      debug,
      m
    });
  }

  async test() {
    const {
      es2049scripts,
      allSpawn
    } = this;
    this.cwd = await this.getTestProjectDir();
    console.log(`${this.m} TESTING in directory: ${this.cwd}`);
    await this.useFsLinks(es2049scripts, allSpawn);
    await this.run('yarn', ['test']);
    const {
      configESDir,
      indexMjs,
      indexMjsOutput
    } = this;
    this.cwd = await this.getTestUsageDir();
    console.log(`${this.m} TESTING in directory: ${this.cwd}`);
    await this.run('yarn', ['init', '--yes']);
    await this.useFsLinks(es2049scripts, allSpawn);
    await this.ensureScriptsStart();
    await this.writeCode(configESDir, indexMjs);
    await this.run('yarn', []); // install dependencies

    const {
      stdout
    } = await this.run('yarn', ['start'], true);
    if (!stdout.includes(indexMjsOutput)) throw new Error(`${this.m} yarn start failed: output: '${stdout}' search: ${indexMjsOutput}`);
    console.log(`${this.m}.test: code transpiled by es2049scripts executed successfully.`);
  }

  async getTestProjectDir() {
    const {
      testProjectDir
    } = this;
    if (!(await _fsExtra.default.pathExists(testProjectDir))) throw new Error(`${this.m} cannot find directory [entire monorepo must be present]: '${testProjectDir}'`);
    return testProjectDir;
  }

  async getTestUsageDir() {
    const {
      testUsageDir
    } = this;
    await _fsExtra.default.emptyDir(testUsageDir);
    return testUsageDir;
  }

  async writeCode(dir, file) {
    await _fsExtra.default.ensureDir(dir);
    return _fsExtra.default.writeFile(_path.default.join(dir, file), this.indexMjsCode);
  }

  async useFsLinks(...packages) {
    const {
      cwd,
      packagesDir
    } = this;
    const paths = packages.map(p => _path.default.relative(cwd, _path.default.join(packagesDir, p)));
    return this.writeDependencies(packages, paths);
  }

  async useBetaVersions(...packages) {
    const versions = await Promise.all(packages.map(p => this.getWSBetaVersion(p)));
    return this.writeDependencies(packages, versions);
  }

  async writeDependencies(packages, values) {
    const {
      cwd
    } = this;

    const filename = _path.default.join(cwd, 'package.json');

    const json = (await this.readJson(filename)) || {};
    const devDependencies = json.devDependencies || (json.devDependencies = {});

    for (let [ix, p] of packages.entries()) devDependencies[p] = values[ix];

    return this.writeJson(filename, json);
  }

  async run(cmd, args, getStdout) {
    console.log(cmd, ...args);
    const {
      cwd
    } = this;
    if (!getStdout) return (0, _spawnAsync.spawnAsync)(cmd, args, {
      cwd
    });else return (0, _spawnAsync.spawnCapture)(cmd, args, {
      cwd,
      stderrFails: true,
      doPipe: true
    });
  }

  async getWSBetaVersion(workspacePackage) {
    const {
      packagesDir
    } = this;

    const filename = _path.default.join(packagesDir, workspacePackage, 'package.json');

    const json = await this.readJson(filename);
    return this.getBetaVersion(filename, json, workspacePackage);
  }

  async readJson(filename) {
    let e;
    const text = await _fsExtra.default.readFile(filename, 'utf8');
    const json = await this.parseJSON(text).catch(er => e = er);

    if (e) {
      console.error(`Failed to parse JSON from file: ${filename}`);
      const t = String(text);
      console.error(`Text: ${typeof text} ${t.length} '${t.substring(0, 50)}'`);
      throw Object.assign(e, {
        filename
      });
    }

    return json;
  }

  async parseJSON(t) {
    return JSON.parse(t);
  }

  async writeJson(filename, json) {
    return _fsExtra.default.writeFile(filename, JSON.stringify(json, null, '\x20\x20'));
  }

  async getBetaVersion(filename, json, workspacePackage) {
    const {
      beta
    } = this;
    let version = this.getNonEmptyStringValue(json, 'version', `package version for ${workspacePackage}`);
    if (version.endsWith(beta)) return version;
    version = this.getNextPatchVersion(version, workspacePackage) + beta;
    json.version = version;
    await this.writeJson(filename, json);
    return version;
  }

  getNextPatchVersion(version, workspacePackage) {
    const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) throw new Error(`${this.m} bad workspace package version: ${version} package: ${workspacePackage}`);
    const [major, minor, patch] = match.slice(1, 4).map(v => +v); // convert to Number
    //const [, major, minor, patch] = match

    return `${major}.${minor}.${patch + 1}`;
  }

  getNonEmptyStringValue(json, key, msg) {
    const value = Object(json)[key];
    const tv = typeof value;
    if (tv !== 'string' || !value) throw new Error(`${this.m} key value not non-empty string: ${tv} ${string}`);
    return value;
  }

  async ensureScriptsStart() {
    const {
      start,
      cwd
    } = this;

    const filename = _path.default.join(cwd, 'package.json');

    const json = (await this.readJson(filename)) || {};
    const scripts = json.scripts || (json.scripts = {});
    if (!scripts.start) Object.assign(scripts, {
      start
    });
    return _fsExtra.default.writeJSON(filename, json);
  }

}

exports.default = ScriptsTester;
