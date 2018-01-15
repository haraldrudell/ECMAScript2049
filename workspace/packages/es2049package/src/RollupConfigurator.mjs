/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator
import RollupPackageJson from './RollupPackageJson'
import nodeIgnores from './nodepackages'

import path from 'path'
import fs from 'fs-extra'

const defaultInputs = ['src/index.js', 'src/index.mjs']
const defaultOutputDir = 'build'
const cjsFormat = 'cjs'
const esFormat = 'es'
const defaultExtension = '.js'
const nodeStable = '4.8'

export default class RollupConfigurator extends RollupPackageJson {
  assembleConfig(getConfig) {
    const pkg = this.getRollupFromJson() // package.json file cannot be imported because it is located by runtie cwd
    const configIsArray = Array.isArray(pkg.input)
    const config = configIsArray ? [] : {}

    if (pkg.print) console.log('package.json rollup.print true: verbose output')

    if (!configIsArray) { // input is undefined or non-empty string
      if (!pkg.input) pkg.input = this._getDefaultInput()
      if (!pkg.output) pkg.output = this._getDefaultOutput(pkg)
      Object.assign(pkg, {
        external: this._assembleExternal(pkg),
        targets: this._getTargets(pkg.targets, 'rollup'),
      })
      Object.assign(config, getConfig(pkg))
    } else {
      let {clean} = pkg
      const {main, module, name} = pkg
      for (let [index, inputElement] of pkg.input.entries()) {
        const m = `rollup.input index ${index}`
        const {input, output, dependencies,
          main: mainFlag, module: moduleFlag,
          external = pkg.external,
          node = pkg.node, print = pkg.print, shebang = pkg.shebang, targets = pkg.targets} = inputElement || false
        const dependencyList = dependencies
          ? pkg.dependencyList || this._getDependencyList(true)
          : undefined
        const o = {
          input: input ? this._getNonEmptyString(input, `${m}: input`) : this._getDefaultInput(),
          output: output ? this._getArrayObjectOrUndefined(output, `${m}: output`) : this._getElementOutput({main, module, name, mainFlag, moduleFlag, shebang}),
          external: this._assembleExternal({node, dependencyList, external}),
          name,
          main,
          module,
          clean,
          targets: this._getTargets(targets, `${m}: nodelatest`),
          print: this._getBoolean(print, `${m}: print`),
          shebang: this._getBoolean(shebang, `${m}: shebang`),
          mainFlag: this._getBoolean(mainFlag, `${m}: main`),
          moduleFlag: this._getBoolean(moduleFlag, `${m}: module`),
          node: this._getBoolean(node, `${m}: node`),
        }
        config.push(getConfig(o))
        clean = false
      }
    }

    return config
  }

  static deleteUndefined(config) {
    if (config) for (let property of Object.keys(config))
      if (config[property] === undefined) delete config[property]
  }

  _getTargets(targets, name) {
    if (targets === 'stable' || targets === undefined) targets = {node: nodeStable}
    else if (targets === 'current') targets = {node: 'current'}
    else if (targets !== 'mini') {
      const tt = typeof targets
      if (tt !== 'object') throw new Error(`${name} targets: not object 'stable' 'current' or undefined`)
    }
    return targets
  }
  _assembleExternal({node, dependencyList, external: ex}) {
    let external = [] // use array b/c elements has to be added to Set one by one
    if (ex)
      if (!Array.isArray(ex)) external.push(ex)
      else Array.prototype.push.apply(external, ex)
    if (node) Array.prototype.push.apply(external, nodeIgnores)
    if (dependencyList) Array.prototype.push.apply(external, dependencyList)
    return external.length ? Array.from(new Set(external)).sort() : undefined
  }

  _getElementOutput({main, module, name, mainFlag, moduleFlag, shebang}) {
    const o = {
      name,
      shebang,
    }
    if (moduleFlag) o.module = module
    if (mainFlag) o.main = main
    return this._getDefaultOutput(o)
  }

  _getDefaultOutput({main, module, name, shebang}) {
    let output
    if (module && !shebang && !this._hasExtension(module)) module += defaultExtension
    const outputEs = {file: module, format: esFormat}

    if (main) {
      if (!shebang && !this._hasExtension(main)) main += defaultExtension
      output = {file: main, format: cjsFormat}
      if (module)
        if (module !== main) output = [output, outputEs]
        else output = outputEs
    } else if (module) output = outputEs
    else {
      output = {file: path.join(defaultOutputDir, name), format: cjsFormat}
      if (!shebang) output.file += defaultExtension
    }
    return output
  }

  _getDefaultInput() {
    for (let input of defaultInputs) if (fs.pathExistsSync(input)) return input
    throw new Error(`RollupConfigurator cannot dertermine input: tried '${defaultInputs.join('\'\x20\'')}'`)
  }

  _hasExtension(filename) {
    return !!path.extname(filename).length
  }
}
