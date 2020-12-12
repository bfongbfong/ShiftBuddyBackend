const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/JobClassifications');
const bcrypt = require('bcrypt');
const { UnavailableForLegalReasons } = require('http-errors');
const saltRounds = 12;

const passwordLengthChecker = (password) => {

    if (!password) {
        return false;
    } else {
        return (password.length >= 6 && password.length <= 35);
    }
};

const validPassword = (password) => {

    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-zA-Z])(?=.*?[\d]).{6,35}$/);
        return regExp.test(password);
    }
}

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be between 6 and 35 characters.'
    },
    {
        validator: validPassword,
        message: 'Password must contain one letter and one number.'
    }
];

const validEmail = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

const emailValidators = [
    {
        validator: validEmail,
        message: 'Email must be valid.'
    },
]

const UserSchema = mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    classification: { 
        type: String,
        enum: JobClassifications,
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        validate: emailValidators
    },
    password: { 
        type: String, 
        required: true,
        validate: passwordValidators
    },
    groups: [
        {
            group: {
                type: Schema.Types.ObjectId, 
                ref: 'Group'
            },
            workEmail: {
                type: String,
            },
            employeeID: {
                type: String, 
            }
        }
    ],
    isPremium: {
        type: Boolean,
        default: false
    }
});

UserSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret.password
        return ret;
    }
})

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    user.password = await bcrypt.hash(user.password, saltRounds);

    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password); // did it sync RZ said "for control"
}

module.exports = mongoose.model('User', UserSchema);