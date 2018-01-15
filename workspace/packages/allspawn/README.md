<h1>allspawn</h1>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>

<h2>Benefits</h2>
<p>Execute commands using async/promises</p>
<p>Full error handling, ability to capture stdout and stderr as well as the child process object</p>

<h2>Usage</h2>
<code>import {SpawnAsync, SpawnCapture} from 'allspawn'</code>
<pre><strong>async SpawnAsync(cmd, args, options, cpReceiver)</strong><br />
<strong>cmd</strong>: non-empty string: command, absolute path or searched in PATH<br />
<strong>args</strong> optional array of string arguments
<strong>options</strong> optional object as defined by Node.js spawn. stdio is: ['ignore', 'inherit', 'inherit'] (cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide)
<strong>cpReceiver</strong> an object that will receive the child process object as property cp<br />
The promise resolves when the stdio of the child process closes. The promise resolves to Number 0.</code></pre>

<pre><strong>{stdout, stderr} async SpawnCapture(cmd, args, options)</strong><br />
cmd, args, options as for SpawnAsync with addition:<br />
options.stderrFails: boolean, default False: echo to stderr throws Error<br />
options.doPipe: boolean, default false: pipe the process’ stdout and stderr to the terminal. If not provided, no echo from the process is displayed<br />
The promise resolves to an object with two string properties astdout and stderr</code></pre>
<p>&emsp;</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
