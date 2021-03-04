module.exports = {
  async up(knex) {
    return knex.schema.createTable('cargo_user', table => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('cargo')
        .notNullable()
        .references('id')
        .inTable('cargo')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  },
  async down(knex) {
    return knex.schema.dropTable('cargo_user')
  }
}
