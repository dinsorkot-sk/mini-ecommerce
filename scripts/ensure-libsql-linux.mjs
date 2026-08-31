/**
 * Ensure @libsql/linux-x64-gnu stub exists in function node_modules.
 * On Windows, pnpm doesn't install linux-x64-gnu binary.
 * The stub forces libsql to use HTTP/WebSocket transport (correct for Turso).
 *
 * ROOT node_modules: keep the real index.node if present, don't overwrite.
 * FUNCTION node_modules: always create stub (function runs on Linux via Netlify).
 */
import fs from 'node:fs'
import path from 'node:path'

// Function node_modules — always create stub
const funcDir = '.netlify/functions-internal/server/node_modules/@libsql/linux-x64-gnu'
const funcPkg = path.join(funcDir, 'package.json')
const funcJs = path.join(funcDir, 'index.js')
if (!fs.existsSync(funcJs)) {
  fs.mkdirSync(funcDir, { recursive: true })
  fs.writeFileSync(funcPkg, JSON.stringify({ name: '@libsql/linux-x64-gnu', version: '0.5.29', main: 'index.js' }))
  fs.writeFileSync(funcJs, 'module.exports = {}')
  console.log('[ensure-libsql] created function stub')
} else {
  console.log('[ensure-libsql] function stub already present')
}
