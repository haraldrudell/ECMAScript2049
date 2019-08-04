/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawnAsync, spawnCapture} from './spawn-async' // from allspawn package

import fs from 'fs-extra'

import path from 'path'

export default class ScriptsTester {
  packagesDir = path.resolve('..')
  testsDir = path.join(this.packagesDir, '..', '..', 'tests')
  testProjectDir = path.join(this.testsDir, 'es2049scripts-test') // from cwd: workspace/packages/es2049scripts
  testUsage = 'test-usage'
  testUsageDir = path.join(this.testProjectDir, this.testUsage)
  es2049scripts = 'es2049scripts'
  allSpawn = 'allspawn'
  start = 'es2049scripts -- node config'
  configES = 'configes'
  configESDir = path.join(this.testUsageDir, this.configES)
  indexMjs = 'index.mjs'
  indexMjsCode = [
    `import {spawnAsync} from \'${this.allSpawn}\'`,
    'f()',
    'async function f () {',
    '  await spawnAsync(\'node\', [\'--print\', \'"value is: " + (1+2)\'])',
    '}',
    '',
  ].join('\n')
  indexMjsOutput = 'value is: 3'

  constructor(o) {
    const {debug, name: m = 'ScriptsTester'} = o || false
    Object.assign(this, {debug, m})
  }

  async test() {
    const {es2049scripts, allSpawn} = this
    this.cwd = await this.getTestProjectDir()
    console.log(`${this.m} TESTING in directory: ${this.cwd}`)
    await this.useFsLinks(es2049scripts, allSpawn)
    await this.run('yarn', ['test'])

    const {configESDir, indexMjs, indexMjsOutput} = this
    this.cwd = await this.getTestUsageDir()
    console.log(`${this.m} TESTING in directory: ${this.cwd}`)
    await this.run('yarn', ['init', '--yes'])
    await this.useFsLinks(es2049scripts, allSpawn)
    await this.ensureScriptsStart()
    await this.writeCode(configESDir, indexMjs)

    await this.run('yarn', []) // install dependencies
    const {stdout} = await this.run('yarn', ['start'], true)
    if (!stdout.includes(indexMjsOutput)) throw new Error(`${this.m} yarn start failed: output: '${stdout}' search: ${indexMjsOutput}`)
    console.log(`${this.m}.test: code transpiled by es2049scripts executed successfully.`)
  }

  async getTestProjectDir() {
    const {testProjectDir} = this
    if (!await fs.pathExists(testProjectDir)) throw new Error(`${this.m} cannot find directory [entire monorepo must be present]: '${testProjectDir}'`)
    return testProjectDir
  }

  async getTestUsageDir() {
    const {testUsageDir} = this
    await fs.emptyDir(testUsageDir)
    return testUsageDir
  }

  async writeCode(dir, file) {
    await fs.ensureDir(dir)
    return fs.writeFile(path.join(dir, file), this.indexMjsCode)
  }

  async useFsLinks(...packages) {
    const {cwd, packagesDir} = this
    const paths = packages.map(p => path.relative(cwd, path.join(packagesDir, p)))
    return this.writeDependencies(packages, paths)
  }

  async useBetaVersions(...packages) {
    const versions = await Promise.all(packages.map(p => this.getWSBetaVersion(p)))
    return this.writeDependencies(packages, versions)
  }

  async writeDependencies(packages, values) {
    const {cwd} = this
    const filename = path.join(cwd, 'package.json')
    const json = await this.readJson(filename) || {}
    const devDependencies = json.devDependencies || (json.devDependencies = {})
    for (let [ix, p] of packages.entries()) devDependencies[p] = values[ix]
    return this.writeJson(filename, json)
  }

  async run(cmd, args, getStdout) {
    console.log(cmd, ...args)
    const {cwd} = this
    if (!getStdout) return spawnAsync(cmd, args, {cwd})
    else return spawnCapture(cmd, args, {cwd, stderrFails: true, doPipe: true})
  }

  async getWSBetaVersion(workspacePackage) {
    const {packagesDir} = this
    const filename = path.join(packagesDir, workspacePackage, 'package.json')
    const json = await this.readJson(filename)
    return this.getBetaVersion(filename, json, workspacePackage)
  }

  async readJson(filename) {
    let e
    const text = await fs.readFile(filename, 'utf8')
    const json = await this.parseJSON(text).catch(er => e = er)
    if (e) {
      console.error(`Failed to parse JSON from file: ${filename}`)
      const t = String(text)
      console.error(`Text: ${typeof text} ${t.length} '${t.substring(0, 50)}'`)
      throw Object.assign(e, {filename})
    }
    return json
  }

  async parseJSON(t) {
    return JSON.parse(t)
  }

  async writeJson(filename, json) {
    return fs.writeFile(filename, JSON.stringify(json, null, '\x20\x20'))
  }

  beta = '-beta'
  async getBetaVersion(filename, json, workspacePackage) {
    const {beta} = this
    let version = this.getNonEmptyStringValue(json, 'version', `package version for ${workspacePackage}`)
    if (version.endsWith(beta)) return version
    version = this.getNextPatchVersion(version, workspacePackage) + beta
    json.version = version
    await this.writeJson(filename, json)
    return version
  }

  getNextPatchVersion(version, workspacePackage) {
    const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/)
    if (!match) throw new Error(`${this.m} bad workspace package version: ${version} package: ${workspacePackage}`)
    const [major, minor, patch] = match.slice(1, 4).map(v => +v) // convert to Number
    //const [, major, minor, patch] = match
    return `${major}.${minor}.${patch + 1}`
  }

  getNonEmptyStringValue(json, key, msg) {
    const value = Object(json)[key]
    const tv = typeof value
    if (tv !== 'string' || !value) throw new Error(`${this.m} key value not non-empty string: ${tv} ${string}`)
    return value
  }

  async ensureScriptsStart() {
    const {start, cwd} = this
    const filename = path.join(cwd, 'package.json')
    const json = await this.readJson(filename) || {}
    const scripts = json.scripts || (json.scripts = {})
    if (!scripts.start) Object.assign(scripts, {start})
    return fs.writeJSON(filename, json)
  }
}
