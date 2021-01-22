const knex = require('knex')

module.exports = {
  async seed(knex) {
    await knex('system').insert([
      { label: 'GPS', value: 'GPS' },
      { label: 'Siebel', value: 'Siebel' },
      { label: 'Contact Center', value: 'ContactCenter' },
      { label: 'Vivo360', value: 'Vivo360' },
      { label: 'VivoNext', value: 'VivoNext' },
      { label: 'SCA Cadastro', value: 'SCA Cadastro' }
    ])
  }
}
