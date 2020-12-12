const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');
const Util = require('../util/util');
const constants = require('../util/constants');

const { body: check, validationResult } = require('express-validator');

const User = require('../models/user');
const UserController = require('../controllers/userController');

const bcrypt = require('bcrypt');

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
    const { password, email } = req.body;

    const foundUser = await User.findOne({ email });
    if(!foundUser) {
        // colt says not to do this. don't tell them why the authentication failed.
        // just putting this here for now for practice.
        const errorMessage = "user was not found with that email";
        console.log(errorMessage);
        return res.json({
            'errorMessage': errorMessage
        })
    }

    const validPassword = await bcrypt.compare(password, foundUser.password)
    .catch(e => {
        console.log(`ERROR! ${e}`);
        return res.json({
            'errorMessage': errorMessage
        })
    });

    if (validPassword) {
        const successMessage = "WOO THAT'S THE RIGHT PASSWORD!!";
        console.log(successMessage);
        return res.json({
            'message': successMessage
        })
    }
    else {
        const errorMessage = "wRONG PASSWORD";
        console.log(errorMessage);
        return res.json({
            'errorMessage': errorMessage
        })
    }
});

module.exports = router;