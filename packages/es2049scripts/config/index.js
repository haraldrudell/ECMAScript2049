'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let run = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* () {
    return new _Build2.default().build();
  });

  return function run() {
    return _ref.apply(this, arguments);
  };
})();

var _Build = require('./Build');

var _Build2 = _interopRequireDefault(_Build);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules src (v8.5+ v9.3+)
const nameField = Object(_package2.default).name;
const m = String(nameField || 'src/index');
let debug = true; // TODO set to undefined

run().catch(errorHandler);

function errorHandler(e) {
  debug && console.error(`${m} error handler:`);
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`);
  console.error(!debug ? e.message : e);
  process.exit(1);
}
