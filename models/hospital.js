const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    groups: [ 
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ]
});

module.exports = mongoose.model('Hospital', hospitalSchema);