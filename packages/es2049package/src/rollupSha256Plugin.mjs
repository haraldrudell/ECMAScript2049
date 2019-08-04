/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {Hash} from 'crypto'
import path from 'path'

const m = rollupSha256Plugin.name

export default function rollupSha256Plugin(o) {
  const {debug} = o || false
  debug && console.log(`${m} instantiated:`, o)
  return {
    name: 'sha256Plugin', // a rollup plugin
    onwrite: rollupSha256PluginPrintSha256,
  }
}

function rollupSha256PluginPrintSha256(bundle, data) {
  const {file} = bundle || false
  const {code} = data || false
  const ft = typeof file
  if (!file || ft !== 'string') throw new Error(`${m} bundle.file not non-empty string`)
  const fileBase = path.basename(file)
  const hash = new Hash('sha256').update(code).digest('hex')
  const length = Object(code).length
  console.log(`${fileBase} bytes: ${length} sha256: ${hash}`)
}
