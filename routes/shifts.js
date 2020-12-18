const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const { body: check, validationResult } = require('express-validator');
const authorization = require('../middleware/authorization');
const User = require('../models/user');
const Shift = require('../models/shift');
const Constants = require('../util/constants');

const shiftModel = require('../models/shift');

const { emptyErrMsgSuffix } = Constants;

// CREATE
router.post('/', authorization.auth, [
    check('type').not().isEmpty().withMessage('Type' + emptyErrMsgSuffix),
    check('length').not().isEmpty().withMessage('Length' + emptyErrMsgSuffix),
    check('openForTrade').not().isEmpty().withMessage('OpenForTrade' + emptyErrMsgSuffix),
    check('status').not().isEmpty().withMessage('Status' + emptyErrMsgSuffix),
    check('date').not().isEmpty().withMessage('Date' + emptyErrMsgSuffix),
    check('group').not().isEmpty().withMessage('Group' + emptyErrMsgSuffix),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errs = errors.array();
        return res.status(400).json({ errorMessage: errs[0].msg });
    }
    
    // extract to controller
    const shift = new shiftModel({
        user: req.user,
        type: req.body.type,
        length: req.body.length,
        openForTrade: req.body.openForTrade,
        status: req.body.status,
        date: req.body.date,
        group: req.body.group
    });

    // need to ensure this isn't already a shift with this same date
    shift.save()
    .then(shift => {
        return res.json({ shift });
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });    
    });
});

// READ
router.get('/:shiftId', (req, res) => {
    Shift.findById(req.params.shiftId)
    .then(shift => {
        return res.json({ shift });
    })
    .catch(err => {
        console.log(err.message);
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg }); 
    })
});

// UPDATE 
router.put('/:shiftId', authorization.auth, async (req, res) => {
    const shift = await Shift.findById(req.params.shiftId)

    const shiftUserId = shift.user._id.toString();
    const tokenUserId = req.user._id.toString();

    if (shiftUserId !== tokenUserId) {
        // this user is not authorized to change this shift
        return res.status(403).json({ errorMessage: '403: User is not authorized to make this request.' })
    }

    if (req.body.openForTrade) {
        shift.openForTrade = req.body.openForTrade;
    }
    if (req.body.status) {
        shift.status = req.body.status;
    }
    if (req.body.type) {
        shift.type = req.body.type;
    }
    if (req.body.length) {
        shift.length = req.body.length;
    }
    if (req.body.date) {
        shift.date = req.body.date;
    }

    shift.save()
    .then(shift => {
        return res.json({ shift });
    })
    .catch(err => {
        console.log(err.message);
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg }); 
    })
});

// DELETE
router.delete('/:shiftId', authorization.auth, (req, res) => {
    Shift.findByIdAndDelete(req.params.shiftId)
    .then(shift => {
        return res.json({ message: `Succesfully deleted shift ${ shift._id }` });
    })
    .catch(err => {
        console.log(err.message);
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg }); 
    });
});

module.exports = router;