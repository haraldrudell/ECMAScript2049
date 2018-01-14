/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default function printFilename() {
  return {visitor: {
    Program(nodePass, pluginPass) {
      console.log(`source file: ${pluginPass.file.opts.filename}`)
    },
  }}
}