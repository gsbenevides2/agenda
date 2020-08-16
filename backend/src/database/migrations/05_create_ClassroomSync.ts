// eslint-disable-next-line no-unused-vars
import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.createTable('ClassroomSync', table => {
    table.uuid('userId')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.uuid('processId')
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('status')
      .notNullable()
  })
}

export async function down (knex:Knex) {
  return knex.schema.dropTable('ClassroomSynchronizations')
}
