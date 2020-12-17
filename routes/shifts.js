const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const { body: check, validationResult } = require('express-validator');
const authorization = require('../middleware/authorization');
const User = require('../models/user');
const Shift = require('../models/shift');
const Constants = require('../util/constants');

const shiftModel = require('../models/shift');

// no need for authorization here.
router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    const { group, month, year } = req.query;

    const start = new Date(year, month, 1);
    const nextMonth = new Date(year, month + 1, 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    const end = new Date(nextMonth);

    Shift.find({ user: user_id, group: group, date: { $gte: start, $lte: end } })
    .then(shifts => {
        return res.json({ shifts })
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });    
    });
});

const { emptyErrMsgSuffix } = Constants;
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

module.exports = router;