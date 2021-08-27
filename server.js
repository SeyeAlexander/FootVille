const config = require('config')
const mongoose = require('mongoose')

process.on('uncaughtException', err => {
  console.log(err.name, err.message)
  process.exit()
})

const app = require('./app')

if (app.get('env') === 'development') {
  dbURI = config.get('database')

  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false })
    .then(console.log('connected to database..'))
    .catch(err => console.log(err))
}

if (app.get('env') === 'production') {
  dbURI = config.get('database').replace("<PASSWORD>", config.get("DB_PASSWORD"))
  // dbURI = config.get('database')

  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false })
    .then(console.log('connected to database..'))
    .catch(err => console.log(err))
}

const port = config.get('PORT') || 3000
const server = app.listen(port, () => console.log(`listening on port ${port}..`))

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  server.close(() => {
      process.exit()
  })
})