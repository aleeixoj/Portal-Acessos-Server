const { up } = require('./04_create_super_user')

module.exports = {
  async up(knex) {
    return knex.schema.createTable('chamados', table => {
      table.increments('id').primary()
      table.string('color').notNullable()
      table.string('nchamado')
      table.string('requisitante').notNullable()
      table.string('sistema').notNullable()
      table.string('tipo').notNullable()
      table.string('massivo').notNullable()
      table.string('typeOfSystem').notNullable()
      table.string('linkSystem').notNullable()
      table.string('matricula').notNullable()
      table.string('status').notNullable()
      table.string('responsavel').notNullable()
      table.string('group').notNullable()
      table.string('espelho').notNullable()
      table.string('desc')
      table.timestamp('created').notNullable()
      table.timestamp('lastModified')
    })
  },
  async down(knex) {
    return knex.schema.dropTable('chamados')
  }
}
