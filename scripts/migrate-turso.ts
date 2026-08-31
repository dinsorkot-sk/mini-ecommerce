import { createClient } from '@libsql/client'
import fs from 'node:fs'

const url = 'libsql://mini-ecommerce-dinsorkot.aws-ap-northeast-1.turso.io'
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgxODIzMDYsImlkIjoiMDFhMDU3ZjgtODEwMS03ZmU0LTgzZGYtY2Q3NWM5MTUxZjc2Iiwia2lkIjoiVzQ3U3B3N2FZYVAycVhFM3BHU0MyNml2cHNJYTlRWnl5TjFDejYtUk5GQSIsInJpZCI6IjAyNWZjOTUxLTllMjktNGM2Ni1iNGQxLWJjZGM3NzA1YTEwOCJ9.tngKp8Y7nkxDOl3VYQisZjz2z4kfF19TgsWU33mtIXlVeqFE9P8nuElZa6DIclZBzhJTE6zQxeSICaCs2enuDA'
const client = createClient({ url, authToken })
const r = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
console.log('tables before:', r.rows.map((x: any) => x.name))
const sql = fs.readFileSync('server/db/migrations/0000_short_the_anarchist.sql', 'utf8')
const stmts = sql.split('--> statement-breakpoint').map((s: string) => s.trim()).filter(Boolean)
for (const st of stmts) {
  try {
    await client.execute(st)
    console.log('ok', st.slice(0, 60).replace(/\n/g, ' '))
  } catch (e: any) {
    console.log('skip', String(e.message).slice(0, 120))
  }
}
const r2 = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
console.log('tables after:', r2.rows.map((x: any) => x.name))
