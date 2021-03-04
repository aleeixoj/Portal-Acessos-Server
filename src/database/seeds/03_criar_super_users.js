const knex = require('knex')

module.exports = {
  async seed(knex) {
    await knex('super').insert([
      { name: 'user', super: '1' },
      { name: 'basico', super: '2' },
      { name: 'admin', super: '3' },
      { name: 'master', super: '4' }
    ])
  }
}
