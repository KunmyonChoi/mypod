const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const reqId = require('express-request-id');
const log = require('debug')('app');

const helloRouter = require('./routes/hello');

if (process.env.NODE_ENV !== 'production') {
  log('Looks like we are in development mode!');
}

const app = express();

app.port = process.env.API_PORT || 8080;

app.use(reqId());
app.use(morgan('short'));

// Content-Type: application/json
app.use(bodyParser.json());

// Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', helloRouter);

app.listen(app.port, () => {
  log(`start api at ${app.port}`);
});
