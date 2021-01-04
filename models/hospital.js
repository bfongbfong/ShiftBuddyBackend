const mongoose = require('mongoose');
const { Schema } = mongoose;

const opts = { toJSON: { virtuals: true } };

const HospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    imageUrl: {
        type: String
    }
}, opts);

HospitalSchema.virtual('memberCount').
  get(function() { return this.members.length });

module.exports = mongoose.model('Hospital', HospitalSchema);