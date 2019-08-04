/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

const m = babelPrintFilenamePlugin.name

export default function babelPrintFilenamePlugin(o) {
  const {debug} = o || false
  debug && console.log(`${m} instantiated: `, o)
  return {
    visitor: {
      Program: babelPrintFilenamePluginPrintFilename,
    }}
}

function babelPrintFilenamePluginPrintFilename(nodePass, pluginPass) {
  const filename = String(Object(Object(Object(pluginPass).file).opts).filename || '')
  if (!filename) throw new Error(`${m}: filename empty`)
  const relative = path.relative('', filename)
  console.log(`babel processing: ${relative}`)
}
