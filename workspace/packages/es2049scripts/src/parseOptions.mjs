/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

export default function parseOptions({argv, name, version}) {
  const filenameProperties = ['from', 'to']
  const targets = { // values are property names in babelenv.mjs
    '-current': 'current',
    '-active': 'active',
    '-latest': 'latest',
    '-rollup': 'rollup',
  }
  const help = [
    `${name} [options] source-directory target-directory args…`,
    `    version: ${version}`,
    '  Transpiles from ES.Next to Node.js executable format',
    '    Default target is Node.js 6.12.3 maintenance Long Term Support',
    '    Transpiles .js and .mjs (may be renamed to .js), other files are copied',
    '    Actions may be skipped based on modification date',
    '',
    '  -active  Target latest Node.js LTS: 8.9.4',
    '  -current  Target the executing Node.js version, must be v8.6+, CommonJS modules',
    '  -latest  Target the executing Node.js version --experimental-modules v8.6+',
    '    Extension .mjs is kept on output',
    '  -rollup  Target transpile of rollup.config.js: for buble with import',
    '  --  Skip options parsing to args parameter',
    '',
    '  source-directory default: ./configes',
    '  target-directory default: ./config',
    '  args…  Any command with arguments to be launched on transpile complete',
  ].join('\n')

  const filenames = {from: 'configes', to: 'config'}
  const options = {name}
  let args
  let argCount = 0

  for (let i = 0, arg = argv[i]; i < argv.length; arg = argv[++i]) switch (arg) {
    case '-h':
    case '-help':
    case '--help':
      console.log(help)
      process.exit(0)
      // eslint-disable-line no-fallthrough
    case '-debug':
      options.debug = true
      break
    case '-acive':
    case '-current':
    case '-latest':
    case '-rollup':
      options.envName = targets[arg]
      break
    case '--':
      args = argv.slice(++i)
      i = argv.length
      break
    default:
      let optErr
      if (arg.startsWith('-')) optErr = `Unknown option: '${arg}'\n`
      else if (!arg) optErr = 'Directory name cannot be empty'
      if (optErr) {
        console.error(optErr)
        console.error(help)
        process.exit(2)
      }

      if (argCount < 2) {
        const filenameProperty = filenameProperties[argCount++]
        filenames[filenameProperty] = arg
      } else {
        args = argv.slice(i)
        i = argv.length
      }
      break
    }
    for (let prop of filenameProperties) filenames[prop] = path.resolve(filenames[prop])
    return {filenames, options, args}
}
