/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class Timer {
  constructor(o) {
    const {onTimeout, timeout, debug} = o || false
    this.m = 'Timer'
    Object.assign(this, {onTimeout, timeout, debug})
    debug && console.log(`${this.m} constructor:`, this)
  }

  async start() {
    const {timeout, onTimeout, debug} = this
    const wasCancelled = await new Promise((resolve, reject) => (this.timeoutID = setTimeout(resolve, timeout)) + (this._resolve = resolve))
    if (!wasCancelled) {
      debug && console.log(`${this.m} timed out`)
      this.timeoutID = null
      return onTimeout()
    }
  }

  cancel() {
    const {timeoutID, _resolve, debug} = this
    debug && console.log(`${this.m}.cancel: needs cancel: ${!!timeoutID}`)
    if (timeoutID) {
      this.timeoutID = null
      clearTimeout(timeoutID)
      _resolve(true)
    }
  }
}
