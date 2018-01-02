/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator
// TODO this needs do be pre-transpiled once that package is completed
import pjson from '../package.json';
import nodeIgnores from '../src/nodepackages';
import babelPrintFilename from '../src/babelPrintFilename';

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

import util from 'util';

const srcRollupConfig = 'src/rollup.config';

const print = !!process.env.DEBUG;

export default [{ input: srcRollupConfig, output: { file: pjson.main, format: 'cjs' }, options: { dependencies: true } }, { input: srcRollupConfig, output: { file: pjson.module, format: 'es' }, options: { dependencies: true } }, { input: 'src/cleanbin.js', output: { file: 'bin/clean', format: 'cjs' }, options: { shebang: true } }, { input: 'src/rollup.js', output: { file: 'bin/rollup', format: 'cjs' }, options: { shebang: true } }].map(getConfig);

//export default new RollupConfigurator().assembleConfig(getConfig)

function getConfig(config0) {
  const { options: { shebang, dependencies }, input, output } = config0;

  //{input, main, module, output, external, shebang, clean, print}) {
  const includeExclude = {
    include: '**/*.js',
    exclude: 'node_modules/**'
  };
  let babelOptions;

  const config = {
    input, output,
    external: nodeIgnores.slice().concat(Object.keys(Object(Object(pjson).dependencies))),
    plugins: [eslint(includeExclude), resolve({ extensions: ['.js', '.json'] }), json(), // required for import of .json files
    babel(babelOptions = Object.assign({
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