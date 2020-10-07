const knex = require('knex')
const app = require('./app')

const { PORT, DB_URL } = require('./config')
const NODE_ENV= process.env.NODE_ENV

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server in ${NODE_ENV} listening at http://localhost:${PORT}`)
})