const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const { body: check, validationResult } = require('express-validator');

const shiftModel = require('../models/shift');

router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    return res.json({"name": "brandon", "age": 24, "user_id": user_id});
});

const emptyErrMsgSuffix = ' must be provided.'
router.post('/', [
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
    
    const shift = new shiftModel({
        user: req.body.user,
        type: req.body.type,
        length: req.body.length,
        openForTrade: req.body.openForTrade,
        status: req.body.status,
        date: req.body.date,
        group: req.body.group
    });

    shift.save()
    .then(shift => {
        return res.json({ shift });
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });    });
});

module.exports = router;