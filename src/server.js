const app = require('./app')

const { PORT } = require('./config')
const NODE_ENV= process.env.NODE_ENV

app.listen(PORT, () => {
  console.log(`Server in ${NODE_ENV} listening at http://localhost:${PORT}`)
})