const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

const targetAddr = '127.0.0.1';
const targetPort = 8080;

router.get('/hello', (req, res) => {
  res.json({ message: 'world!', code: 0 });
});

router.get('/hi', async (req, res) => {
  try {
    await fetch(`https://${targetAddr}:${targetPort}/hello`, { method: 'GET' })
      .then((ret) => ret.json())
      .then((json) => res.json(json));
  } catch (err) {
    res.json({ code: -1, error: err });
  }
});

module.exports = router;
