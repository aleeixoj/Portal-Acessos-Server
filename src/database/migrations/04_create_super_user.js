module.exports = {
  async up(knex) {
    return knex.schema.createTable('super_user', table => {
      table.increments('id').primary()
      table
        .integer('super_id')
        .notNullable()
        .references('id')
        .inTable('super')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  },
  async down(knex) {
    return knex.schema.dropTable('super_user')
  }
}
