/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// Export extension stage 1 180114
export * from 'fs'
export resolve from 'path'
import {a} from './envdefault3.js'
import * as b from './envdefault'
import * as c from './envdefault5'

// ECMAScript 2015 import
if (a !== 1) throw new Error(`ECMAScript 2015 import does not work`)

const d = 2 ** 2
if (d !== 4) throw new Error(`ECMAScript 2016 exponentiation operator failed`)

if (xf(3) !== 3) throw new Error(`ECMAScript 2017 trailing function commas failed`)
function xf(a,) {
  return a
}

xg() // ECMAScript 2017 async function
async function xg() {
  await Promise.resolve()
}

// Object rest spread stage 3 180114
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
let n = { x, y, ...z };

// class properties: stage 2 180114
class X {
  prop = 2
}

dynamicImport()
async function dynamicImport() {
  const x = await import('./envdefault4')
  if (x !== 4) throw new Error('ECMAScript stage 2 dynakic import failed')
}

const aThis = {}
const hBind = aThis::h
hBind(aThis)
function h(argThis) {
  if (this !== argThis) throw new Error('Stage 0 function bind operator failed') // stage 0 180114
}

let aaa = do {9}
if (aaa !== 9) throw new Error('Do expression failed stage 0 180114')

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
