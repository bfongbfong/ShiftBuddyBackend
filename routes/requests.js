const express = require('express');
const router = express.Router();
const requestSchema = require('../models/request');
const Constants = require('../util/constants');

const { body: check, validationResult } = require('express-validator');
const { emptyErrMsgSuffix } = Constants;
const authorization = require('../middleware/authorization');


// CREATE
router.post('/', authorization.auth, [
    check('')
], (req, res) => {
    // params: 
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
