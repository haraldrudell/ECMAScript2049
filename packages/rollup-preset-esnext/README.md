<h1>rollup-preset-esnext</h1>

An **ES.Next** configurable Rollup preset

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

<h2>Usage</h2>

**yarn add --dev rollup-preset-esnext**

In rollup.config.js:

<blockquote><strong>import presetEsNext from 'rollup-preset-esnext'</strong><br />
import {transform} from '@babel/core'<br />
…<br />
export default {input, output, external, plugins: presetEsNext(options)}</strong></blockquote>

options:

* **jail**: for rollup-plugin-resolve, default current directory
* **env**: options for @babel/preset-env, default node: current
* **compact**: remove comments, boolean, default false

&emsp;

## link: [Hire Harald Rudell](https://hire.surge.sh/)

## link: [Sponsor Harald Rudell](https://www.gofundme.com/san-francisco-revenge-crime-victim/)

&emsp;

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
