import Knex from 'knex'

export async function up (knex:Knex) {
  return knex.schema.createTable('ClassroomActivities', table => {
    table.uuid('activityId')
      .notNullable()
      .references('id')
      .inTable('Activities')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.string('courseWorkId')
      .notNullable()
    table.string('courseName')
      .notNullable()
    table.string('courseId')
      .notNullable()
    table.string('classroomUrl')
      .notNullable()
  })
}

export async function down (knex:Knex) {
  return knex.schema.dropTable('ClassroomActivities')
}
