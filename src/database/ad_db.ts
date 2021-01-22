import * as knex from 'knex'

const ad = knex({
  client: 'mssql',
  connection: {
    host: process.env.AB_DB_HOST,
    // port: 3306,
    user: process.env.AD_DB_USER,
    password: process.env.AD_DB_PASS,
    database: process.env.AD_DB
  },
  useNullAsDefault: true
})

export default ad
