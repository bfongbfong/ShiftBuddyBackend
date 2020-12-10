const express = require('express');
const router = express.Router();
const mongoose = express('mongoose');

const User = require('../models/user');

const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    const { password, email, firstName, lastName, classification } = req.body; 
    const hash = await bcrypt.hash(password, 12)
    .catch(e => {
        console.log(`ERROR! ${e}`);
    });
    const user = new User({
        firstName,
        lastName,
        email,
        password: hash,
        classification
    })
    const newUser = await user.save();
    console.log(newUser);
    res.send(req.body);
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