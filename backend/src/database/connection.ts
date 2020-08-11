import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()
const { DATABASE_URL } = process.env

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
})

export default db
