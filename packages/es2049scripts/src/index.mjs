/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules src (v8.5+ v9.3+)
import ScriptTranspiler from './ScriptTranspiler'
import launch from './launcher'
import pjson from '../package.json'
import parseOptions from './parseOptions'

const nameField = Object(pjson).name
const verField = Object(pjson).version
const m = String(nameField || 'src/index')
let debug

run(String(nameField || 'es2049scripts'), String(verField || 'unknown version'), process.argv.slice(2)).catch(errorHandler)

async function run(name, version, argv) {
  const {filenames, options, args} = parseOptions({argv, name, version})
  options.debug && (debug = true)
  debug && console.log(options, filenames)
  await new ScriptTranspiler(options).transpile(filenames)
  if (args) {
    debug && console.log(args.join(' '))
    return launch({cmd: args.shift(), args})
  }
}

function errorHandler(e) {
  debug && console.error(`${m} error handler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
