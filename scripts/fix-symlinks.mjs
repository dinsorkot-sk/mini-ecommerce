/**
 * Post-build fix for Netlify deploys from Windows:
 * 1. Replace MSYS symlinks with real copies
 * 2. Ensure @libsql/linux-x64-gnu exists with stub (HTTP fallback for Turso)
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2] || '.netlify/functions-internal/server/node_modules'

if (!fs.existsSync(root)) {
  console.log('[fix] dir not found:', root)
  process.exit(0)
}

let fixed = 0
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isSymbolicLink()) {
      const target = fs.realpathSync(full)
      fs.rmSync(full, { recursive: true, force: true })
      if (fs.existsSync(target)) {
        const stat = fs.statSync(target)
        if (stat.isDirectory()) fs.cpSync(target, full, { recursive: true })
        else fs.copyFileSync(target, full)
      }
      fixed++
    } else if (e.isDirectory()) walk(full)
  }
}
walk(root)
console.log(`[fix] replaced ${fixed} symlinks`)

const linuxPkg = path.join(root, '@libsql', 'linux-x64-gnu')
const stubFile = path.join(linuxPkg, 'index.js')
if (!fs.existsSync(stubFile)) {
  if (fs.existsSync(linuxPkg)) fs.rmSync(linuxPkg, { recursive: true, force: true })
  fs.mkdirSync(linuxPkg, { recursive: true })
  fs.writeFileSync(path.join(linuxPkg, 'package.json'), JSON.stringify({ name: '@libsql/linux-x64-gnu', version: '0.5.29', main: 'index.js' }))
  fs.writeFileSync(stubFile, 'module.exports = {}')
  console.log('[fix] created @libsql/linux-x64-gnu stub')
} else {
  console.log('[fix] @libsql/linux-x64-gnu stub already present')
}
console.log('[fix] done')
