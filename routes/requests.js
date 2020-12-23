const express = require('express');
const router = express.Router();
const requestSchema = require('../models/request');
const Constants = require('../util/constants');

const { body: check, validationResult } = require('express-validator');
const { emptyErrMsgSuffix } = Constants;
const authorization = require('../middleware/authorization');
const Request = require('../models/request');


// CREATE
// actually maybe this isn't needed. the logic for creating a shift itself should only be fired once a user adds a shift open for trade
// users send the shifts they want to become open for trade
// BODY:
// - posterOriginalShift - shiftId
// - shiftLength
router.post('/', authorization.auth, [
    check('posterOriginalShift').not().isEmpty().withMessage('posterOriginalShift' + emptyErrMsgSuffix),
    check('shiftLength').not().isEmpty().withMessage('shiftLength' + emptyErrMsgSuffix)
], (req, res) => {
    // validate missing field errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errs = errors.array();
        return res.status(400).json({ errorMessage: errs[0].msg });
    }

    const { posterOriginalShift, shiftLength } = req.body;
    const request = new Request({
        poster: req.user,
        posterOriginalShift,
        shiftLength,
        status: 
    })
});

// READ
router.get('/requestId', (req, res) => {

});

// UPDATE
router.patch('/requestId', (req, res) => {
    
});

// DELETE
router.delete('/requestId', (req, res) => {

});
