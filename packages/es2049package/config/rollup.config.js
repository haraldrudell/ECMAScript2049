/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json';
import nodeIgnores from '../src/nodepackages.mjs';
import babelPrintFilename from '../src/babelPrintFilenamePlugin.mjs';
import { convertYaml } from './convertYaml';
import chmod from '../src/rollupChmodPlugin.mjs';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { shebang as shebangPlugin } from 'rollup-plugin-thatworks';
import path from 'path';
import util from 'util';
const srcRollupConfig = 'src/rollup.config.mjs';
const print = !!process.env.DEBUG;
convertYaml(path.resolve('src', 'eslintrc.yaml'), path.resolve('src', 'eslintrc.json'));
export default [{
  input: srcRollupConfig,
  output: {
    file: pjson.main,
    format: 'cjs'
  },
  options: {
    dependencies: true
  }
}, {
  input: srcRollupConfig,
  output: {
    file: pjson.module,
    format: 'es'
  },
  options: {
    dependencies: true
  }
}, {
  input: 'src/cleanbin.mjs',
  output: {
    file: 'bin/clean',
    format: 'cjs'
  },
  options: {
    shebang: true
  }
}, {
  input: 'src/rollup.mjs',
  output: {
    file: 'bin/rollup',
    format: 'cjs'
  },
  options: {
    shebang: true
  }
}].map(getConfig);

function getConfig(config0) {
  const {
    options: {
      shebang,
      dependencies
    },
    input,
    output
  } = config0;
  const includeExclude = {
    include: ['**/*.js', '**/*.mjs'],
    exclude: 'node_modules/**'
  };
  let babelOptions;
  const config = {
    input,
    output,
    external: nodeIgnores.slice().concat(Object.keys(Object(Object(pjson).dependencies))),
    plugins: [eslint(includeExclude), resolve({
      extensions: ['.mjs', '.js', '.json'],
      jail: process.cwd()
    }), json(), // required for import of .json files
    babel(babelOptions = Object.assign({
      babelrc: false,
      // unlike babel-node, rollup fails if an es2015 module transformer is included
      //runtimeHelpers: true,
      presets: [['@babel/preset-env', {
        targets: {
          node: '8.5'
        },
        modules: false
      }]],
      plugins: [].concat(print ? babelPrintFilename : [])
    }, includeExclude)), commonjs()].concat(shebang ? [shebangPlugin(), chmod()] : [])
  };

  if (print) {
    console.log(`Rollup options for ${config.input}: ${util.inspect(config, {
      colors: true,
      depth: null
    })}`);
    console.log('Rollup-Babel options:', util.inspect(babelOptions, {
      colors: true,
      depth: null
    }));
  }

  return config;
}