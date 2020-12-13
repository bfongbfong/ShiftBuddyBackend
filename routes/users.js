const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');
const Util = require('../util/util');
const constants = require('../util/constants');

const { body: check, validationResult } = require('express-validator');

const User = require('../models/user');
const UserController = require('../controllers/userController');

const bcrypt = require('bcrypt');

const authorization = require('../middleware/authorization');

// Validation within the route checks if the values are empty or not.
// Validation for email and password happen in mongoose
const emptyErrMsgSuffix = ' must be provided.'
router.post('/register', [
    check('email').not().isEmpty().withMessage('Email' + emptyErrMsgSuffix),
    check('password').not().isEmpty().withMessage('Password' + emptyErrMsgSuffix),
    check('firstName').not().isEmpty().withMessage('First name' + emptyErrMsgSuffix),
    check('lastName').not().isEmpty().withMessage('Last name' + emptyErrMsgSuffix),
    check('classification').not().isEmpty().withMessage('Classification' + emptyErrMsgSuffix),
], async (req, res) => {

    // validate missing field errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errs = errors.array();
        return res.status(400).json({ errorMessage: errs[0].msg });
    }

    await UserController.register(req.body)
    .then(resultObj => {
        return res.json(resultObj);
    })
    .catch(err => { 
        console.log('error here');
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    });
})

router.post('/login', async (req, res) => {
    await UserController.login(req.body)
    .then(resultObj => {
        return res.json(resultObj);
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    });
});

// retrieves the groups that the user is part of
router.get('/:userId/groups', async (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
    .then(foundUser => {
        return res.json({ groups: foundUser.groups });
    })
    .catch(err => {
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});

module.exports = router;