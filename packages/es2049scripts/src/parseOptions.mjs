/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

export default function parseOptions({argv, name, version}) {
  let argCount = 0
  const filenameProperties = ['from', 'to']
  const filenames = {from: 'configes', to: 'config'}
  const options = {name}
  let args
  const help =
    `${name} [options] source-directory target-directory args…\n` +
    `    version: ${version}\n` +
    '  transpiles scripts from ES.Next to Node.js executable format\n' +
    '    default target is Node.js 6 (Long Term Support)\n\n' +

    '  -current  Target the executing Node.js version, that must be v8.6+, CommonJS modules\n' +
    '  -latest  Target the executing Node.js version --experimental-modules v8.6+\n' +
    '    Extension .mjs is kept on output\n' +
    '  -rollup  Target transpile of rollup.config.js: Node.js v4.8.1 with import\n' +
    '  --  Skip options parsing to args parameters\n\n' +
    '  source-directory default: ./configes\n' +
    '    Transpiles .js and .mjs (to .js), other files are copied\n' +
    '    Actions may be skipped based on modification date\n' +
    '  target-directory default: ./config\n' +
    '  args…  Any command with arguments to be launched on transpile complete'

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
    case '-current':
      options.envName = 'current'
      break
    case '-rollup':
      options.envName = 'rollup'
      break
    case '-latest':
      options.envName = 'latest'
      break
    case '--':
      args = argv.slice(++i)
      i = argv.length
      break
    default:
      if (arg.startsWith('-')) {
        console.error(`Unknown option: '${arg}'\n`)
        console.error(help)
        process.exit(2)
      }
      if (!arg) {
        console.error('Directory name cannot be empty')
        console.error(help)
        process.exit(2)
      }
      if (argCount < 2) filenames[filenameProperties[argCount++]] = arg
      else {
        args = argv.slice(i)
        i = argv.length
      }
      break
    }
  for (let prop of filenameProperties) {
    filenames[prop] = path.resolve(filenames[prop])
  }
  return {filenames, options, args}
}
