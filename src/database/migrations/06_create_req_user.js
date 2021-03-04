module.exports = {
  async up(knex) {
    return knex.schema.createTable('chamado_user', table => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('nchamado')
        .notNullable()
        .references('id')
        .inTable('chamados')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  },
  async down(knex) {
    return knex.schema.dropTable('chamado_user')
  }
}
