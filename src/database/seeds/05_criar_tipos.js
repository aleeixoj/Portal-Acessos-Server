const knex = require('knex')

module.exports = {
  async seed(knex) {
    await knex('type').insert([
      { label: 'Solicitação de acesso', value: 'Solicitação de acesso' },
      { label: 'Modificar perfil de sistema', value: 'Modificar perfil' },
      { label: 'Alteração de estampa', value: 'Alteração de estampa' },
      { label: 'Estampar operador', value: 'Estampar' },
      { label: 'Reset de senha', value: 'Reset' }
    ])
  }
}
