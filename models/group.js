const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/JobClassifications');
require('../enums/ShiftLengths');

const opts = { toJSON: { virtuals: true } };

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        required: 'Hospital'
    },
    departmentName: {
        type: String,
        required: true
    },
    staffingCoordinatorEmail: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    },
    classifications: [
        // the jobs that are here
        {
            classification: {
                type: String,
                enum: JobClassifications,
                required: true
            },
            shiftLength: {
                type: String,
                enum: ShiftLengths,
                required: true
            }
        }
    ],
    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    imageUrl: {
        type: String
    }
}, opts);

GroupSchema.virtual('memberCount').
  get(function() { return this.members.length });

module.exports = mongoose.model('Group', GroupSchema);