const knex = require('knex')

module.exports = {
  async seed(knex) {
    await knex('cargo').insert([
      { name: 'assistente', cargo: '1' },
      { name: 'supervisor', cargo: '2' },
      { name: 'analista', cargo: '3' }
    ])
  }
}
