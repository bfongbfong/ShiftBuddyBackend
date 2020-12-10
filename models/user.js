const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/JobClassifications');

const UserSchema = mongoose.Schema({
    employeeID: {
        type: String, 
        required: true 
    },
    workEmail: {
        type: String, 
        required: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    classification: { 
        type: Schema.Types.ObjectId, 
        ref: 'JobClassification',
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    groups: { 
        type: Schema.Types.ObjectId, 
        ref: 'Group'
    }
});

module.exports = mongoose.model('User', UserSchema);