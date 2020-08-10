const express = require('express');
const fetch = require('node-fetch');
const EventEmitter = require('events');

const callbackEvent = new EventEmitter();

const router = express.Router();

const targetAddr = '127.0.0.1';
const targetPort = 8080;

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
router.get('/async-job', (req, res) => {
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
    fetch(`http://${targetAddr}:${targetPort}/async-job?callbackPath=${callbackPath}`, { method: 'GET', headers: { 'x-request-id': req.id } });
  } catch (err) {
    res.json({ code: -1, error: err });
  }
});

module.exports = router;
