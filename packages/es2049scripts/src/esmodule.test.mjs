/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// Invoke using Node.js v8.6+ (jest cannot do .mjs)
// node --experimental-modules src/esmodule.test
import * as babel from 'babel-helpers'
import * as es2049 from '../lib/es2049scripts.mjs'

console.log('babel', babel)
console.log('es2049', es2049)
