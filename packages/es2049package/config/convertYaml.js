/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
const debug = false; // true

export function convertYaml(fsYaml, fsJson) {
  debug && console.log(`convertYaml.mjs convertYaml ${fsYaml} ${fsJson}`);
  let doIt = !fs.pathExistsSync(fsJson);
  debug && console.log(`convertYaml output does not exist: ${doIt}`);

  if (!doIt) {
    const modDates = [fsYaml, fsJson].map(f => fs.statSync(f).mtimeMs);
    doIt = modDates[0] > modDates[1];
    debug && console.log(`convertYaml doIt: ${doIt} from-to dates: ${modDates.join(', ')}`);
  }

  if (doIt) {
    console.log(`convertYaml writing ${path.relative('..', fsJson)}`);
    const o = yaml.safeLoad(fs.readFileSync(fsYaml, 'utf8'));
    fs.writeFileSync(fsJson, JSON.stringify(o, null, '\x20\x20'));
  }
}