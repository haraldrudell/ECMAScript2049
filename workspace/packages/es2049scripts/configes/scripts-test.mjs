/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules src (v8.5+ v9.3+)
import ScriptsTester from './ScriptsTester'

const m = 'scripts-test'
let debug = true

run().catch(onReject)

async function run() {
  return new ScriptsTester({debug}).test()
}

function onReject(e) {
  debug && console.error(`${m} error handler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
