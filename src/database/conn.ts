import knex from 'knex'

const toNumber: any = process.env.DB_ACESSOS_PORT
const port = parseInt(toNumber)
const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_ACESSOS_HOST,
    port,
    user: process.env.DB_ACESSOS_USR,
    password: process.env.DB_ACESSOS_PASS,
    database: process.env.DB_ACESSOS
  },
  useNullAsDefault: true
})

export default db
