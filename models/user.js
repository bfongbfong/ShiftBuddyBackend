const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/JobClassifications');
const saltRounds = 12;

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

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    user.password = await bcrypt.hash(user.password, saltRounds);

    next();
});


module.exports = mongoose.model('User', UserSchema);