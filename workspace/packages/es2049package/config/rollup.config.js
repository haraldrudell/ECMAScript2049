import _Object$assign from '/opt/foxyboy/sw/pri/forks/ecmascript2049/workspace/node_modules/babel-runtime/core-js/object/assign';
import _Object$keys from '/opt/foxyboy/sw/pri/forks/ecmascript2049/workspace/node_modules/babel-runtime/core-js/object/keys';
/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json';
import nodeIgnores from '../src/nodepackages.mjs';
import babelPrintFilename from '../src/babelPrintFilename.mjs';

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

import util from 'util';

var srcRollupConfig = 'src/rollup.config';

var print = !!process.env.DEBUG;

export default [{ input: srcRollupConfig, output: { file: pjson.main, format: 'cjs' }, options: { dependencies: true } }, { input: srcRollupConfig, output: { file: pjson.module, format: 'es' }, options: { dependencies: true } }, { input: 'src/cleanbin.js', output: { file: 'bin/clean', format: 'cjs' }, options: { shebang: true } }, { input: 'src/rollup.js', output: { file: 'bin/rollup', format: 'cjs' }, options: { shebang: true } }].map(getConfig);

//export default new RollupConfigurator().assembleConfig(getConfig)

function getConfig(config0) {
  var _config0$options = config0.options,
      shebang = _config0$options.shebang,
      dependencies = _config0$options.dependencies,
      input = config0.input,
      output = config0.output;

  //{input, main, module, output, external, shebang, clean, print}) {

  var includeExclude = {
    include: '**/*.js',
    exclude: 'node_modules/**'
  };
  var babelOptions = void 0;

  var config = {
    input, output,
    external: nodeIgnores.slice().concat(_Object$keys(Object(Object(pjson).dependencies))),
    plugins: [eslint(includeExclude), resolve({ extensions: ['.js', '.json'] }), json(), // required for import of .json files
    babel(babelOptions = _Object$assign({
      babelrc: false, // unlike babel-node, rollup fails if an es2015 module transformer is included
      runtimeHelpers: true,
      presets: [['env', { modules: false, targets: { node: '4.8.1' } }]],
      plugins: ['transform-runtime'].concat(print ? babelPrintFilename : [])
    }, includeExclude)), commonjs()]
  };

  if (print) {
    console.log(`Rollup options for ${config.input}: ${util.inspect(config, { colors: true, depth: null })}`);
    console.log('Rollup-Babel options:', util.inspect(babelOptions, { colors: true, depth: null }));
  }

  return config;
}