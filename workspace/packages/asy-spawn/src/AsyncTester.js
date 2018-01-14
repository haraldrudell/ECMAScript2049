/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import spawn from './spawn-async-js'

import fs from 'fs-extra'

import path from 'path'

export default class AsyncTester {
  testProjectDir = path.resolve('..', '..', '..', 'spawn-test')
  testUsage = 'test-usage'
  testUsageDir = path.join(this.testProjectDir, this.testUsage)
  packagePath = process.cwd()
  packagePathRel = path.relative(this.testUsageDir, this.packagePath)
  es2049scripts = 'es2049scripts'
  src = 'src'
  srcDir = path.join(this.testUsageDir, this.src)
  build = 'build'
  start = `es2049scripts -current ${this.src} ${this.build} node ${this.build}`
  indexMjs = 'index.mjs'
  indexMjsCode =
    "import spawn from 'asy-spawn'\n" +
    "f()\n" +
    "async function f () {\n" +
    "  const v = await spawn('node', ['--print', '\"value is: \" + (1+2)'])\n" +
    "  console.log(v)\n" +
    "}\n"
  indexMjsOutput = 'value is: 3'

  constructor(o) {
    const {debug, name: m = 'ScriptsTester'} = o || false
    Object.assign(this, {debug, m})
  }

  async test() {
    const {packagePathRel, es2049scripts, srcDir, indexMjs} = this
    await this.getTestProjectDir()
    const testUsageDir = this.cwd = await this.getTestUsageDir()
    await this.run('yarn', ['init', '--yes'])
    await this.run('yarn', ['add', packagePathRel, es2049scripts, '--dev'])
    await this.ensureScriptsStart()
    await this.writeCode(srcDir, indexMjs)

    const stdout = await this.run('yarn', ['start'], true)
    const expected = this.indexMjsOutput
    if (!stdout.includes(expected)) throw new Error(`${this.m} yarn start failed: output: '${stdout}' search: ${expected}`)
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

  async run(cmd, args, getStdout) {
    console.log(cmd, ...args)
    const {cwd} = this
    if (!getStdout) return spawn(cmd, args, {cwd})

    const cp = {}
    const p = spawn(cmd, args, {cwd, stdio: ['ignore', 'pipe', 'inherit']}, cp)
    const cmdStdout = cp.cp.stdout
    const {stdout} = process
    let output = ''
    function dataLogger(d) {
      output += d
    }
    cmdStdout.on('data', dataLogger)
      .setEncoding('utf8')
      .pipe(stdout)
    let e
    await p.catch(er => e = er)
    cmdStdout.removeListener('data', dataLogger)
    if (e) throw e
    return output
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
