import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '..', '.env')
})
const { DATABASE_URL } = process.env

const databasePath = path.resolve(__dirname, 'database')
const migrationsPath = path.resolve(databasePath, 'migrations')

module.exports = {
  client: 'pg',
  connection: DATABASE_URL,
  migrations: {
    directory: migrationsPath
  }
}
