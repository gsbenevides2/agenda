// eslint-disable-next-line no-unused-vars
import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.raw('CREATE EXTENSION "uuid-ossp"')
}
export async function down (knex:Knex) {
  return knex.schema.raw('DROP EXTENSION "uuid-ossp"')
}
