/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs'

export default function chmodPlugin(mode) {
  return {
    name: 'chmod Rollup plugin',
    onwrite(bundle, data) {
      const filename = String(bundle && (bundle.file || bundle.dest) || '')
      if (!filename) throw new Error('chmod Rollup plugin.onwrite: filename missing')
      fs.chmodSync(filename, mode >= 0 ? Number(mode) : 0o755) // rwxr-xr-x
    },
  }
}
