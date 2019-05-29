/* eslint-disable func-names */
const createError = require('http-errors')
const express = require('express')
const path = require('path')
// const cookieParser = require('cookie-parser')
const logger = require('morgan')
const indexRouter = require('./routes/index')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')))

app.use('/', indexRouter)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(process.env.PORT || 3003, () => {
  console.log(`listening on port ${process.env.PORT || 3003}`)
})

module.exports = app
