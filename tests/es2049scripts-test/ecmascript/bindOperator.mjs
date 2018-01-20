/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
const aThis = {}
const hBind = aThis::h
hBind(aThis)
function h(argThis) {
  if (this !== argThis) throw new Error('Stage 0 function bind operator failed') // stage 0 180114
}
