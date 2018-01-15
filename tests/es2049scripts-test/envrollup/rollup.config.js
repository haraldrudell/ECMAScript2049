/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

export default {
  input: path.resolve('src' , 'index.js'),
  output: {file: path.resolve('lib', 'index.js'), format: 'cjs'},
}
