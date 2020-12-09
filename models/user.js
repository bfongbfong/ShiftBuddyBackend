const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        enum: Classifications, 
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