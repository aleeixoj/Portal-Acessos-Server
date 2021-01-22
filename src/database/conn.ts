import * as knex from 'knex'

const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'acessos'
  },
  useNullAsDefault: true
})

export default db
