// eslint-disable-next-line no-unused-vars
import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.createTable('Users', table => {
    table.uuid('id')
      .primary()
      .notNullable()
      .unique()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name')
      .notNullable()
    table.string('email')
      .unique()
      .notNullable()
    table.string('picture')
      .unique()
      .notNullable()
    table.string('googleAccessToken')
      .notNullable()
    table.string('googleRefreshToken')
      .notNullable()
  })
}
export async function down (knex:Knex) {
  return knex.schema.dropTable('Users')
}
