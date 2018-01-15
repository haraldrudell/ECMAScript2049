/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// rollup ECMAScript 2015: no class properties
import PackageJson from './PackageJson'

export default class RollupPackageJson extends PackageJson {
  getRollupFromJson() {
    const {json: {name, main, module, rollup: ro}} = this
    const {input, output, dependencies: dependenciesFlag, main: mainFlag, module: moduleFlag, shebang, clean, external, print, node, targets} = ro || {}
    return {
      name: this._getNonEmptyString(name, 'name'),
      main: this._getStringOrUndefined(main, 'main'),
      module: this._getStringOrUndefined(module, 'module'),
      print: this._getBoolean(print, 'rollup.print', false),
      clean: this._getArrayOfNonEmptyStringStringOrUndefined(clean, 'rollup.clean'),
      shebang: this._getBoolean(shebang, 'rollup.shebang', false),
      node: this._getBoolean(node, 'rollup.node', true),
      targets: this._getObjectStringOrUndefined(targets, 'rollup.targets', {node: '6.10'}),
      output: this._getArrayObjectOrUndefined(output),
      mainFlag: this._getBoolean(mainFlag, 'rollup.main', false),
      moduleFlag: this._getBoolean(moduleFlag, 'rollup.module', false),
      input: this._getArrayStringOrUndefined(input),
      external: this._getArrayOfNonEmptyStringStringOrUndefined(external, 'rollup.external'),
      dependencyList: this._getDependencyList(dependenciesFlag),
    }
  }

  _getDependencyList(dependenciesFlag) {
    let dependencyList
    if (dependenciesFlag !== false) {
      const {json: {dependencies}} = this
      if (dependencies) {
        const list = Object.keys(dependencies)
        if (list.length) dependencyList = this._getArrayOfNonEmptyString(list)
      }
    }
    return dependencyList
  }

  _getObjectStringOrUndefined(value, name, defaultValue) {
    return typeof value === 'object' ? value : this._getStringOrUndefined(value, name, defaultValue)
  }

  _getArrayObjectOrUndefined(output) {
    if (!Array.isArray(output) && typeof output !== 'object' && output !== undefined) {
      this._throw(`bad output value type: ${typeof output}`)
    }
    return output
  }

  _getArrayStringOrUndefined(input) {
    if (!Array.isArray(input)) this._getStringOrUndefined(input, 'rollup.input')
    return input
  }

  _getArrayOfNonEmptyStringStringOrUndefined(value, name) {
    return !Array.isArray(value)
      ? this._getStringOrUndefined(value, name)
      : this._getArrayOfNonEmptyString(value, name)
  }

  _getArrayOfNonEmptyString(value, name) {
    if (!Array.isArray(value)) this._throw(`${name}: not array`)
    for (let [index, v] of value.entries()) this._getNonEmptyString(v, `${name} index ${index}`)
    return value
  }

  _getStringOrUndefined(value, name, defaultValue) {
    return value !== undefined
      ? this._getNonEmptyString(value, name)
      : defaultValue
  }

  _getNonEmptyString(value, name) {
    const vt = typeof value
    if (vt !== 'string') this._throw(`${name} not non-empty string: ${vt}`)
    return value
  }

  _getBoolean(value, name, defaultValue) {
    if (value !== undefined) {
      const vt = typeof value
      if (vt !== 'boolean') this._throw(`${name} not boolean: ${vt}`)
      return value
    } else return defaultValue
  }

  _throw(message) {
    super._throw(message, 'RollupPackageJson')
  }
}
