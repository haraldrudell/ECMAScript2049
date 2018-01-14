import spawn from 'es-spawn'
f()
async function f () {
  const v = await spawn('node', ['--version'])
  console.log(v)
}
