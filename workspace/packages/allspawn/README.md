<h1>allspawn</h1>
<p>&emsp;</p>
<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
<p>&emsp;</p>

<h2>Benefits</h2>
<p>Execute commands using async/promises</p>
<p>Full error handling, ability to capture stdout and stderr as well as the child process object</p>

<h2>Usage</h2>
<blockquote><strong>import {spawnAsync, spawnCapture, spawnPromise} from 'allspawn'</strong></blockquote>
<p>&emsp;</p>

<p><strong> async spawnAsync({cmd, args, options, cpReceiver, echo, capture, stderrFails})</strong><br />
&emsp;resolves to: 0 or {stdout, stderr}<br/>
<strong>cmd</strong>: optional non-empty string: command, absolute path or searched in PATH, if missing fetched from first element of args<br />
<strong>args</strong>: optional array of string arguments<br />
<strong>options</strong>: optional object as defined by Node.js spawn (cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide)<br />
<strong>options.timeout</strong>: the process is killed if not completing in timeout ms, default infinite<br />
<strong>options.silent</strong>: optional bolean default false: do not echo to the parent process’ stdout and stderr, ie. if true the child process executes silently.<br />
<strong>options.stdio</strong>: default no stdin and echo to stdout and stderr.<br />
<strong>cpReceiver</strong>: an object that will receive the child process object as property <strong>cp</strong><br />
<strong>echo</strong>: optional boolean, default false: command and arguments are printed<br />
<strong>capture</strong>: optional boolean, default false: stdout and stderr are captured, up to <strong>options.maxBuffer</strong> bytes (200 KiB)<br />
<strong>stderrFails</strong>: optional boolean, default false: any output to stderr will cause error. If capture at end of process, otherwise on first print.<br />
<strong>return value</strong>: A promise that if not capturing resolves to Number 0. If capturing,returns an object with <strong>stdout</strong> and <strong>stderr</strong> string properties. The promise resolves when the stdio of the child process closes.</p>
<p>&emsp;</p>

<p><strong>{stdout} async spawnCapture({args, …})</strong><br />
Like spawnAsync but with defaults helpful for executing system commands from node programs.<br />
<strong>stderrFails</strong>: true, so that echo to stderr causes error<br />
<strong>capture</strong>: true, so that output is captured<br />
<strong>options.timeout</strong>: the process is killed if not completing within 3 s<br />
<strong>options.silent</strong>: true, the process executes silently<br />
<p>&emsp;</p>

<p><strong>{cp, promise} spawnPromise({cmd, args, options})</strong><br />
<strong>cmd</strong>: optional non-empty string: command, absolute path or searched in PATH, if missing fetched from first element of args<br />
<strong>args</strong> optional array of string arguments<br />
<strong>options</strong> optional object as defined by Node.js spawn (cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide)<br />
<strong>return value</strong>: object: <strong>cp</strong> the child process object, <strong>promise</strong>: a Promise that resolves to Number 0 or throws. The promise resolves when the stdio of the child process closes.</p>
<p>&emsp;</p>

<p>© <a href=http://haraldrudell.com>Harald Rudell</a> created <strong>ECMAScript 2049</strong> in December 2017. ISC License</p>
