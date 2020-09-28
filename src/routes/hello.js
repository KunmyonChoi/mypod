const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler')
const fetch = require('node-fetch');
const EventEmitter = require('events');
const { validate } = require('../validator');

const callbackEvent = new EventEmitter();

const router = express.Router();

const targetAddr = '127.0.0.1';
const targetPort = 8080;

class CustomFetchError extends Error {
  constructor(status, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomFetchError);
    }

    this.status = status;
  }
}

async function fetchFunc(url, method) {
  return fetch(url, { method })
    .then(async (r) => {
      const j = await r.json();
      if (r.status < 200 || r.status >= 300) return new CustomFetchError(r.status, j.message);
      return j;
    })
    .catch((e) => new CustomFetchError(500, e.message));
}

router.get('/error', (req, res) => {
  res.status(400).json({ code: 'INVALID_PARAM', message: 'parameter error' });
});

router.get('/success', (req, res) => {
  res.status(200).json({ id: 1, name: 'cam1' });
});

router.get('/test_service_down', async (req, res) => {
  const ret = await fetchFunc('http://127.0.0.1:800/error', 'GET');

  if (ret instanceof Error) return res.status(ret.status).json({ message: ret.message });

  return res.status(200).json(ret);
});

router.get('/test_response_error', async (req, res) => {
  const ret = await fetchFunc('http://127.0.0.1:8080/error', 'GET');

  if (ret instanceof Error) return res.status(ret.status).json({ message: ret.message });

  return res.status(200).json(ret);
});

router.get('/test_response_success', async (req, res) => {
  const ret = await fetchFunc('http://127.0.0.1:8080/success', 'GET');

  if (ret instanceof Error) return res.status(ret.status).json({ message: ret.message });

  return res.status(200).json(ret);
});

// Example code: long running task
router.get('/long-job', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'job completed!', code: 0 });
  }, 1000);
});

// Example code: sync response of long running task
router.get('/sync-long-job', async (req, res) => {
  try {
    await fetch(`http://${targetAddr}:${targetPort}/long-job`, { method: 'GET' })
      .then((ret) => ret.json())
      .then((json) => res.json(json));
  } catch (err) {
    res.json({ code: -1, error: err });
  }
});

// Example code: Simulate device api for long running job
router.get('/long-job-with-callback', [
  check('callbackPath', 'should be a string like \'callback\'').isString(),
],
validate,
(req, res) => {
  res.json({ message: `job-started: ${req.id}`, code: 0 });

  // Simulate long running job
  setTimeout(() => {
    fetch(`http://${targetAddr}:${targetPort}/${req.query.callbackPath}`, { method: 'GET', headers: { 'x-request-id': req.id } });
  }, 1000);
});

// Example code: Server side response api that device calls when job completed
const callbackPath = 'callback';

router.get(`/${callbackPath}`, (req, res) => {
  res.send('ok');
  // fire job complete event
  callbackEvent.emit(`job-${req.id}`, { code: 0, message: 'job-done' });
});

// Example code: Server side request api
router.get('/sync-callback-job', async (req, res) => {
  // wait for job complete callback event
  callbackEvent.once(`job-${req.id}`, (ret) => res.json(ret));

  // request long running job
  try {
    fetch(`http://${targetAddr}:${targetPort}/long-job-with-callback?callbackPath=${callbackPath}`, { method: 'GET', headers: { 'x-request-id': req.id } })
      .catch((err) => { throw err; });
  } catch (err) {
    res.json({ code: -1, error: err });
  }
});

module.exports = router;
