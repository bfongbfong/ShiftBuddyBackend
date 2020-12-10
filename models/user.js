const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/JobClassifications');

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
        enums: JobClassifications,
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
    ]
});

module.exports = mongoose.model('User', UserSchema);