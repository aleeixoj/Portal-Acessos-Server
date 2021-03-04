import knex from 'knex'
require('dotenv/config')

const ad = knex({
  client: 'mssql',
  connection: {
    host: '10.238.176.65',
    // port: 3306,
    user: 'app_web',
    password: 'Vivo*1515',
    database: 'webpages'
  },
  useNullAsDefault: true
})

export default ad
