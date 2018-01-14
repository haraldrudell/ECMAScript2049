/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export * from 'fs'
export resolve from 'path'
import {a} from './envdefault3.js'
import * as b from './envdefault'
import * as c from './envdefault5'

class X {
  prop = 2
}

agf()
async function* agf() {}

const a1 = {a: 1}
const b1 = {...a1}

new Date(1, )

f()
async function f() {
  const b = [Promise.resolve(1)]
  for await (let a of b) ;
}
