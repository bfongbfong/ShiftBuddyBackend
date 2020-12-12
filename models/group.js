const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/JobClassifications');
require('../enums/ShiftLengths');

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    groupID: { // only if this is special, if not, just use mongo's _id
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
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
            ref: "User"
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    memberCount: { // somehow get it to always equal the number of members
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Group', GroupSchema);