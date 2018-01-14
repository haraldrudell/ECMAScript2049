/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default function printFilename() {
  return {visitor: {
    Program(nodePass, pluginPass) {
      console.log(`source file: ${pluginPass.file.opts.filename}`)
    },
  }}
}
