const express = require('express');
const router = express.Router();

const HospitalController = require('../controllers/hospitalController');

router.post('/', (req, res) => {
    HospitalController.createNewHospital(req.body)
    .then(savedHospital => {
        return res.json({ hospital: { savedHospital }});
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});

module.exports = router;