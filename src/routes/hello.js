const express = require('express')
var router = express.Router()

router.get('/hello', (req, res) => {
    res.send('world');
})

module.exports = router