<h1>ECMAScript 2049 Package</h1>
<img src=https://raw.githubusercontent.com/haraldrudell/ECMAScript2049/HEAD/workspace/packages/es2049scripts/assets/ECMAScript%202049.png alt="ECMAScript 2049" />
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
  <li><p>Add <strong>es2049package</strong> to your project</p>
    <blockquote><strong>yarn add es2049package --dev</strong></blockquote></li>
  <li><p>Add <strong>build</strong> to the <code>scripts</code> entry of package.json:</p>
    <blockquote><strong>"scripts": {<br />
    &emsp;"build": "rollup --config node:es2049package"<br />
    …</strong></blockquote></li>
  <li><p>Build:</p>
    <blockquote><strong>yarn build</strong></blockquote></li>
</ol>

<p>ADVICE</p>
<ul>
  <li>If building a Node.js executable, consider newer than default  rollup.target: {node: '6.10'}. Ensure main, module are set</li>
  <li>If writing a command-line executable set rollup.shebang: true and probably dependencies: false</li>
  <li>It does work, here is a functional <a href=https://github.com/haraldrudell/ECMAScript2049/blob/master/workspace/packages/allspawn/package.json>package.json</a></li>
  <li>If it seems mysterious, use rollup.print: true</li>
</ul>
<p>A package.json using <strong>es2049package</strong> can be found <strong><a href=https://github.com/haraldrudell/ECMAScript2049/blob/master/workspace/packages/allspawn/package.json>here</a></strong></p>

<h3>Fields in package.json</h3>
<p>Fields used are the rollup key as well as standard top-level keys name, main, module</p>
<p>Rollup keys:</p>
<ul>
  <li><strong>input</strong>: optional string or array, default <strong>src/index.js</strong> or <strong>src/index.mjs</strong>: the entry point used for compilation. If this is an array, it is of objects each describing a compilation with keys: <strong>input output dependencies main module external node print shebang targets</strong>. Those keys overrides the rollup keys.<ul>
    <li><strong>main</strong>: boolean, default false. use main field as output
    <li><strong>module</strong>: boolean, default false. use module field as output</li>
  </ul></li>
  <li><strong>output</strong>: optional array or object. A rollup object with file and format (cjs, es) properties. default is according to main or module (or both), if none present it is './build/&lt;package-name>', used for command-line executables</li>
  <li><strong>external</strong>: optional string, array of string: list of packages or filenames that are to be external</li>
  <li><strong>clean</strong>: string or list of strings, desribed below under clean command</li>
  <li><strong>node</strong>: boolean default true. If true, the standard library are added as externals. Should normally be used for all Node.js programs</li>
  <li><strong>targets</strong>: optional string 'stable', 'current' or a target object as defined  by babelJS. default is Node 6.10 LTS maintenance. <strong>mini</strong> indicates Node.js 9+</li>
  <li><strong>dependencies</strong>: optional boolean default true whether dependencies in package.json should be external. Use false if building a self-contained executable.</li>
  <li><strong>print</strong>: boolean, default false. If true, diagnostic printouts</li>
  <li><strong>shebang</strong>: boolean, default false. If true: the output is an executable, with a shebang line and proper permissions.</li>
</ul>

<h3>clean command</h3>
<p>Intended to provide a <em><strong>clean</em></strong> command for use with <strong>yarn</strong>. Clean, when invoked using <em><strong>yarn clean</em></strong>, removes any files or directories provided to it as command-line arguments or if no argments from the rollup.clean field of package.json</p>
<blockquote><strong>"rollup": {<br />
  &emsp;"clean": "bin"<br />
  …</strong></blockquote>
<p>or:</p>
<blockquote><strong>"scripts": {<br />
  &emsp;"clean": "clean lib bin"<br />
  …</strong></blockquote>

<h3>rollup command</h3>
<p>The ability to use Rollup although it is a transitive dependency.</p>

<h2>Requirements</h2>
<p>To develop or compile the <strong>ECMAScript 2049</strong> project <strong>Yarn</strong> 1+ and <strong>Node.js current</strong> (v8.5+) are required.</p>
<p>&emsp;</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
