const knex = require('knex')

module.exports = {
  async seed(knex) {
    const mat = 'admin'
    await knex('users').where('matricula', mat).first()
    const super_id = '3'
    const user_id = '1'
    await knex('super_user').insert({
      super_id,
      user_id
    })
  }
}
