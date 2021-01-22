const knex = require('knex')

module.exports = {
  async seed(knex) {
    const today = new Date()
    const pass = process.env.ADMIN_USER_PASSWORD
    const mat = 'admin'
    const userData = {
      name: 'admin',
      value: 'admin',
      label: 'admin',
      matricula: mat,
      // password: pass,
      email: 'admin@admin.com',
      group: 'OPERACIONAL',
      created: today,
      online: '0',
      super_id: '3',
      cargo: '0',
      lastModified: today
    }
    await knex('users').insert(userData)
  }
}
