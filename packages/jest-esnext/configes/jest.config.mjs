/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'

const transformer = path.join(__dirname, '../src/transformer')

export default {
  transform: {
    '^.+\\.(js|mjs|jsx)?$': transformer,
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(mjs|js|jsx)$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs'],
}
