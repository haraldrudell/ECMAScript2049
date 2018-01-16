<h1>allspawn</h1>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>

<h2>Benefits</h2>
<p>Execute commands using async/promises</p>
<p>Full error handling, ability to capture stdout and stderr as well as the child process object</p>

<h2>Usage</h2>
<blockquote><strong>import {spawnAsync, spawnCapture} from 'allspawn'</strong></blockquote>
<p>&emsp;</p>
<p><strong>async spawnAsync(cmd, args, options, cpReceiver)</strong><br />
<strong>cmd</strong>: non-empty string: command, absolute path or searched in PATH<br />
<strong>args</strong> optional array of string arguments<br />
<strong>options</strong> optional object as defined by Node.js spawn. stdio is: ['ignore', 'inherit', 'inherit'] (cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide)<br />
<strong>cpReceiver</strong> an object that will receive the child process object as property cp<br />
<strong>return value</strong>: The promise resolves when the stdio of the child process closes. The promise resolves to Number 0.</p>
<p>&emsp;</p>

<p><strong>{stdout, stderr} async spawnCapture(cmd, args, options)</strong><br />
<strong>cmd</strong>, <strong>args</strong>, <strong>options</strong> as for <strong>SpawnAsync</strong> with addition:<br />
<strong>options.stderrFails</strong>: boolean, default true: echo to stderr throws Error<br />
<strong>options.doPipe</strong>: boolean, default false: pipe the process’ stdout and stderr to the terminal. If not provided, no echo from the process is displayed<br />
<strong>return value</strong>: The promise resolves to an object with two string properties <strong>stdout</strong> and <strong>stderr</strong></p>
<p>&emsp;</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
