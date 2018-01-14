/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import clean from './clean'

export default function cleanPlugin(dirs) {
  let didClean
  return {
    name: 'cleanPlugin',
    async load() {
      if (!didClean) {
        didClean = true
        await clean(dirs)
      }
    },
  }
}
