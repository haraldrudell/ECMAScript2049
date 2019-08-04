<h1>babel-preset-7-esnext</h1>

An **ES.Next** babel-7 preset connfigurable for targets and ECMAScript modules

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

<h2>Benefits</h2>
<ul>
  <li>Get ES.Next in a single package</li>
  <li>Configurable transpilation-level: light to Node.js 8.5</li>
  <li>Configurable transpile to CommonJS</li>
</ul>

<h2>Usage</h2>

**yarn add --dev babel-preset-7-esnext @babel/core**
<blockquote><strong>import presetEsNext from 'babel-preset-7-esnext'</strong><br />
import {transform} from '@babel/core'<br />
f("import path from 'path'\nexport {path}").catch(console.error)<br />
async function f(code) {<br />
&emsp;console.log(await new Promise((resolve, reject) => transform(code,<br />
&emsp;&emsp;{configFile: false, babelrc: false, <strong>presets: [presetEsNext]</strong>},<br />
&emsp;&emsp;(e, result) => !e ? resolve(result) : reject(e)<br />
&emsp;)))<br />
&emsp;console.log(await new Promise((resolve, reject) => transform(code,<br />
&emsp;&emsp;{configFile: false, babelrc: false, <strong>presets: [[presetEsNext, {env: {targets: {node: true}, modules: false}}]]</strong>},<br />
&emsp;&emsp;(e, result) => !e ? resolve(result) : reject(e)<br />
&emsp;)))<br />
}</blockquote>
<p>&emsp;</p>

<h2>Options</h2>
<ul>
  <li><strong>env</strong>: options to @babel/preset-env, default {targets: {node: true}}</li>
  <li><strong>decorators</strong>: options to @babel/plugin-proposal-decorators, default {decoratorsBeforeExport: false}</li>
</ul>

&emsp;

## link: [Hire Harald Rudell](https://hire.surge.sh/)

## link: [Sponsor Harald Rudell](https://www.gofundme.com/san-francisco-revenge-crime-victim/)

&emsp;

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
