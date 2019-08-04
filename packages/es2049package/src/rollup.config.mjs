/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import RollupConfigurator from './RollupConfigurator'
import chmod from './rollupChmodPlugin'
import warningsMuffler from './rollupWarningsMuffler'
import cleanPlugin from './rollupCleanPlugin'
import printPlugin from './rollupPrintPlugin'
import babelPrintFilenames from './babelPrintFilenamePlugin'
import eslintJson from './eslintrc.json'
import pjson from '../package.json'
import sha256Plugin from './rollupSha256Plugin'

// project-external rollup plugins
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import { shebang as shebangPlugin } from 'rollup-plugin-thatworks'

import stage0Preset from './stage0Preset'

// project-external babel presets and plugins
//import babelEslint from 'babel-eslint'

import resolvePackage from 'resolve'

import util from 'util'
import fs from 'fs'
import path from 'path'

const babelEslint = 'babel-eslint'
let eslintBaseOptions

const cwd = process.cwd()

// these output 1,000s of lines
const debug = Boolean(process.env.ES2049PACKAGE_DEBUG)
const printRollupResolve = Boolean(process.env.ES2049PACKAGE_RESOLVE)
const printRollupLoad = Boolean(process.env.ES2049PACKAGE_LOAD)
const useRollupPrintPlugin = printRollupResolve || printRollupLoad
if (debug || printRollupResolve || printRollupLoad) {
  const name = String(Object(pjson).name || 'name: UNKNOWN')
  const version = String(Object(pjson).version || 'version: UNKNOWN')
  console.log(`${name} version: ${version} ${new Date().toISOString()} debug: `, {debug, printRollupResolve, printRollupLoad})
}

export default new RollupConfigurator().assembleConfig(getConfig)

function getConfig({input, output, external, targets, shebang, clean, eslint: useEslint, dependenciesFlag}) {
  const isMini = targets === 'mini'
  const includeExclude = {
    /*
    default is to include all files, including outside of the project directory
    if include is present, a file must match to be processed
    if exclude is present a file must not match to be processes
    if a pattern does not begin with '/' or '.' it applies only to entries in the project directory
    include: '**' will limit processing to the project directory
    a symlink is processed according to its canonical path, ie. true file system location

    exclude already transpiled code in the project directory's node_module tree
    node_modules must be excluded because eslint fails transpiled files
    */
    exclude: 'node_modules/**',
    /*
    limit to .js files in the project directory tree
    this exludes for example node_modules in parent directories
    json is processed by the rollup plugin. If babel processes json, too, it will fail
    */
    include: ['**/*.js', '**/*.mjs'],
  }
  let rollupBabelOptions
  let rollupEslintOptions
  let rollupResolveOptions

  const config = {
    input,
    output,
    external,
    onwarn: warningsMuffler,
    plugins: (useRollupPrintPlugin ? [printPlugin({ids: printRollupResolve, files: printRollupLoad, debug})] : []).concat([
      /*
      rollup-plugin-eslint https://github.com/TrySound/rollup-plugin-eslint
      CLIEngine options: https://eslint.org/docs/developer-guide/nodejs-api#cliengine
      */
      eslint(rollupEslintOptions = {...includeExclude, cwd: process.cwd(), ...(useEslint ? getEslintBaseOptions() : {})}),
      /*
      rollup-plugin-node-resolve https://www.npmjs.com/package/rollup-plugin-node-resolve
      locates modules in node_module directories and parent node_module directories
      examines module and main fields of package.json
      prefer builtins, like 'util' over same-named other modules
      */
      resolve(rollupResolveOptions = Object.assign({
        extensions: ['.mjs', '.js', '.json'],
        customResolveOptions: {
          /*
          resolve https://www.npmjs.com/package/resolve
          some unused requires should fail while Rollup should still succeed
          this enables overriding mock modules solving such problems
          */
          paths: [path.join(fs.realpathSync(process.cwd()), 'js_modules')], // modules in the js_modules directory will override real modules
        }}, dependenciesFlag ? {jail: cwd} : {})),
      json(), // required for import of .json files
      babel(rollupBabelOptions = {
        // rollup-plugin-babel https://www.npmjs.com/package/rollup-plugin-babel
        babelrc: false, // do not process package.json or .babelrc files, rollup has the canonical Babel configuraiton
        ...(isMini ? {} : {
          // bundle in Babel external helpers https://github.com/rollup/rollup-plugin-babel#usage
          //runtimeHelpers: true,
        }),
        presets: isMini ? []
          : [['@babel/preset-env', {modules: false, targets}], stage0Preset],
        plugins: (isMini ? [
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-proposal-class-properties', { loose: false }],
          ]
          : []
          ).concat(debug ? [babelPrintFilenames({debug})] : []),
        ...includeExclude}), // only process files from the project
      /*
      rollup-plugin-commonjs https://github.com/rollup/rollup-plugin-commonjs
      converts commonJS modules to ECMAScript 2015
      Only processes .js files that are of CommonJS format
      if imported modules are in common js format (using exports) rollup-plugin-commonjs is required
      */
      commonjs(),
    ]).concat(shebang ? [shebangPlugin(), chmod()] : [])
      .concat(clean ? cleanPlugin(clean) : [])
      .concat(debug ? [sha256Plugin({debug})] : []),
  }
  RollupConfigurator.deleteUndefined(config)

  if (debug) {
    console.log(`Rollup options for ${input}: ${util.inspect(config, {colors: true, depth: null})}`)
    console.log(`Node Resolve options: ${util.inspect(rollupResolveOptions, {colors: true, depth: null})}`)
    console.log(`Eslint options: ${util.inspect(rollupEslintOptions, {colors: true, depth: null})}`)
    console.log(`Babel options: ${util.inspect(rollupBabelOptions, {colors: true, depth: null})}`)
  }

  return config
}

function getEslintBaseOptions() {
  if (eslintBaseOptions) return eslintBaseOptions

  const beFile = resolvePackage.sync(path.join(babelEslint, 'package.json'))
  const beDir = path.join(beFile, '..')
  const beData = JSON.parse(fs.readFileSync(beFile, 'utf8'))
  const parser = path.join(beDir, Object(beData).main)

  // convert globals to array (eslint CLIEngine wants that)
  const globalsObject = Object(Object(eslintJson).globals)
  const globals = Object.keys(globalsObject).map(name => `${name}:${globalsObject[name]}`)

  return eslintBaseOptions = {...eslintJson, parser, globals}
}
