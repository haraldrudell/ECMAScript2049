/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'
// Export extension stage 1 180114
//export {value} from './rollup.config2' // this works, but rollup execution fails

const d = 2 ** 2
if (d !== 4) throw new Error(`ECMAScript 2016 exponentiation operator failed`)

if (xf(3) !== 3) throw new Error(`ECMAScript 2017 trailing function commas failed`)
function xf(a,) {
  return a
}

/* async wil not work with rollup
xg() // ECMAScript 2017 async function
async function xg() {
  await Promise.resolve()
}
*/

// Object rest spread stage 3 180114
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
let n = { x, y, ...z };

// class properties: stage 2 180114
class X {
  prop = 2
}

/* dynamic import wont work b/c it requires async
dynamicImport()
async function dynamicImport() {
  const x = await import('./envdefault4')
  if (typeof x !== 'object' || x.default !== 4) {
    console.error('dynamicImport', x)
    throw new Error('ECMAScript stage 2 180114 dynamic import failed')
  }
}
*/

export default {
  input: path.resolve('src' , 'index.js'),
  output: {file: path.resolve('lib', 'index.js'), format: 'cjs'},
}
