const knex = require('knex')

module.exports = {
  async up(knex) {
    return knex.schema.createTable('type', table => {
      table.increments('id').primary()
      table.string('label').notNullable()
      table.string('value').notNullable()
    })
  },
  async down(knex) {
    return knex.schema.dropTable('type')
  }
}
