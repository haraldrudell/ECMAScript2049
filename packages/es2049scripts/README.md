<!doctype html>
<title>ECMAScript 2049 readme</title>
<h1>ECMAScript 2049</h1>
<h2>es2049script Package</h2>
<img src=https://pbs.twimg.com/media/DRC-drOWsAABHUT.jpg:large alt="ECMAScript 2049" />
<img src="https://raw.github.com/haraldrudell/ecmascript2049/master/assets/ECMAScript 2049.png" alt="ECMAScript 2049" />
<img src="./assets/ECMAScript 2049.png" alt="ECMAScript 2049" />
<p><strong>ERASE THE PAST</strong></p>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>
<p><strong>ECMAScript 2049</strong> is an installable software package allowing use of <strong>ECMAScript ES.Next</strong> language features early</p>

<h2>Benefits</h2>
<ul>
  <li><p><strong>ECMAScript 2049</strong> provides instant on-the-fly transpilation of <strong>ES.Next ECMAScript</strong> to a runnable format</p></li>
  <li><p><strong>ECMAScript 2049</strong> transpilation is so fast that a users are not aware of it taking place</p></li>
  <li><p><strong>ECMAScript 2049</strong> thereby offers use of <strong>ES.Next</strong> everywhere:</p>
    <ul>
      <li>Production use of <strong>ECMAScript</strong> language features prior to standardization</li>
      <li>Use of <strong>ECMAScript</strong> language features prior to their runtime implementation</li>
      <li>As of December 31, 2017, offering <strong>ECMAScript 2018</strong> with all <strong>BabelJS 6</strong> Stage 0 experimental plugins runnable on <strong>Node.js v6 LTS</strong></li>
  </ul></li>
  <li><p><strong>ECMAScript 2049</strong> aligns with <strong>Agile Method</strong> to produce the best possible design at that point in time</li>
  <li><p><strong>ECMAScript 2049</strong> keeps developers and engineers happy and makes programming <strong>ECMAScript</strong> fun</li>
  <li><p><strong>ECMAScript 2049</strong> offers <strong>venture capital</strong> investment opportunities in new technology, as opposed to building companies on technology that is old and obsolete</li>
</ul>

<h2>Features</h2>
<ul>
  <li><p><strong>es2049scripts</strong> package allowing for build scripts to be written in <strong>ECMAScript 2049</strong>, solving an issue of the last four years:<br />Running the unrunnable <strong>ES.Next</strong> chicken-and-egg problem</p></li>
  <li><p><strong>es2049package</strong> package allowing a configuration-free implementation of libraries and command-line utilities</p></li>
  <li><p>Executable targeting runtime environments:</p>
    <ul>
      <li><p>Default: <strong>Node.js 6 LTS</strong>, the version used by many deployment enviropnments as of December 31, 2017</p></li>
      <li><p>Latest: <strong>Node.js v8.6+</strong> using native experimental modules with extension .mjs</p></li>
      <li><p>Current: <strong>Node.js v8.6+</strong> executable using <strong>CommonJS</strong> module format</p></li>
      <li><p>Rollup: Pre-transpilation of <strong>RollupJS</strong> configuration data so that it, too, can be written is <strong>ES.Next</strong></p></li>
  </ul></li>
</ul>

<h2>Usage</h2>
<p>Typical use is to have a <strong>configes</strong> direcory of <strong>ES.Next</strong> code that is om-the-fly transpiled into the <strong>config</strong> directory by the <strong>scripts</strong> entry of <strong>package.json</strong></p>
<ol>
  <li><p>Add <strong>es2049scripts</strong> to your project:<br />
  <code>yarn add es2049scripts --dev</code></p></li>
  <li><p>Add <strong>es2049scripts</strong> to a <strong>scripts</strong> entry in <strong>package.json</strong>:<br />
  <code>
  <pre>…<br />"scripts": {<br />"start":<br />&emsp;"es2049script -- config",<br />…</pre>
  </code></p></li>
  <li><p>Write some <strong>ES.Next</strong> code in <strong>configes/index.mjs</strong></p></li>
  <li><p>Run!<br />
  <code>yarn run start</code></p></li>
</ol>
<p><strong>es2049scripts</strong> transpiles .js and .mjs to .js or .mjs with target options &#8209;current &#8209;latest &#8209;rollup.<br />Use <code>node_modules/.bin/es2049scripts &#8209;help</code> for more information:</p>
<code><pre>
node_modules/.bin/es2049scripts -help
    version: 0.0.1
  transpiles scripts from ES.Next to Node.js executable format
    default target is Node.js 6 (Long Term Support)

  -current  Target the executing Node.js version, that must be v8.6+, CommonJS modules
  -latest  Target the executing Node.js version --experimental-modules v8.6+
    Extension .mjs is kept on output
  -rollup  Target transpile of rollup.config.js: Node.js v4.8.1 with import
  --  Skip options parsing to args parameters

  source-directory default: ./configes
    Transpiles .js and .mjs (to .js), other files are copied
    Actions may be skipped based on modification date
  target-directory default: ./config
  args…  Any command with arguments to be launched on transpile complete
</pre></code>
<h2>Requirements</h2>
<p>To develop or compile the <strong>ECMAScript 2049</strong> project <strong>Yarn</strong> 1+ and <strong>Node.js current</strong> (v8.5+) are required.</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
