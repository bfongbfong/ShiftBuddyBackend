const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    locationString: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        requried: true
    },
    groups: [ 
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ]
});

module.exports = mongoose.model('Hospital', hospitalSchema);