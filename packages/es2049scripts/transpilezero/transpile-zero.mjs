/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules (v8.5+ v9.3+)
//import ZeroTranspiler from './ZeroTranspiler'

const m = 'transpile-zero'
let debug

run(process.argv.slice(2)).catch(onRejected)

async function run(argv) {
  debug = argv[0] === '-debug'
  // babel will concatenate this script with ./ZeroTranspiler
  // package.json scripts.transpilezero:babel
  await Promise.resolve() // wait for the class to parse
  return new ZeroTranspiler({debug}).transpile()
}

function onRejected(e) {
  debug && console.error(`${m} error handler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
