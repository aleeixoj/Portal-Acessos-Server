const path = require('path')

module.exports = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: '3306', //'8889'
    user: 'root',
    password: 'root',
    database: 'acessos'
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  useNullAsDefault: true
}
