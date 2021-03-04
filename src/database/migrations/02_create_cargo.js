const knex = require('knex')

module.exports = {
  async up(knex) {
    return knex.schema.createTable('cargo', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('cargo').notNullable()
    })
  },
  async down(knex) {
    return knex.schema.dropTable('cargo')
  }
}
