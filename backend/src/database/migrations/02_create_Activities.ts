// eslint-disable-next-line no-unused-vars
import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.createTable('Activities', table => {
    table.uuid('id')
      .primary()
      .notNullable()
      .unique()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name')
      .notNullable()
    table.timestamp('date')
    table.uuid('userId')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down (knex:Knex) {
  return knex.schema.dropTable('Activities')
}
