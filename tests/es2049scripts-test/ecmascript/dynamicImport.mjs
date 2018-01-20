/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
dynamicImport()
async function dynamicImport() {
  const x = await import('./envdefault4')
  if (typeof x !== 'object' || x.default !== 4) {
    console.error('dynamicImport', x)
    throw new Error('ECMAScript stage 2 180114 dynamic import failed')
  }
}
