const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const shiftRoutes = require('./routes/shifts');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const config = require('config'); // taken from rz
const cors = require('cors'); // taken from rz, not sure what it does

const app = express();

app.get("/", (req, res) => {
    res.send("HI WELCOME TO MY WEBSITE");
})

app.use('/shifts', shiftRoutes);

app.listen(3000, () => {
    console.log("serving app on localhost:3000")
})