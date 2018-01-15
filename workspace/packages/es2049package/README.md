<h1>ECMAScript 2049 Package</h1>
<img src="./assets/ECMAScript 2049.png" alt="ECMAScript 2049" />
<p><strong>ERASE THE PAST</strong></p>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>

<p>This is the <strong>es2049package</strong> package</p>
<p>Repository links:<br />
<strong><a href=https://github.com/haraldrudell/ECMAScript2049>ECMAScript 2049</a></strong> the monolithic repository<br />
<strong><a href=https://github.com/haraldrudell/ECMAScript2049/tree/master/workspace/packages/es2049scripts>es2049scripts</a></strong> providing build-scripts written in <strong>ES.Next</strong><br />
<strong><a href=https://github.com/haraldrudell/ECMAScript2049/tree/master/workspace/packages/allspawn>allspawn</a></strong> async/promise command execution</p>

<h2>Benefits</h2>
<p><strong>es2049package</strong> allows a library or command-line utility to be compiled with only one installed dependency and no configuration files.</p>

<h2>Usage</h2>
<ol>
  <li>Add <strong>es2049package</strong> to your project<br />
    <code>yarn add es2049package --dev</code></li>
  <li>Add <strong>build</strong> to the <code>scripts</code> entry of package.json:<br />
    <pre><code>"scripts": {
  "build": "rollup --config node:es2049package"
  …</code></pre></li>
  <li>Build:<br />
    <code>yarn build</code></li>
</ol>

<h3>Fields in package.json</h3>
<p>Fields used are the rollup key as well as standard top-level keys name, main, module</p>
<p>Rollup keys:</p>
<ul>
  <li><strong>input</strong>: optional string or array, default <strong>src/index.js</strong>: the entry point used for compilation. If this is an array, it is of objects each describing a compilation with keys: <strong>input output dependencies main module external node print shebang targets</strong>. Those keys overrides the rollup keys.<ul>
    <li><strong>main</strong>: boolean, default false. use main field as output
    <li><strong>module</strong>: boolean, default false. use module field as output</li>
  </ul></li>
  <li><strong>output</strong>: optional array or object. A rollup object with file and format (cjs, es) properties</li>
  <li><strong>external</strong>: optional string, array of string: list of packages that are to be external</li>
  <li><strong>clean</strong>: string or list of strings, desribed below under clean command</li>
  <li><strong>node</strong>: boolean default false. If true, the standard library are added as externals. Should nromally be used for all Node.js programs</li>
  <li><strong>targets</strong>: optional string 'stable', 'current' or a target object as defined  by babelJS. default is stable.</li>
  <li><strong>dependencies</strong>: optional list of package names that are considered external by RollupJS</li>
  <li><strong>print</strong>: boolean, default false. If true, diagnostic printouts</li>
  <li><strong>shebang</strong>: boolean, default false. If true: the output is an executable, with a shebang line and proper permissions.</li>
</ul>

<h3>clean command</h3>
<p>Intended to provide a <code>clean</code> scripts  command for used in package.json. Removes any files or directories provided on the command line, or with no argments from the rollup.clean field of package,json</p>
<pre><code>"scripts": {
  "clean": "clean"
…
"rollup": {
  "clean": "bin"
…</code></pre>
<pre><code>"scripts": {
  "clean": "clean lib bin"
…
</code></pre>

<h3>rollup command</h3>
<p>The ability to use Rollup although it is a transitive dependency.</p>

<h2>Requirements</h2>
<p>To develop or compile the <strong>ECMAScript 2049</strong> project <strong>Yarn</strong> 1+ and <strong>Node.js current</strong> (v8.5+) are required.</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
