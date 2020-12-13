const express = require('express');
const router = express.Router();

const HospitalController = require('../controllers/hospitalController');

router.post('/', (req, res) => {
    HospitalController.createNewHospital(req.body)
    .then(hospital => {
        return res.json({hospital});
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    });
});

module.exports = router;