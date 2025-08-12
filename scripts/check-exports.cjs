const { spawnSync } = require('child_process')

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const res = spawnSync(npx, ['ts-prune', '-p', 'tsconfig.json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
})

const out = (res.stdout || '').trim()
if (res.status && res.status !== 0) process.exit(res.status)

if (out) {
  console.error('\n🚫 Unused exports encontrados:\n')
  console.error(out + '\n')
  process.exit(1)
} else {
  console.log('✅ Sem unused exports.')
}
