"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
when run using yarn jest in a yarn workspace
from the ./packages/project directory/
<rootDir> is the project directory
*/
const transformer = _path.default.join(__dirname, '../src/transformer');

var _default = {
  transform: {
    '^.+\\.(js|mjs|jsx)?$': transformer
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(mjs|js|jsx)$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs']
};
exports.default = _default;