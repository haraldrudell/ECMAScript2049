<!doctype html>
<title>ECMAScript 2049 readme</title>
<h1>ECMAScript 2049 Scripts</h1>
<img src="./assets/ECMAScript 2049.png" alt="ECMAScript 2049" />
<p><strong>ERASE THE PAST</strong></p>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>

<p>This is the <strong>es2049scripts</strong> package</p>
<p>Repository links:<br />
<strong><a href=https://github.com/haraldrudell/ECMAScript2049>ECMAScript 2049</a></strong> the monolithic repository<br />
<strong><a href=https://github.com/haraldrudell/ECMAScript2049/tree/master/workspace/packages/es2049package>es2049package</a></strong> providing zero-configuration libraries and command-line utilities based on RollupJS<br />
<strong><a href=https://github.com/haraldrudell/ECMAScript2049/tree/master/es2049scripts-test>es2049scripts-test</a></strong> tests for es2049scripts</p>

<h2>Benefits</h2>
<ul>
  <li><p><strong>ECMAScript 2049</strong> provides instant on-the-fly transpilation of <strong>ES.Next ECMAScript</strong> to a runnable format</p></li>
  <li><p><strong>ECMAScript 2049</strong> transpilation is so fast that a users are not aware of it taking place</p></li>
  <li><p><strong>ECMAScript 2049</strong> thereby offers use of <strong>ES.Next</strong> everywhere:</p>
    <ul>
      <li><p>Production use of <strong>ECMAScript</strong> language features prior to standardization</p></li>
      <li><p>Use of <strong>ECMAScript</strong> language features prior to their runtime implementation</p></li>
      <li><p>As of December 31, 2017, offering <strong>ECMAScript 2018</strong> with all <strong>BabelJS 6</strong> Stage 0 experimental plugins runnable on <strong>Node.js v6 LTS</strong></p></li>
  </ul></li>
  <li><p><strong>es2049scripts</strong> package allows for build scripts to be written in <strong>ES.Next</strong>, solving an issue of the last four years:<br /><br />&emsp;Running the unrunnable <strong>ES.Next</strong> chicken-and-egg problem</p></li>
  <li><p><strong>ECMAScript 2049</strong> aligns with <strong>Agile Method</strong> to produce the best possible design at that point in time</li>
  <li><p><strong>ECMAScript 2049</strong> keeps developers and engineers happy and programming <strong>ECMAScript</strong> fun</li>
  <li><p><strong>ECMAScript 2049</strong> offers <strong>venture capital</strong> investment opportunities in new technology, as opposed to building companies on technology that is old and obsolete</li>
</ul>

<h2>Features</h2>
<ul>
  <li><p><strong>es2049scripts</strong> package offering initial instant on-the-fly transpile for package.json scripts</p></li>
  <li><p><strong>es2049package</strong> package allows for configuration-free implementation of libraries and command-line utilities</p></li>
  <li><p>Runtime environments target:</p>
    <ul>
      <li><p>Default: <strong>Node.js 6.10 LTS maintenance</strong>, the version currently used by many deployment environments as of December 31, 2017</p></li>
      <li><p>Active: <strong>Node.js 8.9 LTS Active</strong></p></li>
      <li><p>Current: <strong>Node.js v8.6+</strong> executable using <strong>CommonJS</strong> module format</p></li>
      <li><p>Latest: <strong>Node.js v8.6+</strong> using native experimental modules with extension <strong>.mjs</strong></p></li>
      <li><p>Rollup: Pre-transpilation of <strong>RollupJS</strong> configuration data so that it, too, can be written is <strong>ES.Next</strong></p></li>
  </ul></li>
</ul>

<h2>Usage</h2>
<p>Typical use is to have a <strong>configes</strong> direcory of <strong>ES.Next</strong> code that is on-the-fly transpiled into the <strong>config</strong> directory by the <strong>scripts</strong> entry of <strong>package.json</strong></p>
<p>Note: <strong>yarn</strong> is expected to be installed on the host</p>
<ol>
  <li><p>Add <strong>es2049scripts</strong> to your project:</p>
  <pre><code>yarn add es2049scripts --dev</code></pre></li>
  <li><p>Add <strong>es2049scripts</strong> to a <strong>scripts</strong> entry in <strong>package.json</strong>:<br />
  <pre><code>…
"scripts": {
   "start": "es2049scripts -- node config",
…</code></pre></p></li>
  <li><p>Write some <strong>ES.Next</strong> code in <strong>configes/index.mjs:</strong></p>
  <pre><code>console.log('The next ReactJS version:')
f()
async function f () {
  for await (let v of [Promise.resolve(17)])
    console.log(v)
}</code></pre></li>
  <li><p>Run!</p>
  <pre><code>yarn start
yarn run v1.3.2
$ es2049scripts -- node config
The next ReactJS version:
17
Done in 0.73s.
</code></pre></li>
</ol>
<p><strong>es2049scripts</strong> transpiles .js and .mjs to .js or .mjs with target options <strong>&#8209;current &#8209;active &#8209;latest &#8209;rollup.</strong></p>
<p>For more information, use:</p>
<pre><code>yarn es2049scripts &#8209;help</code></pre>
<pre><code>es2049scripts [options] source-directory target-directory args…
    version: 0.0.11
  Transpiles from ES.Next to Node.js executable format
    Default target is Node.js 6.12.3 maintenance Long Term Support
    Transpiles .js and .mjs (may be renamed to .js), other files are copied
    Actions may be skipped based on modification date
&emsp;
  -active  Target latest Node.js LTS: 8.9.4
  -current  Target the executing Node.js version, must be v8.6+, CommonJS modules
  -latest  Target the executing Node.js version --experimental-modules v8.6+
    Extension .mjs is kept on output
  -rollup  Target transpile of rollup.config.js: for buble with import
  --  Skip options parsing to args parameter
&emsp;
  source-directory default: ./configes
  target-directory default: ./config
  args…  Any command with arguments to be launched on transpile complete</code></pre>
<p>Note om Rollup: rollup reading fo configuraiton files does not support generators, therefore not async or dynamic imports. This means one cannot include ECMAScript containing generators for parsing, even if those are not used.</p>

<h2>Internal Triple-Transpile</h2>
<h3>Compiling ZeroTranspiler</h3>
<p>The ZeroTranspiler class is written in <strong>ES.Next</strong> and is only used by es2049scripts developers. The <code>yarn transpilezero</code> command uses the <strong>babel-cli</strong> package to transpile to Node 6 ECMAScript . The output, <code>config/transpilezero.js</code> is checked in.
<h3>Transpiling to config</h3>
<p>As soon as the zero transpiler has been compiled, it is used to transpile <strong>ES.Next</strong> code in <code>configes</code> and <code>configrollup</code> using the proper babel environment, this result is also checked in. At this point, the es2049scripts project can be built.</p>
<h3>Building es2049scripts</h3>
<p>The project is built in the usual way using the transpiled code in <code>config</code>
<h3>Transpiling the Consuming Project</h3>
<p>The consuming project invokes the <code>es2049scripts</code> executable that is built from the <strong>ES.Next</strong> code in <code>src</code>. The transpilation, typically into the consuming project’s config directory, uses modification dates to reduce work.

<h2>Requirements</h2>
<p>To develop or compile the <strong>ECMAScript 2049</strong> project <strong>Yarn</strong> 1+ and <strong>Node.js current</strong> (v8.5+) are required.</p>
<p><code>yarn test</code> tests that the built executable is runnable:</p>
<pre><code><strong>yarn build</strong>
…
src/index.mjs → bin/es2049scripts...
created bin/es2049scripts in 1.6s
Done in 2.94s.
<strong>yarn test</strong>
…
Ran all test suites.
Done in 1.91s.
</code></pre>
<p><code>yarn testmjs</code> tests that experimental module support appears to be working.</p>
<p><code>yarn testProject</code> executes tests in the <strong>es2049scripts-test</strong> project:</p>
<pre><code><strong>yarn testProject</strong>
…
yarn install
…
yarn test
…
This file was transpiled with RollupJS and executed successfully.
…
yarn start
$ es2049scripts -- node config
The next ReactJS version:
17
ScriptsTester.test: code transpiled by es2049scripts executed successfully.
Done in 14.72s.
</code></pre>
<p>&emsp;</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
