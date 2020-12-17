const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');

const HospitalController = require('../controllers/hospitalController');

// CREATE
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

// READ
router.get('/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    Hospital.findById(hospitalId)
    .then(hospital => {
        return res.json({ hospital });
    })
    .catch(err => {
        return res.status(404).json({ errorMessage: 'No hospital found with that ID.' });
    });
});

// UPDATE 
router.put('/:hospitalId', (req, res) => {
    const { hospitalId } = req.params;
    Hospital.findByIdAndUpdate(
        hospitalId, 
        req.body, 
        { 
            new: true, 
            runValidators: true 
        },
        (err, hospital) => {
            if (err) {
                return res.status(err.status || 500).json({ errorMessage: err.message });
            }
            if (!hospital) {
                return res.status(err.status || 404).json({ errorMessage: 'Hospital not found' });
            }
    
            return res.json({ hospital });
        });
});

// DELETE
router.delete('/:hospitalId', (req, res) => {
    Hospital.findByIdAndDelete(req.params.hospitalId)
    .then(hospital => {
        return res.json({ message: `Successfully deleted hospital ${ hospital._id }` });
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
})

module.exports = router;