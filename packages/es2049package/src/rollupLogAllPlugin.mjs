/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs'
import path from 'path'

export default function logPlugin(withStack) {
  const m = 'logPlugin'
  const projectDir = fs.realpathSync(process.cwd())
  console.log('\n\n\n\n')

  /*
  Rollup plugins
  in the rollup config object, there is an array of plugins.
  A rollup plugin is a function that can be imported from another module or package
  In the plugin array, it is typically executed so that the actual value is an object with name and hook keys
  hooks are listed below

  instantiation takes place during import and execution of rollup.config.js
  therefore, instantiate cannot be async
  arguments are defined when invoked in config.rollup.js
  */
  log('instantiated', `withStack: ${!!withStack}`, new Error('instantiated'))

  function log(label, arg) {
    console.log(`• ${label} ${m}` + (arg ? `: ${arg}` : ''))
  }
  function resolvePath(filename, heading = 'id') {
    return `${heading}: ${filename.startsWith(projectDir)
      ? filename.substring(projectDir.length + 1)
      : filename}`
  }

  return {
    name: 'logPlugin',

    /*
    if rollup configuration is an array, each element representing a bundle file is processed in sequence

    for an input file: resolveId, load and transform are invoked for each import
    then into-outro are invoked
    then transformbundle, ongenerate, onwrite
    */
    resolveId(importee, importer) {
      /*
      importee: string provided in the import statement like 'src/rollup.config'
      importer: a previously resolved id, an absolute filename
      importer may be undefined
      may return promise value
      - null undefined: this resolver defers to other resolvers
      - falsey other than null undefined: this module is external
      - string: this is the id module filename to be loaded
      */
      const s = `importee: ${importee}` + (importer ? ` importer: ${importer}` : '')
      log('resolveId', s)
    },
    load(id) {
      /*
      id absolute filename with extension
      like /opt/foxyboy/sw/private/packages/rollupconfig/src/cleanbin.js
      may return promise value
      - null or undefined: defer to other loaders
      - object {code, map} ?
      - string loaded source code
      */
      log('load', resolvePath(id))
    },
    transform(code, id) {
      /*
      code is string, ie. ECMAScript source code
      id like for load
      may return a promise value
      - null undefined: no changes to the code
      - string transformed code
      */
      log('transform', `code chars: ${code.length} ${resolvePath(id)}`, new Error('transform'))
    },
    intro(/* no arguments */) { // no return value
      log('intro')
    },
    outro(/* no arguments */) { // no return value
      log('outro')
    },
    transformBundle(code, format) {
      /*
      code: string source code
      format: object like { format: 'cjs' }
      may return a promise value
      - null undefined: no changes to the code
      - string transformed code
      */
      log('transformBundle', `code chars: ${code.length} format: ${format.format}`, new Error('transformBundle'))
    },
    ongenerate(bundle, output) {
      /*
      invoked after the output has been generated
      bundle: object {bundle extend amd banner footer intro outro sourcemap name globals interop legacy indent strict noConflict paths file format}}
      - bundle.bundle: {imports exports modules generate write}
      options: object {code, map}
      no return value
      */
      log('ongenerate', `bundle id: ${bundle.file} code bytes: ${output.code.length}`)
    },
    onwrite(bundle, data) {
      /*
      invoked after the output file has been written
      may return a promise value
      */
      log('onwrite', `bundle: ${typeof bundle} data: ${typeof data}`)
      //return new Promise(r => setTimeout(() => console.log('DONE') + r(), 1e3))
    },
  }
}
