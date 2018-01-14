/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import spawn from './spawn-async'

import fs from 'fs-extra'

import path from 'path'

export default class ScriptsTester {
  testProjectDirectory = ['..', '..', '..', '..', 'es2049scripts-test']
  testProject = path.resolve(...this.testProjectDirectory)
  testUsageDirectory = 'test-usage'
  package = 'es2049scripts'
  start = 'es2049scripts -- node config'
  configES = 'configes'
  indexMjs = 'index.mjs'

  constructor(o) {
    const {debug, name: m = 'ScriptsTester'} = o || false
    Object.assign(this, {debug, m})
  }

  async test() {
    this.cwd = await this.getTestProject()
    await this.run('yarn', ['install'])
    await this.run('yarn', ['test'])

    this.cwd = await this.getTestUsageDirectory()
    await this.run('yarn', ['init', '--yes'])
    await this.run('yarn', ['add', this.package, '--dev'])
    await this.ensureScriptsStart()
    await this.writeCode()

    const stdout = await this.run('yarn', ['start'], true)
    const expected = this.indexMjsOutput()
    if (!stdout.includes(expected)) throw new Error(`${this.m} yarn start failed: output: '${stdout}' search: ${expected}`)
    console.log(`${this.m}.test: code transpiled by es2049scripts executed successfully.`)
  }

  async getTestProject() {
    const {testProject} = this
    if (!await fs.pathExists(testProject)) throw new Error(`${this.m} cannot find directory [entire monorepo must be present]: '${testProject}'`)
    return testProject
  }

  async getTestUsageDirectory() {
    const {testProject} = this
    const testUsageDirectory = path.join(testProject, this.testUsageDirectory)
    await fs.emptyDir(testUsageDirectory)
    return testUsageDirectory
  }

  async writeCode() {
    const {cwd, configES, indexMjs} = this
    const configes = path.join(cwd, configES)
    await fs.ensureDir(configes)
    const code = this.indexMjsCode()
    return fs.writeFile(path.join(configes, indexMjs), code)
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

  indexMjsCode() {
    return (
      "console.log('The next ReactJS version:')\n" +
      "f()\n" +
      "async function f () {\n" +
      "  for await (let v of [Promise.resolve(17)])\n" +
      "  console.log(v)\n" +
      "}\n"
    )
  }

  indexMjsOutput() {
    return 'The next ReactJS version:\n17'
  }
}
