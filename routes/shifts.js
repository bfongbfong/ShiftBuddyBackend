const express = require('express');
const router = express.Router();

router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    return res.json({"name": "brandon", "age": 24, "user_id": user_id});
})

module.exports = router;