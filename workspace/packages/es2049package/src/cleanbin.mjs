/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import clean from './clean'

import fs from 'fs-extra'

import path from 'path'

const m = 'cleanbin'
let debug

doClean(process.argv.slice(2)).catch(onReject)

async function doClean(argv) {
  for (let [ix, arg] of argv.entries()) arg === '-debug' && (debug = true) && argv.splice(ix, 1)
  const entries = argv.length ? argv : await readJsonRollupClean()
  debug && console.log(`${m} entries: ${entries} argv.length: ${argv.length}`)
  return clean(entries)
}

async function readJsonRollupClean() {
  const json = JSON.parse(await fs.readFile(path.resolve('package.json'), 'utf8'))
  return json && json.rollup && json.rollup.clean
}

function onReject(e) {
  debug && console.error(`${m} error handler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
