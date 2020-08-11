import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.createTable('UserSessions', table => {
    table.uuid('id')
      .primary()
      .unique()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('userId')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down (knex:Knex) {
  return knex.schema.dropTable('UserSessions')
}
