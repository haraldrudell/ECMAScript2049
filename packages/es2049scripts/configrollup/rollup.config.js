/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// the ECMAScript ES.Next version is in the configes directory
import pjson from '../package.json'
import nodeIgnores from './nodepackages'

import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import shebangPlugin from 'rollup-plugin-shebang'

import path from 'path'
import fs from 'fs'

for (let p of ['name']) {
  const v = Object(pjson)[p]
  const tv = typeof v
  if (!v || tv !== 'string') throw new Error(`package.json field ${p} not non-empty string: ${tv}`)
}

const src = 'src'
const bin = 'bin'
const paths = {
  srcIndexMjs: path.join(src, 'index.mjs'),
  binary: path.resolve(bin, pjson.name),
}
const includeExclude = {include: ['**/*.js', '**/*.mjs'], exclude: 'node_modules/**'}
const depExternals = Object.keys(Object(Object(pjson).dependencies))

process.env.BABEL_ENV = 'rollup'

export default {
  input: paths.srcIndexMjs,
  output: {file: paths.binary, format: 'cjs'},
  external: nodeIgnores.concat(depExternals),
  plugins:  [
    resolve({extensions: ['.js', '.mjs', '.json']}),
    eslint(includeExclude),
    json(),
    babel({runtimeHelpers: true, ...includeExclude}),
    commonjs(),
    shebangPlugin(),
    function chmodPlugin(mode) {
      return {
        name: 'chmodPlugin',
        onwrite(bundle, data) {
          const filename = bundle && (bundle.file || bundle.dest)
          if (!filename) throw new Error('chmodPlugin.onwrite: filename missing')
          fs.chmodSync(filename, mode >= 0 ? Number(mode) : 0o755) // rwxr-xr-x
        },
      }
    }(),
  ],
}
