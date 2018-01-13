import _extends from 'babel-runtime/helpers/extends';
import _Object$keys from 'babel-runtime/core-js/object/keys';
/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// the ECMAScript ES.Next version is in the configes directory
import pjson from '../package.json';
import nodeIgnores from './nodepackages';

import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import shebangPlugin from 'rollup-plugin-shebang';

import path from 'path';
import fs from 'fs';

var _arr = ['name'];
for (var _i = 0; _i < _arr.length; _i++) {
  var p = _arr[_i];
  var v = Object(pjson)[p];
  var tv = typeof v;
  if (!v || tv !== 'string') throw new Error(`package.json field ${p} not non-empty string: ${tv}`);
}

var src = 'src';
var bin = 'bin';
var paths = {
  srcIndexMjs: path.join(src, 'index.mjs'),
  binary: path.resolve(bin, pjson.name)
};
var includeExclude = { include: ['**/*.js', '**/*.mjs'], exclude: 'node_modules/**' };
var depExternals = _Object$keys(Object(Object(pjson).dependencies));

process.env.BABEL_ENV = 'rollup';

export default {
  input: paths.srcIndexMjs,
  output: { file: paths.binary, format: 'cjs' },
  external: nodeIgnores.concat(depExternals),
  plugins: [resolve({ extensions: ['.js', '.mjs', '.json'] }), eslint(includeExclude), json(), babel(_extends({ runtimeHelpers: true }, includeExclude)), commonjs(), shebangPlugin(), function chmodPlugin(mode) {
    return {
      name: 'chmodPlugin',
      onwrite(bundle, data) {
        var filename = bundle && (bundle.file || bundle.dest);
        if (!filename) throw new Error('chmodPlugin.onwrite: filename missing');
        fs.chmodSync(filename, mode >= 0 ? Number(mode) : 0o755); // rwxr-xr-x
      }
    };
  }()]
};
