/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules src (v8.5+ v9.3+)
import Build from './Build'
import pjson from '../package.json'

const nameField = Object(pjson).name
const m = String(nameField || 'src/index')
let debug = true // TODO set to undefined

run().catch(errorHandler)

async function run() {
  return new Build(). build()
}

function errorHandler(e) {
  debug && console.error(`${m} error handler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
