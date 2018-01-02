/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import clean from './clean'

import fs from 'fs-extra'

import path from 'path'

doClean().catch(errorHandler)

async function doClean() {
  const {argv} = process
  return clean(argv.length > 2 ? argv.slice(2) : await getRollupClean())
}

async function getRollupClean() {
  const json = JSON.parse(await fs.readFile(path.resolve('package.json'), 'utf8'))
  return json && json.rollup && json.rollup.clean
}

function errorHandler(e) {
  console.error(/*e instanceof Error ? e.message : */e)
  process.exit(1)
}
