const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const shiftRoutes = require('./routes/shifts');
const groupRoutes = require('./routes/groups');
const hospitalRoutes = require('./routes/hospital');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const config = require('config'); // taken from rz
const cors = require('cors'); // taken from rz, not sure what it does

const authorization = require('./middleware/authorization');

const app = express();

mongoose.connect('mongodb://localhost:27017/authDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!");
    })
    .catch((err) => {
        console.log("OH NO MONGO CONNECTION ERROR!!!");
        console.log(err)
    })

const User = require('./models/user');

app.use(express.urlencoded({ extended: true }))


app.get('/secret', (req, res) => {
    res.send("THIS IS SECRET!")
});

app.get("/", (req, res) => {
    res.send("HI WELCOME TO MY WEBSITE");
})

app.use('/users', userRoutes);
app.use('/shifts', shiftRoutes);
app.use('/groups', groupRoutes);
app.use('/hospitals', hospitalRoutes);

app.listen(3000, () => {
    console.log("serving app on localhost:3000")
})