'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spawnCapture = exports.spawnAsync = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let spawnAsync = exports.spawnAsync = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (cmd, args, options, cpReceiver) {
    if (!cpReceiver) cpReceiver = {};
    return new _promise2.default(function (resolve, reject) {
      return cpReceiver.cp = spawn(cmd, args, (0, _extends3.default)({ stdio: ['ignore', 'inherit', 'inherit'] }, options)).once('close', function (status, signal) {
        return status === 0 && !signal && resolve(status) || reject(getError(cmd, args, status, signal));
      }).on('error', function (e) {
        return reject((0, _assign2.default)(e, { cmd, args }));
      });
    });
  });

  return function spawnAsync(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

let spawnCapture = exports.spawnCapture = (() => {
  var _ref2 = (0, _asyncToGenerator3.default)(function* (cmd, args, options) {
    options = (0, _extends3.default)({}, options, { stdio: ['ignore', 'pipe', 'pipe'] });
    var _options = options;
    const doPipe = _options.doPipe,
          stderrFails = _options.stderrFails;

    delete options.doPipe;
    delete options.stderrFails;

    const cpReceiver = {};
    const p = spawnAsync(cmd, args, options, cpReceiver);

    const texts = ['', ''];
    const listeners = texts.map(function (text, ix) {
      return function (t) {
        return texts[ix] += t;
      };
    });
    var _cpReceiver$cp = cpReceiver.cp;
    const cpStdout = _cpReceiver$cp.stdout,
          cpStderr = _cpReceiver$cp.stderr;

    const cpStreams = [cpStdout, cpStderr];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(cpStreams.entries()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let _ref3 = _step.value;

        var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

        let ix = _ref4[0];
        let cpStream = _ref4[1];
        cpStream.on('data', listeners[ix]).setEncoding('utf8');
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (doPipe) {
      var _process = process;
      const stdout = _process.stdout,
            stderr = _process.stderr;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)([stdout, stderr].entries()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let _ref5 = _step2.value;

          var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

          let ix = _ref6[0];
          let processStream = _ref6[1];
          cpStreams[ix].pipe(processStream);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    let e;
    yield p.catch(function (er) {
      return e = er;
    });
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = (0, _getIterator3.default)(cpStreams.entries()), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        let _ref7 = _step3.value;

        var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

        let ix = _ref8[0];
        let cpStream = _ref8[1];
        cpStream.removeListener('data', listeners[ix]);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (e) throw e;
    const stdout = texts[0],
          stderr = texts[1];

    if (stderrFails && stderr) throw (0, _assign2.default)(new Error(`Output on standard error: ${cmd} ${args.join(' ')}: '${stderr}'`), { cmd, args, stdout, stderr });
    return { stdout, stderr };
  });

  return function spawnCapture(_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
})();

exports.getError = getError;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spawn = _child_process2.default.spawn; /*
                                             © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                             This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                                             */
function getError(cmd, args, status, signal) {
  let msg = `status code: ${status}`;
  if (signal) msg += ` signal: ${signal}`;
  msg += ` '${cmd} ${args.join(' ')}'`;
  return (0, _assign2.default)(new Error(msg), { cmd, args, status, signal });
}
