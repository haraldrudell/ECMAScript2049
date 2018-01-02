/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs'

export default function chmodPlugin(mode) {
  return {
    name: 'chmodPlugin',
    onwrite(bundle, data) {
      const filename = bundle && (bundle.file || bundle.dest)
      if (!filename) throw new Error('chmodPlugin.onwrite: filename missing')
      fs.chmodSync(filename, mode >= 0 ? Number(mode) : 0o755) // rwxr-xr-x
    },
  }
}
