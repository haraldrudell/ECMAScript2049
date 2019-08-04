/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

const m = rollupPrintPlugin.name

export default function rollupPrintPlugin(o) {
  const {ids = true, files = true, debug} = o || false
  debug && console.log(`${m} instantiated:2`, {ids, files, debug})
  return Object.assign({
    name: 'print plugin',
  }, ids ? {resolveId: rollupPrintPluginPrintId}: {},
  files ? {load: rollupPrintPluginPrintFile} : {})
}

const idMap = {}

function rollupPrintPluginPrintId(importee, importer) {
  if (importee && idMap[importee]) return
  idMap[importee] = true

  let s =
  `resolving: ${ensureNonEmptyString(importee, 'resolve importee')}` +
  ` referenced by: ${importer !== undefined
    ? ensureNonEmptyString(importer, 'resolve importer')
     : 'Rollup configuration object'}`
  console.log(s)
}

function rollupPrintPluginPrintFile(id) {
  const absolute = ensureNonEmptyString(id, 'load id')
  const relative = path.relative('', absolute)
  console.log(`loading: ${relative}`)
}

function ensureNonEmptyString(value, message) {
  const tv = typeof value
  if (!value || tv !== 'string') throw new Error(`${m} ${message}: not non-empty string: type: ${tv}`)
  return value
}
