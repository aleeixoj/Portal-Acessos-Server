const knex = require('knex')

module.exports = {
  async up(knex) {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.string('matricula').notNullable()
      table.string('name').notNullable()
      table.string('label').notNullable()
      table.string('value').notNullable()
      table.string('email').notNullable()
      table.string('cargo').notNullable()
      table.string('group').notNullable()
      table.string('color').notNullable()
      table.date('created').notNullable()
      table.date('lastModified').notNullable()
    })
  },
  async down(knex) {
    return knex.schema.dropTable('users')
  }
}
