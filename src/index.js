var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var reqId = require('express-request-id')

var helloRouter = require('./routes/hello')

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

var app = express()

app.use(reqId())
app.use(morgan('short'))

// Content-Type: application/json
app.use(bodyParser.json())

// Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false})) 

app.use('/', helloRouter)

app.listen(8080, () => {
    console.log('start api at 8080')
})