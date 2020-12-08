const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.json({"name": "brandon", "age": 24});
})

module.exports = router;