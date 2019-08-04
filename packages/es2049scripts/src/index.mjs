/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules src (v8.5+ v9.3+)
import ScriptTranspiler from './ScriptTranspiler'
import launch from './launcher'
import pjson from '../package.json'
import parseOptions from './parseOptions'

const defName = 'es2049scripts'
const defVersion = 'unknown version'
const defMarker = 'src/index'

const pjName = Object(pjson).name
const pjVersion = Object(pjson).version

const m = String(pjName || defMarker)
let debug

run().catch(onRejected)

async function run() {
  const argv = process.argv.slice(2)
  const name = String(pjName || defName)
  const version = String(pjVersion || defVersion)
  const {filenames, options, args} = parseOptions({argv, name, version})
  options.debug && (debug = true) && console.log(`${name}.run:`, options, filenames)

  await new ScriptTranspiler(options).transpile(filenames)

  if (args) {
    debug && console.log(`${name}.launch:`, ...args)
    return launch({cmd: args.shift(), args})
  }
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
