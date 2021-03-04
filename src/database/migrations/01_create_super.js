const knex = require('knex')

module.exports = {
  async up(knex) {
    return knex.schema.createTable('super', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('super').notNullable()
    })
  },
  async down(knex) {
    return knex.schema.dropTable('super')
  }
}
