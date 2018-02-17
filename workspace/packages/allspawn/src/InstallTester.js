/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawnCapture} from 'allspawn'
//import {spawnCapture} from '../lib/spawn-async'

import fs from 'fs-extra'

import path from 'path'

export default class InstallTester {
  packagesDir = path.resolve('..')
  testsDir = path.join(this.packagesDir, '..', '..', 'tests')
  testProjectDir = path.join(this.testsDir, 'allspawn-test')
  testUsage = 'test-usage'
  testUsageDir = path.join(this.testProjectDir, this.testUsage)
  packagePath = process.cwd()
  packagePathRel = path.relative(this.testUsageDir, this.packagePath)
  es2049scripts = 'es2049scripts'
  allSpawn = 'allspawn'
  src = 'src'
  srcDir = path.join(this.testUsageDir, this.src)
  build = 'build'
  start = `es2049scripts -current ${this.src} ${this.build} node ${this.build}`
  indexMjs = 'index.mjs'
  indexMjsCode = [
    `import {spawnAsync} from '${this.allSpawn}'`,
    'f()',
    'async function f () {',
    `  await spawnAsync({args:['node', '--print', '"value is: " + (1+2)']})`,
    '}',
    '',
  ].join('\n')
  indexMjsOutput = 'value is: 3'
  static seconds10 = 1e4
  yarnAddTimeout = InstallTester.seconds10

  constructor(o) {
    const {debug, name: m = 'ScriptsTester'} = o || false
    Object.assign(this, {debug, m})
  }

  async test() {
    const {packagePathRel, es2049scripts, srcDir, indexMjs, indexMjsOutput} = this
    await this.getTestProjectDir()
    const testUsageDir = this.cwd = await this.getTestUsageDir()
    console.log(`${this.m} TEST in directory: ${testUsageDir}`)
    await this.run(['yarn', 'init', '--yes'], {stderrFails: false})
    await this.run(['yarn', 'add', packagePathRel, es2049scripts, '--dev'], {options: {timeout: this.yarnAddTimeout}})
    await this.ensureScriptsStart()
    await this.writeCode(srcDir, indexMjs)

    const {stdout} = await this.run(['yarn', 'start'])
    if (!stdout.includes(indexMjsOutput)) throw new Error(`${this.m} yarn start failed: output: '${stdout}' searched string: '${indexMjsOutput}'`)
    console.log(`${this.m}.test: code transpiled by es2049scripts executed successfully.`)
  }

  async getTestProjectDir() {
    const {testProjectDir} = this
    if (!await fs.pathExists(testProjectDir)) throw new Error(`${this.m} cannot find directory [entire monorepo must be present]: '${testProjectDir}'`)
    return testProjectDir
  }

  async getTestUsageDir() {
    const {testProjectDir} = this
    const testUsageDirectory = path.join(testProjectDir, this.testUsage)
    await fs.emptyDir(testUsageDirectory)
    return testUsageDirectory
  }

  async writeCode(dir, file) {
    await fs.ensureDir(dir)
    return fs.writeFile(path.join(dir, file), this.indexMjsCode)
  }

  async run(args, o) {
    const {cwd} = this
    const options = Object.assign({cwd}, o && o.options)
    o && delete o.options
    return spawnCapture(Object.assign({args, options, echo: true}, o))
  }

  async ensureScriptsStart() {
    const {start, cwd} = this
    const filename = path.join(cwd, 'package.json')
    const pj = JSON.parse(await fs.readFile(filename, 'utf8')) || {}
    const scripts = pj.scripts || (pj.scripts = {})
    if (!scripts.start) Object.assign(scripts, {start})
    return fs.writeFile(filename, JSON.stringify(pj, null, '\x20\x20'))
  }
}
