<h1>allspawn</h1>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>

<h2>Benefits</h2>
<p>Execute commands using async/promises</p>
<p>Full error handling, ability to capture stdout and stderr as well as the child process object</p>

<h2>Usage</h2>
<blockquote><strong>import {spawnAsync, spawnCapture, SpawnShim, SpawnAsync, SpawnPipe} from 'allspawn'</strong></blockquote>
<p>&emsp;</p>

<p><strong> async spawnAsync({args, options, cpReceiver, echo, capture, stderrFails, nonZeroOk})</strong><br />
&emsp;resolves to:<br/>
&emsp;&emsp;capture: false: Number 0<br />
&emsp;&emsp;&emsp;nonZeroOk: true: may return non-zero number<br />
&emsp;&emsp;&emsp;signalOk: true: may return string signal like 'SIGTERM'<br />
&emsp;&emsp;capture: true: {stdout, stderr, status, signal}<br />
<strong>args</strong>: array of string arguments, the first string is the command<br />
<strong>options</strong>: optional object as defined by Node.js spawn (cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide)<br />
<strong>options.timeout</strong>: the process is killed if not completing in timeout ms, default infinite<br />
<strong>options.silent</strong>: optional bolean default false: do not echo to the parent process’ stdout and stderr, ie. if true the child process executes silently.<br />
<strong>options.stdio</strong>: default no stdin and echo to stdout and stderr.<br />
<strong>cpReceiver</strong>: an object that will receive the child process object as property <strong>cp</strong><br />
<strong>echo</strong>: optional boolean, default false: command and arguments are printed<br />
<strong>capture</strong>: optional boolean, default false: stdout and stderr are captured, up to <strong>options.maxBuffer</strong> bytes (200 KiB)<br />
<strong>stderrFails</strong>: optional boolean, default false: any output to stderr will cause error. If capture is true, the error is thrown at end of process, otherwise on first print.<br />
<strong>nonZeroOk</strong>: optional boolean, default false: if the child process reurns a status  code other than zero, return it instead of throwing an error.</br />
<strong>signalOk</strong>: optional boolean, default false: if the child process is terminated by a signal, the signal string is returned instead of an error thrown.</p>
<p>&emsp;</p>

<p><strong>{stdout} async spawnCapture({args, …})</strong><br />
Like spawnAsync but with defaults helpful for executing system commands from node programs.<br />
<strong>stderrFails</strong>: true, so that echo to stderr causes error<br />
<strong>capture</strong>: true, so that output is captured<br />
<strong>options.timeout</strong>: the process is killed if not completing within 3 s<br />
<strong>options.silent</strong>: true, the process executes silently<br />
Return value: unlike <strong>SpawnAsync</strong>, if <strong>stdout</strong> or <strong>stderr</strong> has a terminating newline, it is removed</p>
<p>&emsp;</p>

<p><strong>SpawnAsync</strong><br />
This is the class implementation for spawnAsync, ie. <strong>spawnAsync(o)</strong> is <strong>new SpawAsync(o).startSpawn()</strong></p>
<p><strong>SpawnShim</strong><br />
This is a promise shim around <strong>child_process.spawn</strong>, like it needs to work in 2018.</p>
<p>&emsp;</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
