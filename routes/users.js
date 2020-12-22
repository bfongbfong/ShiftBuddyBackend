const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');
const Constants = require('../util/constants');
const { emptyErrMsgSuffix, UKNOWN_ERROR } = Constants;


const { body: check, validationResult } = require('express-validator');

const User = require('../models/user');
const UserController = require('../controllers/userController');

const bcrypt = require('bcrypt');

const authorization = require('../middleware/authorization');

// Login
router.post('/login', async (req, res) => {
    await UserController.login(req.body)
    .then(resultObj => {
        return res.json(resultObj);
    })
    .catch(err => {
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    });
});


// CREATE
// Validation within the route checks if the values are empty or not.
// Validation for email and password happen in mongoose
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
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    });
})

// READ - Subjective
router.get('/userInfo', authorization.auth, (req, res) => {
    const { user } = req;
    return res.json({ user });
});


// UPDATE
router.patch('/', authorization.auth, (req, res) => {
    if (req.body.password) {
        delete req.body.password;
    }
    if (req.body.email) {
        delete req.body.email;
    }
    User.findByIdAndUpdate(
        req.user, 
        req.body, 
        { 
            new: true, 
            runValidators: true 
        }, 
        (err, user) => {
        if (err) {
            return res.status(err.status || 500).json({ errorMessage: err.message });
        }
        if (!user) {
            return res.status(err.status || 404).json({ errorMessage: 'User not found' });
        }

        return res.json({ user });
    });
});


// DELETE
router.delete('/', authorization.auth, (req, res) => {
    User.findByIdAndDelete(req.user)
    .then(user => {
        return res.json({ message: `Successfully deleted user ${ req.user._id }` });
    })
    .catch(err => {
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});

// Retrieves a user's groups - no need for authorization
router.get('/:userId/groups', async (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
    .then(foundUser => {
        if (!foundUser) {
            return res.status(404).json({ errorMessage: 'User not found.' });
        }
        return res.json({ groups: foundUser.groups });
    })
    .catch(err => {
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});


// Retrieves a user's shift - no need for authorization
router.get('/:userId/shifts', (req, res) => {
    const { userId } = req.params;
    const { group, month, year } = req.query;

    const start = new Date(year, month, 1);
    const nextMonth = new Date(year, month + 1, 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    const end = new Date(nextMonth);

    Shift.find({ 
        user: userId, 
        group: group, 
        date: 
        { 
            $gte: new Date(new Date(start).setHours(00, 00, 00)), 
            $lte: new Date(new Date(end).setHours(23, 59, 59))
        } 
    })
    .then(shifts => {
        return res.json({ shifts })
    })
    .catch(err => {
        console.log(err.message);
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });    
    });
});
module.exports = router;